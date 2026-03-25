package com.theatre.backend.service;

import com.theatre.backend.entity.*;
import com.theatre.backend.exception.NotFoundException;
import com.theatre.backend.repository.HallRepository;
import com.theatre.backend.repository.PerformanceRepository;
import com.theatre.backend.repository.ReservationRepository;
import com.theatre.backend.repository.ShowRepository;
import com.theatre.backend.repository.TicketRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final ReservationRepository reservationRepository;
    private final TicketRepository ticketRepository;
    private final ShowRepository showRepository;
    private final HallRepository hallRepository;
    private final EmailService emailService;

    public PerformanceService(PerformanceRepository performanceRepository,
                              ReservationRepository reservationRepository,
                              TicketRepository ticketRepository,
                              ShowRepository showRepository,
                              HallRepository hallRepository,
                              EmailService emailService) {
        this.performanceRepository = performanceRepository;
        this.reservationRepository = reservationRepository;
        this.ticketRepository = ticketRepository;
        this.showRepository = showRepository;
        this.hallRepository = hallRepository;
        this.emailService = emailService;
    }

    public List<Performance> getAllPerformances() {
        return performanceRepository.findAll();
    }

    public Performance getPerformanceById(Long id) {
        return performanceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Performance with id " + id + " not found."));
    }

    public List<Performance> getPerformancesByShowId(Long showId) {
        return performanceRepository.findByShowId(showId);
    }

    public List<Performance> getPerformancesByHallId(Long hallId) {
        return performanceRepository.findByHallId(hallId);
    }

    public Performance createPerformance(Performance performance) {
        return performanceRepository.save(performance);
    }

    @Transactional
    public Performance updatePerformance(Long id, Performance updated) {
        Performance existing = getPerformanceById(id);
        existing.setStartTime(updated.getStartTime());
        existing.setStatus(updated.getStatus());
        if (updated.getShow() != null && updated.getShow().getId() != null) {
            Show show = showRepository.findById(updated.getShow().getId())
                    .orElseThrow(() -> new NotFoundException("Show not found."));
            existing.setShow(show);
        }
        if (updated.getHall() != null && updated.getHall().getId() != null) {
            Hall hall = hallRepository.findById(updated.getHall().getId())
                    .orElseThrow(() -> new NotFoundException("Hall not found."));
            existing.setHall(hall);
        }
        return performanceRepository.save(existing);
    }

    @Transactional
    public void deletePerformance(Long id) {
        Performance performance = getPerformanceById(id);
        List<Reservation> reservations = reservationRepository.findByPerformanceId(id);
        for (Reservation reservation : reservations) {
            if (reservation.getStatus() == com.theatre.backend.entity.ReservationStatus.ACTIVE) {
                emailService.sendPerformanceCancellation(reservation, performance);
            }
            ticketRepository.deleteByReservationId(reservation.getId());
        }
        reservationRepository.deleteAll(reservations);
        performanceRepository.delete(performance);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void finishPastPerformances() {
        List<Performance> scheduledPerformances = performanceRepository.findByStatus(PerformanceStatus.SCHEDULED);
        LocalDateTime now = LocalDateTime.now();

        List<Performance> toUpdate = new ArrayList<>();

        for (Performance performance : scheduledPerformances) {
            if (performance.getStartTime() == null || performance.getShow() == null || performance.getShow().getDurationMinutes() == null) {
                continue;
            }

            LocalDateTime performanceEnd = performance.getStartTime()
                    .plusMinutes(performance.getShow().getDurationMinutes());

            if (performanceEnd.isBefore(now)) {
                performance.setStatus(PerformanceStatus.FINISHED);
                toUpdate.add(performance);
            }
        }

        if (!toUpdate.isEmpty()) {
            performanceRepository.saveAll(toUpdate);
        }
    }


}
