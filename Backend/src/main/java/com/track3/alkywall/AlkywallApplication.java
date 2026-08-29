package com.track3.alkywall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class AlkywallApplication {

    public static void main(String[] args) {
         TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        
        SpringApplication.run(AlkywallApplication.class, args);
    }

}
