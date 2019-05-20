package com.bsu.practice.app.session;

import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class DBConnection {

    private static Connection connection = null;

    public static Connection getConnection() {
        try (BasicDataSource dataSource = DataSourceUtil.getDataSource()) {
            connection = dataSource.getConnection();
        } catch (SQLException sqlE) {
            System.out.println(sqlE.getMessage());
        }
        return connection;
    }
}
