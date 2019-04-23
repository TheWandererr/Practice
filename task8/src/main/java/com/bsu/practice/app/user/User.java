package com.bsu.practice.app.user;


public class User {

    private String username;
    private boolean logged;
    private static User instance;

    private User() {
        this.username = "";
        this.logged = false;
    }

    public static User getInstance() {
        if(instance == null){
            instance = new User();
        }
        return instance;
    }

    public void setLogged(boolean logged) {
        this.logged = logged;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public boolean isLogged() {
        return logged;
    }
}
