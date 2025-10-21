package com.example.demo.dto;

import com.example.demo.model.PedidoStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoRequestDTO {

    private PedidoStatus pedidoStatus;
}
