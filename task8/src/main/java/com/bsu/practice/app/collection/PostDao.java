package com.bsu.practice.app.collection;

import com.bsu.practice.app.exception.NullConnectionException;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface PostDao {


    PhotoPost editPostById(String id, Map<String, String> edited) throws NullConnectionException, SQLException;

    PhotoPost addPost(PhotoPost post) throws NullConnectionException, SQLException;

    PhotoPost getPostById(String id) throws NullConnectionException, SQLException;

    PhotoPost deletePost(PhotoPost post) throws NullConnectionException, SQLException;

    PhotoPost like(String id, String username) throws NullConnectionException, SQLException;

    List<PhotoPost> getAll(int skip, int get, Map<String, String> filterConfig) throws NullConnectionException, SQLException;

}
