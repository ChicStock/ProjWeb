package com.example.demo.model.enums;

public enum UserRole {
    USUARIO("usuario"),
    LOJISTA("lojista");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
