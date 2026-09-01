package com.track3.alkywall.controllers;

import com.track3.alkywall.config.ApiResponse;
import com.track3.alkywall.controllers.models.NewTransferRequest;
import com.track3.alkywall.services.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transfer")
public class TransferController {
    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createTransfer(
            Authentication authentication,
            @RequestBody @Valid NewTransferRequest transfer
    ) {
        transferService.createTransfer(
                authentication.getName(),
                transfer.sourceAccountNumber(),
                transfer.destinationAccount(),
                transfer.amount(),
                transfer.description()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, "Transferencia enviada"));
    }
}
