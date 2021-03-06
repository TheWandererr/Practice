-- Число тэгов каждого поста
SELECT
	NAME,
	makeamoment.photo_post.idPHOTO_POST, 
	DESCRIPTION, 
	SUM(CASE WHEN makeamoment.tags.idTAG > 0 THEN 1 ELSE 0 END) AS TAGS_COUNT
FROM makeamoment.photo_post
inner join makeamoment.user
	on makeamoment.photo_post.idUSER = makeamoment.user.idUSER 
left join makeamoment.tags
	on makeamoment.photo_post.idPHOTO_POST = makeamoment.tags.idPHOTO_POST
group by DESCRIPTION;