-- По id
SELECT * FROM makeamoment.photo_post WHERE idUSER=8 AND DESCRIPTION LIKE '%hello%';
-- По NAME
SELECT DESCRIPTION, CREATION_DATE, PHOTO_LINK, idPHOTO_POST FROM makeamoment.photo_post INNER JOIN makeamoment.user
ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
WHERE DESCRIPTION LIKE '%hello%' AND NAME='sam';