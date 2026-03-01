package com.limiteMEI.limiteMEI.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Classe que sobe junto com o spring,
 * Como utilizo um banco H2 ele cria dados simulados de forma automatica
 * para evitar trabalhos manuais
 *
 * Forma de funcionamento é bem simples, devera injetar o repository e no run criar os dados que quiser
 * Atenção a entidade precisa dos construtores
 */
@Component
public class DataBaseLoader implements CommandLineRunner {


    public DataBaseLoader() {


    }

    @Override
    public void run(String... args) {


    }


}