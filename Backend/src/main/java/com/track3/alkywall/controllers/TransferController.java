package com.track3.alkywall.controllers;

import com.track3.alkywall.config.DataApiResponse;
import com.track3.alkywall.controllers.models.NewTransferRequest;
import com.track3.alkywall.controllers.models.TransferResponse;
import com.track3.alkywall.models.Transfer;
import com.track3.alkywall.services.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transaction/transfer")
public class TransferController {
    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    public ResponseEntity<DataApiResponse<TransferResponse>> createTransfer(
            Authentication authentication,
            @RequestBody @Valid NewTransferRequest newTransfer
    ) {
        Transfer transfer = transferService.createTransfer(
                authentication.getName(),
                newTransfer.sourceAccountNumber(),
                newTransfer.destinationAccount(),
                newTransfer.amount(),
                newTransfer.description()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new DataApiResponse<>(
                true,
                "Transferencia enviada",
                TransferResponse.from(transfer)
        ));
    }

    @GetMapping
    public ResponseEntity<DataApiResponse<List<TransferResponse>>> getTransfers(
            Authentication authentication
    ) {
        List<Transfer> transfers = transferService.getTransfersSentByUser(authentication.getName());
        List<TransferResponse> response = transfers.stream()
                .map(TransferResponse::from)
                .toList();

        return ResponseEntity.ok(new DataApiResponse<>(
                true,
                "Transferencias obtenidas exitosamente",
                response
        ));
    }
}
