package com.bsu.practice.app.collection;


import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.session.DBConnection;
import com.bsu.practice.app.session.SQLExecutor;

import java.sql.*;
import java.util.*;

public class PostList implements ValidateHelper, PostDao {
    private static final String HASHTAGS = "hashTags";
    private static final String PHOTO_LINK = "photoLink";
    private static final String DESCRIPTION = "description";
    private static final int DOESNT_EXIST = -1;
    private static final String NULL_CONNECTION = "Connection to base failed. It's null";
    private static Connection con;

    public PostList() {
        con = DBConnection.getConnection();
    }

    @Override
    public List<PhotoPost> getAll(int skip, int get, Map<String, String> filterConfig) throws NullConnectionException, SQLException {
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        } else {
            return SQLExecutor.getAll(filterConfig, con, skip, get);
        }
    }

    @Override
    public PhotoPost addPost(PhotoPost post) throws NullConnectionException, SQLException {
        if (validate(post)) {
            if (con == null) {
                throw new NullConnectionException(NULL_CONNECTION);
            } else {
                int userID = SQLExecutor.fetchUserId(post.getAuthor(), con);
                if (userID != DOESNT_EXIST) {
                    if (SQLExecutor.insertPost(post, con, userID)) {
                        return post;
                    }
                }
            }
        }
        return null;
    }

    @Override
    public PhotoPost getPostById(String id) throws NullConnectionException, SQLException {
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        } else {
            return SQLExecutor.fetchPost(id, con);
        }
    }

    @Override
    public PhotoPost deletePost(PhotoPost toDelete) throws NullConnectionException, SQLException {
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        } else {
            SQLExecutor.deletePost(toDelete.getId(), con);
        }
        return toDelete;
    }

    @Override
    public PhotoPost editPostById(String id, Map<String, String> edited) throws NullConnectionException, SQLException {
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        } else {
            PhotoPost tmp = SQLExecutor.fetchPost(id, con);
            if (tmp == null) {
                return null;
            }
            if (edited.containsKey(DESCRIPTION)) {
                tmp.setDescription(edited.get(DESCRIPTION));
            }
            if (edited.containsKey(HASHTAGS)) {
                tmp.setHashTags(PhotoPost.fixTags(edited.get(HASHTAGS)));
            }
            if (edited.containsKey(PHOTO_LINK)) {
                tmp.setPhotoLink(edited.get(PHOTO_LINK));
            }
            if (validate(tmp)) {
                SQLExecutor.editPost(tmp, con);
                return tmp;
            }
            return null;
        }
    }

    @Override
    public PhotoPost like(String id, String userName) throws NullConnectionException, SQLException {
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        } else {
            PhotoPost target = SQLExecutor.fetchPost(id, con);
            if (target == null) {
                return null;
            }
            List<String> likes = target.getLikes();
            int index = likes.indexOf(userName);
            if (index == DOESNT_EXIST) {
                likes.add(userName);
            } else {
                likes.remove(userName);
            }
            String condition = index == DOESNT_EXIST ? SQLExecutor.BD_LIKE_INSERT_POST_LIKE : SQLExecutor.BD_LIKE_DELETE_POST_LIKE;
            SQLExecutor.updatePostLike(target, con, SQLExecutor.fetchUserId(userName, con), condition);
            target.setLikes(likes);
            return target;
        }
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