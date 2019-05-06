SELECT NAME, makeamoment.photo_post.idUSER FROM makeamoment.photo_post INNER JOIN makeamoment.user
ON makeamoment.user.idUSER = makeamoment.photo_post.idUSER
GROUP BY makeamoment.photo_post.idUSER HAVING COUNT(makeamoment.photo_post.idUSER) > 3;