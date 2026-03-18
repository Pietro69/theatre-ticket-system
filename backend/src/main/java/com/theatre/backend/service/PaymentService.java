package com.theatre.backend.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.theatre.backend.entity.Reservation;
import com.theatre.backend.entity.ReservationStatus;
import com.theatre.backend.entity.Ticket;
import com.theatre.backend.exception.NotFoundException;
import com.theatre.backend.repository.ReservationRepository;
import com.theatre.backend.repository.TicketRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final ReservationRepository reservationRepository;
    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    @Value("${app.stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${app.stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public PaymentService(ReservationRepository reservationRepository,
                          TicketRepository ticketRepository,
                          EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.ticketRepository = ticketRepository;
        this.emailService = emailService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createCheckoutSession(Long reservationId) throws Exception {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Reservation is not in PENDING state");
        }

        List<Ticket> tickets = ticketRepository.findByReservationId(reservationId);
        long totalCents = (long) (tickets.stream().mapToDouble(Ticket::getPrice).sum() * 100);

        String showTitle = reservation.getPerformance().getShow().getTitle();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/payment/cancel?reservation_id=" + reservationId)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(totalCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Lístok — " + showTitle)
                                                                .setDescription("Rezervácia #" + reservationId)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("reservationId", String.valueOf(reservationId))
                .build();

        Session session = Session.create(params);

        reservation.setStripeSessionId(session.getId());
        reservationRepository.save(reservation);

        return session.getUrl();
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader) throws Exception {
        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        if ("checkout.session.completed".equals(event.getType())) {
            // Použijeme getRawJson() kvôli nekompatibilite Stripe SDK s API verziou 2026-02-25.clover
            String rawJson = event.getDataObjectDeserializer().getRawJson();
            JsonObject sessionJson = JsonParser.parseString(rawJson).getAsJsonObject();

            JsonObject metadata = sessionJson.getAsJsonObject("metadata");
            if (metadata == null || !metadata.has("reservationId")) return;
            String reservationId = metadata.get("reservationId").getAsString();

            String paymentIntent = sessionJson.has("payment_intent") && !sessionJson.get("payment_intent").isJsonNull()
                    ? sessionJson.get("payment_intent").getAsString() : null;

            Reservation reservation = reservationRepository.findById(Long.parseLong(reservationId))
                    .orElse(null);
            if (reservation == null) return;

            if (reservation.getStatus() == ReservationStatus.PAID) return;

            reservation.setStatus(ReservationStatus.PAID);
            reservation.setStripePaymentIntentId(paymentIntent);
            reservationRepository.save(reservation);

            List<Ticket> tickets = ticketRepository.findByReservationId(reservation.getId());
            emailService.sendReservationConfirmation(reservation, tickets);

            log.info("Reservation #{} marked as PAID", reservationId);
        }
    }

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void cancelExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expired = reservationRepository
                .findByStatusAndExpiresAtBefore(ReservationStatus.PENDING, now);

        for (Reservation r : expired) {
            r.setStatus(ReservationStatus.CANCELED);
            reservationRepository.save(r);
            emailService.sendReservationCancellation(r);
            log.info("Reservation #{} auto-canceled (expired)", r.getId());
        }
    }
}
