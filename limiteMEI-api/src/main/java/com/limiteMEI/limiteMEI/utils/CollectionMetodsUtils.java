package com.limiteMEI.limiteMEI.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CollectionMetodsUtils {


        /** Verifica se uma lista é vazia */
        public static <T> boolean isEmpty(Collection<T> input) {
            return input == null || input.isEmpty();
        }

        /** Verifica se uma lista NÃO é vazia */
        public static <T> boolean isNotEmpty(Collection<T> input) {
            return !isEmpty(input);
        }

        /** Verifica se um Objeto NÃO é Null */
        public static boolean isNotObjectEmpty(Object entity) {
            return entity != null;
        }

        /** Verifica se um campo do tipo String é null ou " "(Vazio) */
        public static boolean isStringEmpty(String string) {
            return string == null || string == "" || string.trim().length() == 0;
        }

        /**
         * Metodo em teste
         * Devera retornar somente os dados diferentes entre as duas listas
         */
        public static <T> List<T> difference(List<T> lista1, List<T> lista2){
            List<T> diferentes = new ArrayList<>(lista1);

            diferentes.addAll(lista2);
            diferentes.removeAll(lista1);
            diferentes.removeAll(lista2);

            return diferentes;
        }


        public static Boolean validaDocumento(String documento){
            if(documento.length() == 11 ){
                return  validateCPF(documento);
            }else if(documento.length() == 14 ){
                return  validateCNPJ(documento);
            }

            return false;
        }

        private static Boolean validateCPF(String cpf) {
            // Remove pontos e traços do CPF, se houver
            cpf = cpf.replaceAll("\\D", "");

            // Verifica se o CPF tem 11 dígitos
            if (cpf.length() != 11) {
                return false;
            }

            // Verifica se todos os dígitos são iguais, o que invalida o CPF
            if (cpf.matches("(\\d)\\1{10}")) {
                return false;
            }

            try {
                // Calcula o primeiro dígito verificador
                int soma = 0;
                for (int i = 0; i < 9; i++) {
                    soma += (cpf.charAt(i) - '0') * (10 - i);
                }
                int digito1 = 11 - (soma % 11);
                digito1 = (digito1 > 9) ? 0 : digito1;

                // Calcula o segundo dígito verificador
                soma = 0;
                for (int i = 0; i < 10; i++) {
                    soma += (cpf.charAt(i) - '0') * (11 - i);
                }
                int digito2 = 11 - (soma % 11);
                digito2 = (digito2 > 9) ? 0 : digito2;

                // Verifica se os dígitos verificadores conferem
                return (cpf.charAt(9) - '0' == digito1) && (cpf.charAt(10) - '0' == digito2);
            } catch (NumberFormatException e) {
                return false; // Caso haja algum erro de conversão, CPF é inválido
            }
        }

        public static String imprimeCPF(String cpf) {
            return(cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." +
                    cpf.substring(6, 9) + "-" + cpf.substring(9, 11));
        }

        private static Boolean validateCNPJ(String cnpj) {
            // Remove pontos, barras e traços do CNPJ, se houver
            cnpj = cnpj.replaceAll("\\D", "");

            // Verifica se o CNPJ tem 14 dígitos
            if (cnpj.length() != 14) {
                return false;
            }

            // Verifica se todos os dígitos são iguais, o que invalida o CNPJ
            if (cnpj.matches("(\\d)\\1{13}")) {
                return false;
            }

            try {
                // Cálculo do primeiro dígito verificador
                int[] peso1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
                int soma = 0;
                for (int i = 0; i < 12; i++) {
                    soma += (cnpj.charAt(i) - '0') * peso1[i];
                }
                int digito1 = 11 - (soma % 11);
                digito1 = (digito1 < 2) ? 0 : digito1;

                // Cálculo do segundo dígito verificador
                int[] peso2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
                soma = 0;
                for (int i = 0; i < 13; i++) {
                    soma += (cnpj.charAt(i) - '0') * peso2[i];
                }
                int digito2 = 11 - (soma % 11);
                digito2 = (digito2 < 2) ? 0 : digito2;

                // Verifica se os dígitos verificadores conferem
                return (cnpj.charAt(12) - '0' == digito1) && (cnpj.charAt(13) - '0' == digito2);
            } catch (NumberFormatException e) {
                return false; // Caso haja algum erro de conversão, CNPJ é inválido
            }
        }
    }
