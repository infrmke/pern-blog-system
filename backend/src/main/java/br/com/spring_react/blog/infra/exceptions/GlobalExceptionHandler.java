package br.com.spring_react.blog.infra.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // lida com ROTAS QUE NÃO EXISTEM
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NoHandlerFoundException ex) {
        return ErrorResponse.build(HttpStatus.NOT_FOUND, "Route not found.", "ROUTE_NOT_FOUND",
                null);
    }

    // fallback pra qualquer outro erro (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex) {
        return ErrorResponse.build(HttpStatus.INTERNAL_SERVER_ERROR, "There was an unexpected error. " +
                "Try again later.", "INTERNAL_SERVER_ERROR", ex);
    }
}
