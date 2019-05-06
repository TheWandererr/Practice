SELECT NAME, SUM(CASE WHEN CREATION_DATE = '2019-05-09' THEN 1 ELSE 0 END) AS COUNT
FROM makeamoment.user LEFT JOIN makeamoment.photo_post
ON makeamoment.photo_post.idUSER = makeamoment.user.idUSER
group by user.idUSER;