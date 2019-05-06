SELECT 
    idPHOTO_POST,
    PHOTO_LINK,
    DESCRIPTION,
    CREATION_DATE,
    NAME
FROM
    makeamoment.photo_post
        INNER JOIN
    makeamoment.user ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
GROUP BY makeamoment.photo_post.DESCRIPTION
HAVING LENGTH(makeamoment.photo_post.DESCRIPTION) > 100;