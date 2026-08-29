package com.track3.alkywall.config.security;

import com.track3.alkywall.services.JwtService;
import com.track3.alkywall.services.JwtUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final JwtUserDetailsService jwtUserDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, JwtUserDetailsService jwtUserDetailsService){
        this.jwtService = jwtService;
        this.jwtUserDetailsService = jwtUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Se verifica que exista un header como Authorization: Bearer ...
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authorizationHeader.substring(7); // Se extrae el token
        try {
            String email = jwtService.getEmailFromToken(jwt);

            // Se crea un securityContext con el cual Spring usa para saber si hay un usuario autenticado
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(email);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);
        }catch(Exception e){
            log.error("Error al obtener email de jwt token", e);
        }finally {
            filterChain.doFilter(request, response);
        }
    }
}
