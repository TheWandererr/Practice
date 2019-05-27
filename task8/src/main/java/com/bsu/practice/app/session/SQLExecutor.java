package com.bsu.practice.app.session;

import com.bsu.practice.app.collection.PhotoPost;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SQLExecutor {

    public static final String BD_LIKE_DELETE_POST_LIKE =
            "DELETE FROM makeamoment.like WHERE idPHOTO_POST = ? AND idUSER = ?";
    public static final String BD_LIKE_INSERT_POST_LIKE =
            "INSERT INTO makeamoment.like (idPHOTO_POST, idUSER) VALUES (?,?)";
    private static final String BD_USER_GET_USER_ID = "SELECT idUSER FROM makeamoment.user WHERE NAME = ?";
    private static final String BD_USER_GET_USER_NAME = "SELECT NAME FROM makeamoment.user WHERE idUSER = ?";
    private static final String BD_PHOTO_POST_GET_POST = "SELECT * FROM makeamoment.photo_post WHERE idPHOTO_POST = ?";
    private static final String BD_PHOTO_POST_DELETE_POST = "DELETE FROM makeamoment.photo_post WHERE idPHOTO_POST = ?";
    private static final String BD_PHOTO_POST_UPDATE_POST = "UPDATE makeamoment.photo_post SET DESCRIPTION = ?, PHOTO_LINK = ? WHERE idPHOTO_POST = ?;";
    private static final String BD_PHOTO_POST_INSERT_POST =
            "INSERT INTO makeamoment.photo_post (DESCRIPTION, CREATION_DATE, PHOTO_LINK, idUSER) VALUES (?, ?, ?, ?)";
    private static final String BD_TAGS_INSERT_TAGS =
            "INSERT INTO makeamoment.tags (TAG, idPHOTO_POST) VALUES (?, ?)";
    private static final String BD_TAGS_DELETE_TAGS =
            "DELETE FROM makeamoment.tags WHERE idPHOTO_POST = ?";
    private static final String BD_TAGS_GET_TAGS =
            "SELECT TAG FROM makeamoment.tags WHERE idPHOTO_POST = ?";
    private static final String BD_LIKE_GET_POST_LIKES =
            "SELECT NAME FROM makeamoment.user INNER JOIN makeamoment.like\n" +
                    "ON makeamoment.user.idUSER = makeamoment.like.idUSER WHERE idPHOTO_POST = ?";
    private static final String BD_COMMON_GET_ALL_POSTS_ID =
            "SELECT DISTINCT makeamoment.photo_post.idPHOTO_POST\n" +
                    "FROM makeamoment.photo_post LEFT JOIN makeamoment.tags ON makeamoment.photo_post.idPHOTO_POST = makeamoment.tags.idPHOTO_POST\n" +
                    "INNER JOIN makeamoment.user ON makeamoment.photo_post.idUSER = makeamoment.user.idUSER" +
                    " WHERE NAME LIKE ? AND CREATION_DATE BETWEEN ? AND ?";
    private static final String BD_USER_GET_PASS = "SELECT PASS FROM makeamoment.user WHERE NAME = ?";
    private static final String AUTHOR = "author";
    private static final String DATE_TO = "dateTo";
    private static final String DATE_FROM = "dateFrom";
    private static final String HASHTAGS = "hashTags";
    private static final String SQL_AND = " AND ";
    private static final String SQL_OR = " OR ";
    private static final String SQL_TAG = "TAG LIKE ";
    private static final String SQL_Q = "?";
    private static final String SQL_COMMA = ", ";
    private static final String SQL_SEMICOLON = ";";
    private static final String SQL_LIMIT = " LIMIT ";
    private static final String SQL_ORDER_BY_DATE = " ORDER BY CREATION_DATE DESC";
    private static final int DOESNT_EXIST = -1;
    private static final int FIRST_KEY = 1;
    private static final int SECOND_KEY = 2;
    private static final int THIRD_KEY = 3;
    private static final int FOURTH_KEY = 4;
    private static final int FIFTH_KEY = 5;
    private static final int EMPTY = 0;

    public static String fetchUserPass(String username, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_USER_GET_PASS)) {
            ps.setString(FIRST_KEY, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getString(FIRST_KEY);
            } else {
                return null;
            }
        }
    }

    public static List<PhotoPost> getAll(Map<String, String> params, Connection con, int skip, int get) throws SQLException {
        List<String> postsID = fetchAllPostsID(params, con, skip, get);
        List<PhotoPost> posts = new ArrayList<>();
        for (String postID : postsID) {
            posts.add(fetchPost(postID, con));
        }
        return posts;
    }

    public static int fetchUserId(String userName, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_USER_GET_USER_ID)) {
            ps.setString(FIRST_KEY, userName);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Integer.parseInt(rs.getString(FIRST_KEY));
                }
            }
        }
        return DOESNT_EXIST;
    }

    public static boolean insertPost(PhotoPost post, Connection con, int userID) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_PHOTO_POST_INSERT_POST, Statement.RETURN_GENERATED_KEYS)) {
            con.setAutoCommit(false);
            ps.setString(FIRST_KEY, post.getDescription());
            ps.setLong(SECOND_KEY, post.getCreatedAt());
            ps.setString(THIRD_KEY, post.getPhotoLink());
            ps.setInt(FOURTH_KEY, userID);
            ps.executeUpdate();
            String id = fetchPostId(ps.getGeneratedKeys());
            if (id != null) {
                insertPostTags(post.getHashTags(), id, con);
                post.setId(id);
                con.commit();
                return true;
            }
        } catch (SQLException sqlE) {
            try {
                con.rollback();
                return false;
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }
        } finally {
            con.setAutoCommit(true);
        }
        return false;
    }

    public static PhotoPost fetchPost(String id, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_PHOTO_POST_GET_POST)) {
            ps.setString(FIRST_KEY, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String userId = rs.getString(FIFTH_KEY);
                    String username = fetchUserName(userId, con);
                    return new PhotoPost(
                            rs.getString(FIRST_KEY),
                            username,
                            rs.getString(SECOND_KEY),
                            rs.getString(FOURTH_KEY),
                            fetchPostElem(rs.getString(FIRST_KEY), con, BD_TAGS_GET_TAGS),
                            Long.parseLong(rs.getString(THIRD_KEY)),
                            fetchPostElem(rs.getString(FIRST_KEY), con, BD_LIKE_GET_POST_LIKES)
                    );
                } else {
                    return null;
                }
            }
        }
    }

    public static void deletePost(String id, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_PHOTO_POST_DELETE_POST)) {
            ps.setString(FIRST_KEY, id);
            ps.executeUpdate();
        }
    }

    public static void editPost(PhotoPost post, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_PHOTO_POST_UPDATE_POST)) {
            con.setAutoCommit(false);
            updatePostTags(post.getId(), con, post.getHashTags());
            ps.setString(FIRST_KEY, post.getDescription());
            ps.setString(SECOND_KEY, post.getPhotoLink());
            ps.setString(THIRD_KEY, post.getId());
            ps.executeUpdate();
        } catch (SQLException sqlE) {
            try {
                con.rollback();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }
        } finally {
            con.setAutoCommit(true);
        }
    }

    public static void updatePostLike(PhotoPost post, Connection con, int userId, String condition) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(condition)) {
            ps.setInt(FIRST_KEY, Integer.parseInt(post.getId()));
            ps.setInt(SECOND_KEY, userId);
            ps.executeUpdate();
        }
    }

    private static void deletePostTags(String postId, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_TAGS_DELETE_TAGS)) {
            ps.setString(FIRST_KEY, postId);
            ps.executeUpdate();
        }
    }

    private static void insertPostTags(List<String> tags, String id, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_TAGS_INSERT_TAGS)) {
            for (String tag : tags) {
                ps.setString(FIRST_KEY, tag);
                ps.setString(SECOND_KEY, id);
                ps.executeUpdate();
            }
        }
    }

    private static void updatePostTags(String postId, Connection con, List<String> tags) throws SQLException {
        deletePostTags(postId, con);
        insertPostTags(tags, postId, con);
    }

    private static String refactorPrStmtForAllPosts(List<String> tags) {
        StringBuilder statement = new StringBuilder(BD_COMMON_GET_ALL_POSTS_ID);
        int cnt = EMPTY;
        int size = tags.size();
        if (size != EMPTY) {
            statement.append(SQL_AND);
        }
        while (cnt < size) {
            statement.append(SQL_TAG);
            statement.append(SQL_Q);
            if (cnt != size - 1) {
                statement.append(SQL_OR);
            }
            cnt++;
        }
        statement.append(SQL_ORDER_BY_DATE);
        statement.append(SQL_LIMIT);
        statement.append(SQL_Q);
        statement.append(SQL_COMMA);
        statement.append(SQL_Q);
        statement.append(SQL_SEMICOLON);
        return statement.toString();
    }

    private static String fetchPostId(ResultSet rs) throws SQLException {
        if (rs.next()) {
            return rs.getString(FIRST_KEY);
        }
        return null;
    }

    private static List<String> fetchPostElem(String idPost, Connection con, String elem) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(elem)) {
            ps.setString(FIRST_KEY, idPost);
            try (ResultSet rs = ps.executeQuery()) {
                List<String> res = new ArrayList<>();
                while (rs.next()) {
                    res.add(rs.getString(FIRST_KEY));
                }
                return res;
            }
        }
    }

    private static List<String> fetchAllPostsID(Map<String, String> params, Connection con, int skip, int get) throws SQLException {
        List<String> tags = PhotoPost.fixTags(params.get(HASHTAGS));
        String statement = refactorPrStmtForAllPosts(tags);
        try (PreparedStatement ps = con.prepareStatement(statement)) {
            //String author = params.containsKey(AUTHOR) ? "\'%" + params.get(AUTHOR) + "%\'" : "%%";
            ps.setString(FIRST_KEY, params.get(AUTHOR));
            ps.setLong(SECOND_KEY, Long.parseLong(params.get(DATE_FROM)));
            ps.setLong(THIRD_KEY, Long.parseLong(params.get(DATE_TO)));
            int curColumn = FOURTH_KEY;
            for (String tag : tags) {
                ps.setString(curColumn, "%" + tag + "%");
                curColumn++;
            }
            ps.setInt(curColumn++, skip);
            ps.setInt(curColumn, get);
            ResultSet rs = ps.executeQuery();
            List<String> postsID = new ArrayList<>();
            while (rs.next()) {
                postsID.add(rs.getString(FIRST_KEY));
            }
            return postsID;
        }
    }

    private static String fetchUserName(String id, Connection con) throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(BD_USER_GET_USER_NAME)) {
            ps.setString(FIRST_KEY, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString(FIRST_KEY);
                }
            }
        }
        return null;
    }
}
