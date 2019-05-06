SELECT NAME FROM makeamoment.photo_post INNER JOIN makeamoment.user
ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
WHERE CREATION_DATE=CURDATE()
GROUP BY makeamoment.photo_post.idUSER
HAVING COUNT(makeamoment.photo_post.idUSER) > 3;