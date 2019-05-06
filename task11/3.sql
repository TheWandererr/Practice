-- По id
SELECT * FROM makeamoment.photo_post WHERE idUSER=1 AND CREATION_DATE='2019-05-01';
-- По NAME
SELECT DESCRIPTION, CREATION_DATE, PHOTO_LINK, idPHOTO_POST FROM makeamoment.photo_post INNER JOIN makeamoment.user
ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
WHERE NAME = 'bob' AND CREATION_DATE='2019-05-01';