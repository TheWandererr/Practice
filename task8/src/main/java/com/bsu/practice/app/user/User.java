package com.bsu.practice.app.user;

import com.bsu.practice.app.collection.PhotoPost;

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

    public boolean hasWritePermission(PhotoPost reqPost) {
        return reqPost != null && username.equals(reqPost.getAuthor()) && logged;
    }

    public boolean hasWritePermission() {
        return logged;
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
}
