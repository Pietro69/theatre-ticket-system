package com.theatre.backend.controller;

import com.theatre.backend.dto.CreateReservationRequest;
import com.theatre.backend.dto.ReservationResponse;
import com.theatre.backend.entity.Reservation;
import com.theatre.backend.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations()
                .stream()
                .map(reservationService::mapToResponse)
                .toList();
    }

    @PostMapping
    public ReservationResponse createReservation(@Valid @RequestBody CreateReservationRequest request) {
        Reservation reservation = reservationService.createReservation(request);
        return reservationService.mapToResponse(reservation);
    }

    @DeleteMapping("{id}/cancel")
    public Reservation deleteReservation(@PathVariable Long id) {
        return reservationService.cancelReservation(id);
    }

    @GetMapping("/{id}")
    public ReservationResponse getReservation(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }
}