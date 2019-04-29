package com.bsu.practice.app.collection;

import java.util.List;

public interface ValidateHelper {
    int MIN_DESCRIPTION_LENGTH = 10;
    int MAX_DESCRIPTION_LENGTH = 200;
    int MAX_TAG_LENGTH = 20;
    int MIN_LINK_LENGTH = 1;
    String UNDEFINED = "undefined";

    default boolean isRightDescription(String desc) {
        if(desc == null) {
            return false;
        }
        desc = desc.replaceAll("[\r\n]+", "").trim();
        return desc.length() >= MIN_DESCRIPTION_LENGTH && desc.length() <= MAX_DESCRIPTION_LENGTH;
    }

    default boolean isRightTags(List<String> tags) {
        for (String tag : tags) {
            if (tag.trim().length() > MAX_TAG_LENGTH) {
                return false;
            }
        }
        return true;
    }

    default boolean isRightPhotoLink(String link) {
        if(link == null || link.equals(UNDEFINED)) {
            return false;
        }
        return link.trim().length() >= MIN_LINK_LENGTH;
    }
}
