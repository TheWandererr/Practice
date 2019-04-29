# Practice

/photo-post
1)Post request:
enctype - form-data/multipart-config
required: photoLink, description
2)Get request:
required photoLink or postID
3)Put request:
enctype - form-data/multipart-config
required: photoLink, description, postID
4)Delete request:
enctype - form-data/multipart-config or URL param
required: valid postID

/photo-post/like/{postID}
Post request:
required: valid postID

/login
Post request:
enctype - raw
required: valid pass & username

/photo-posts
Get request:
required: skip & get params
