-- Условие не понял, два варианта прилагаются
-- 1
SELECT NAME, CREATION_DATE AS TIME, DESCRIPTION FROM makeamoment.photo_post INNER JOIN makeamoment.user
ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
ORDER BY CREATION_DATE;
-- 2
SELECT CREATION_DATE AS TIME, DESCRIPTION FROM makeamoment.photo_post INNER JOIN makeamoment.user
ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
WHERE NAME = 'bob'
ORDER BY CREATION_DATE;
