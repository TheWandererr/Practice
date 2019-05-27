package com.bsu.practice.app.user;

import com.bsu.practice.app.exception.NullConnectionException;
import com.bsu.practice.app.session.DBConnection;
import com.bsu.practice.app.session.SQLExecutor;

import java.sql.Connection;
import java.sql.SQLException;

public class LoginService {

    private static Connection con;

    private static final String NULL_CONNECTION = "Connection to base failed. It's null";

    public static int isExist(String username) throws SQLException, NullConnectionException{
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        }
        return SQLExecutor.fetchUserId(username, con);
    }

    public static boolean isValid(String username, String pass) throws SQLException, NullConnectionException {
        if (con == null) {
            throw new NullConnectionException(NULL_CONNECTION);
        }
        String hashedPass = SQLExecutor.fetchUserPass(username, con);
        return HashMD5.isHashEqual(pass, hashedPass);
    }

    public void initService() {
        con = DBConnection.getConnection();
    }
}
