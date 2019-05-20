package com.bsu.practice.app.session;


import org.apache.commons.dbcp2.BasicDataSource;

public class DataSourceUtil {

    private static final String DB_URL =
            "jdbc:mysql://localhost:3306/makeamoment?useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&useSSL=false";
    private static final String DB_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "1234";
    private static final int CONN_POOL_SIZE = 20;
    private static final int MAX_STATEMENTS = 100;

    private static BasicDataSource bds = null;

    public static BasicDataSource getDataSource() {
        if (bds == null) {
            bds = new BasicDataSource();
            bds.setDriverClassName(DB_DRIVER);
            bds.setUrl(DB_URL);
            bds.setUsername(DB_USER);
            bds.setPassword(DB_PASS);
            bds.setInitialSize(CONN_POOL_SIZE);
            bds.setMaxOpenPreparedStatements(MAX_STATEMENTS);
        }
        return bds;
    }
}
