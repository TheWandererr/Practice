package com.bsu.practice.app.collection;

import java.util.*;
import java.util.stream.Collectors;

public class PhotoPost {
    private String id;
    private String description;
    private String photoLink;
    private String author;
    private Date createdAt;
    private List<String> hashTags;
    private List<String> likes;

    public PhotoPost(String author, String desc, String link, List<String> hashTags) {
        this.id = UUID.randomUUID().toString();
        this.author = author;
        this.createdAt = new Date();
        this.likes = new ArrayList<>();
        this.hashTags = toLowerCase(hashTags);
        this.photoLink = link;
        this.description = desc;
    }

    public PhotoPost(PhotoPost post) {
        this.id = post.id;
        this.author = post.author;
        this.createdAt = post.createdAt;
        this.hashTags = post.hashTags;
        this.photoLink = post.photoLink;
        this.description = post.description;
        this.likes = post.likes;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public List<String> getHashTags() {
        return hashTags;
    }

    public String getAuthor() {
        return author;
    }

    public String getDescription() {
        return description;
    }

    public String getPhotoLink() {
        return photoLink;
    }

    public String getId() {
        return id;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setHashTags(List<String> hashTags) {
        this.hashTags = hashTags;
    }

    public void setPhotoLink(String photoLink) {
        this.photoLink = photoLink;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public static List<String> fixTags(String tags) {
        if (tags != null) {
            return Arrays.stream(tags.split("[,]+")).filter(tag->!tag.equals("")).collect(Collectors.toList());
        } else return new ArrayList<>();
    }

    private List<String> toLowerCase(List<String> arr) {
        List<String> tmp = new ArrayList<>();
        for (String el : arr) {
            tmp.add(el.toLowerCase());
        }
        return tmp;
    }
}
