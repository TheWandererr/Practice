package com.bsu.practice.app.user;

import org.apache.commons.codec.digest.DigestUtils;

public class HashMD5 {

    private static String getHash(String password) {
        return DigestUtils.md5Hex(password);
    }

    public static boolean isHashEqual(String password, String passwordHash) {
        return getHash(password).equals(passwordHash);
    }
}
