package com.bsu.practice.app.collection;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PostList implements ValidateHelper {
    private static final String AUTHOR = "author";
    private static final String DATE_TO = "dateTo";
    private static final String DATE_FROM = "dateFrom";
    private static final String HASHTAGS = "hashTags";
    private static final String PHOTO_LINK = "photoLink";
    private static final String DESCRIPTION = "description";
    private static final String DATE_FORMAT = "yyyy-MM-dd";
    private List<PhotoPost> photoPosts;
    private static PostList instance;
    //private static final String JS_DATE_STANDARD_FORMAT = "EE MMM d y H:m:s 'GMT'z";
    //private static final String JAVA_DATE_STANDARD_FORMAT = "EEE MMM dd HH:mm:ss z yyyy";

    private PostList() {
        photoPosts = new ArrayList<>();
    }

    public static PostList getInstance() {
        if (instance == null) {
            instance = new PostList();
        }
        return instance;
    }

    private void isSimilarAuthor(List<PhotoPost> toFilter, String author) {
        Iterator<PhotoPost> it = toFilter.iterator();
        PhotoPost elem;
        while (it.hasNext()) {
            elem = it.next();
            if (!elem.getAuthor().toLowerCase().contains(author.toLowerCase())) {
                it.remove();
            }
        }
    }

    private void isAfterDate(List<PhotoPost> toFilter, Date dateFrom) {
        Iterator<PhotoPost> it = toFilter.iterator();
        PhotoPost elem;
        while (it.hasNext()) {
            elem = it.next();
            if (elem.getCreatedAt().compareTo(dateFrom) <= 0) {
                it.remove();
            }
        }
    }

    private void isBeforeDate(List<PhotoPost> toFilter, Date dateTo) {
        Iterator<PhotoPost> it = toFilter.iterator();
        PhotoPost elem;
        while (it.hasNext()) {
            elem = it.next();
            if (elem.getCreatedAt().compareTo(dateTo) >= 0) {
                it.remove();
            }
        }
    }

    private void isContainTags(List<PhotoPost> toFilter, List<String> tags) {
        Iterator<PhotoPost> it = toFilter.iterator();
        PhotoPost elem;
        while (it.hasNext()) {
            elem = it.next();
            if (!isContainTag(elem.getHashTags(), tags)) {
                it.remove();
            }
        }
    }

    private boolean isContainTag(List<String> where, List<String> what) {
        if (where.size() == 0) {
            return false;
        }
        Stream<String> whereStream = where.stream();
        for (String tag : what) {
            if (whereStream.anyMatch(elem -> elem.contains(tag))) {
                return true;
            }
        }
        return false;
    }

    public List<PhotoPost> getPage(int skip, int get, Map<String, String> filterConfig) {
        List<PhotoPost> filteredPosts = new ArrayList<>(photoPosts);
        String key;
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT, Locale.ENGLISH);
        for (Map.Entry<String, String> entry : filterConfig.entrySet()) {
            key = entry.getKey();
            if (key.equals(AUTHOR)) {
                isSimilarAuthor(filteredPosts, entry.getValue());
            }
            if (key.equals(DATE_FROM)) {
                try {
                    isAfterDate(filteredPosts, dateFormat.parse(entry.getValue()));
                } catch (ParseException e) {
                    return new ArrayList<>();
                }
            }
            if (key.equals(DATE_TO)) {
                try {
                    isBeforeDate(filteredPosts, dateFormat.parse(entry.getValue()));
                } catch (ParseException e) {
                    return new ArrayList<>();
                }
            }
            if (key.equals(HASHTAGS)) {
                isContainTags(filteredPosts, Arrays.asList(entry.getValue().split("[,]+")));
            }
        }
        int firstIndex = 0;
        int lastIndex = 0;
        if (filteredPosts.size() != 0)  {
            firstIndex = skip > filteredPosts.size() ? filteredPosts.size() : skip;
            lastIndex = skip + get > filteredPosts.size() ? filteredPosts.size() : skip + get;
        }
        return filteredPosts.stream().sorted(new Comparator<PhotoPost>() {
            @Override
            public int compare(PhotoPost o1, PhotoPost o2) {
                return o2.getCreatedAt().compareTo(o1.getCreatedAt());
            }
        }).collect(Collectors.toList()).subList(firstIndex, lastIndex);
    }

    public boolean add(PhotoPost post) {
        if (validate(post)) {
            this.photoPosts.add(post);
            return true;
        }
        return false;
    }

    public void remove(PhotoPost toDelete) {
        photoPosts.remove(toDelete);
    }

    public boolean like(String id, String username) {
        PhotoPost target = get(id);
        if (target == null) {
            return false;
        }
        List<String> likes = target.getLikes();
        int index = likes.indexOf(username);
        if (index == -1) {
            likes.add(username);
            target.setLikes(likes);
        } else {
            likes.remove(username);
            target.setLikes(likes);
        }
        return true;
    }

    public PhotoPost get(String id) {
        List<PhotoPost> out = this.photoPosts.stream().filter(post -> post.getId().equals(id)).collect(Collectors.toList());
        if (out.size() > 0) {
            return out.get(0);
        } else {
            return null;
        }
    }

    public boolean edit(String id, Map<String, String> edited) {
        PhotoPost currentPost = get(id);
        PhotoPost tmp = new PhotoPost(currentPost);
        String key;
        for (Map.Entry<String, String> entry : edited.entrySet()) {
            key = entry.getKey();
            if (key.equals(DESCRIPTION)) {
                tmp.setDescription(entry.getValue());
            }
            if (key.equals(HASHTAGS)) {
                tmp.setHashTags(Arrays.asList(entry.getValue().split("[,]+")));
            }
            if (key.equals(PHOTO_LINK)) {
                tmp.setPhotoLink(entry.getValue());
            }
        }
        if (validate(tmp)) {
            int index = this.photoPosts.indexOf(currentPost);
            photoPosts.remove(index);
            photoPosts.add(tmp);
            return true;
        }
        return false;
    }

    private boolean validate(PhotoPost post) {
        if (!isRightPhotoLink(post.getPhotoLink())) {
            return false;
        }
        if (!isRightDescription(post.getDescription())) {
            return false;
        }
        return isRightTags(post.getHashTags());
    }

}
