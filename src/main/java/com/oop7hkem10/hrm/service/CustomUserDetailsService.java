package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.repos.ResUserRepository;
import com.oop7hkem10.hrm.domain.ResUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService  implements UserDetailsService {
    @Autowired
    private ResUserRepository ResUserRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ResUser user = ResUserRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
}

