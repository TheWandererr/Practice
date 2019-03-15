const P = (function () {
    const photoPosts = [
        {
            id: "1",
            description: "Love is love",
            creationDate: new Date("2019-03-06T23:00:00"),
            author: "Petr Ivanov",
            photoLink: "http://",
            hashTags: ["auto"],
            likes: []
        },
        {
            id: "2",
            description: "Life is life",
            creationDate: new Date("2019-03-07T23:30:00"),
            author: "Petr",
            photoLink: "http://life",
            hashTags: [],
            likes: []
        },
        {
            id: "3",
            description: "Look at that!!!",
            creationDate: new Date("2019-03-06T23:00:00"),
            author: "Ivan",
            photoLink: "http://look",
            hashTags: ["motobike"],
            likes: []
        },
        {
            id: "4",
            description: "Pam pam pam",
            creationDate: new Date("2019-03-06T23:00:00"),
            author: "Ganna",
            photoLink: "http://ganna",
            hashTags: ["qqqwwweeerrrtttyyyuo"],
            likes: []
        },
        {
            id: "5",
            description: "My favorite car",
            creationDate: new Date("2019-03-07T23:00:00"),
            author: "Lexa",
            photoLink: "http://lexa",
            hashTags: [],
            likes: []
        },
        {
            id: "6",
            description: "Hi, my dear friends",
            creationDate: new Date(),
            author: "Chelik",
            photoLink: "http://chelik",
            hashTags: [],
            likes: []
        },
        {
            id: "7",
            description: "Hello, my dear dad",
            creationDate: new Date("2018-03-06T23:00:00"),
            author: "Chel",
            photoLink: "http://chel",
            hashTags: [],
            likes: []
        },
        {
            id: "8",
            description: "car house honor",
            creationDate: new Date(),
            author: "molly",
            photoLink: "http://molly",
            hashTags: [],
            likes: []
        },
        {
            id: "9",
            description: "its my home",
            creationDate: new Date("2019-03-07T23:00:00"),
            author: "valya",
            photoLink: "http://valya",
            hashTags: [],
            likes: []
        },
        {
            id: "10",
            description: "sport sport sport!!!",
            creationDate: new Date(),
            author: "serega",
            photoLink: "http://serega",
            hashTags: [],
            likes: []
        },
        {
            id: "11",
            description: "I love you",
            creationDate: new Date(),
            author: "Kris",
            photoLink: "http://kris",
            hashTags: [],
            likes: []
        },
        {
            id: "12",
            description: "thanks for day",
            creationDate: new Date(),
            author: "katya",
            photoLink: "http://katya",
            hashTags: [],
            likes: []
        },
        {
            id: "13",
            description: "pam param pam pam",
            creationDate: new Date(),
            author: "mac",
            photoLink: "http://mac",
            hashTags: [],
            likes: []
        },
        {
            id: "14",
            description: "fanny moment",
            creationDate: new Date(),
            author: "alex",
            photoLink: "http://alex",
            hashTags: [],
            likes: []
        },
        {
            id: "15",
            description: "animals are wonderful",
            creationDate: new Date(),
            author: "felya",
            photoLink: "http://felya",
            hashTags: [],
            likes: []
        },
        {
            id: "16",
            description: "lovely boy",
            creationDate: new Date(),
            author: "max",
            photoLink: "http://max",
            hashTags: [],
            likes: []
        },
        {
            id: "17",
            description: "kimi no Na wa",
            creationDate: new Date("2019-03-07"),
            author: "Sparkle",
            photoLink: "http://Sparkle",
            hashTags: [],
            likes: []
        },
        {
            id: "18",
            description: "love me like you do",
            creationDate: new Date("2019-03-08"),
            author: "Ellie",
            photoLink: "http://ellie",
            hashTags: [],
            likes: []
        },
        {
            id: "19",
            description: "Hey, soul sister",
            creationDate: new Date(),
            author: "Train",
            photoLink: "http://train",
            hashTags: [],
            likes: []
        },
        {
            id: "20",
            description: "wake me up in the sky",
            creationDate: new Date(),
            author: "Gucci",
            photoLink: "http://Gucci",
            hashTags: ["avia"],
            likes: []
        }

    ];
    const user = "Kuzya";
    const requiredFields = ['id', 'description', 'creationDate', 'hashTags', 'likes', 'author', 'photoLink'];
    function sortDownByDate(a, b) {
        return b['creationDate'] - a['creationDate'];
    }
    function isContainTag(where, what) {
        let tags = what.filter((item) => where.includes(item) === true);
        return tags.length > 0;
    }
    function isGreatTag(tag) {
        return tag.trim().length < 21 && tag.trim().length > 0;
    }
    function isContainFields(where, what) {
        return what.every(function (element) {
            return where.includes(element);
        });
    }
    return {
        addPhotoPost: function (post) {
            post['id'] = new Date().getMilliseconds().toString();
            post['creationDate'] = new Date();
            post['author'] = user;
            post['likes'] = [];
            if (this.validatePhotoPost(post)) {
                let tmp = [];
                post['hashTags'].forEach(function (item) {
                    tmp.push(item.trim().toLowerCase());
                });
                post['hashTags'] = tmp;
                photoPosts.push(post);
                return true;
            }
            return false;
        },
        getPhotoPost: function (id) {
            return photoPosts.find((value) => value["id"] === id);
        },
        deletePhotoPost: function (id) {
            let tmp = this.getPhotoPost(id);
            if (tmp) {
                photoPosts.splice(photoPosts.IndexOf(tmp), 1);
                return true;
            }
            return false;
        },
        editPhotoPost: function (id, post) {
            let tmp = this.getPhotoPost(id);
            if (!tmp) {
                return false;
            }
            let objectToEdit = {};
            Object.keys(tmp).forEach((item) => objectToEdit[item] = tmp[item]);
            Object.keys(post).forEach((item) => {
                switch (item) {
                    case "description":
                    case "hashTags":
                    case "likes":
                    case "photoLink": {
                        objectToEdit[item] = post[item];
                        break;
                    }
                }
            });
            if (this.validatePhotoPost(objectToEdit, true)) {
                let index = photoPosts.indexOf(tmp);
                photoPosts.splice(index, 1, objectToEdit);
                return true;
            } else {
                return false;
            }
        },
        getPhotoPosts: function (skip = 0, get = 10, filterConfig = {}) {
            let filterHelper = {
                author: function (collection, author) {
                    return collection.filter((item) => item['author'].toLowerCase()
                        .trim()
                        .includes(author.toLowerCase().trim()) !== false);
                },
                dateTo: function (collection, dateTo) {
                    return collection.filter((item) => item['creationDate'] <= dateTo);
                },
                dateFrom: function (collection, dateTo) {
                    return collection.filter((item) => item['creationDate'] >= dateTo);
                },
                hashTags: function (collection, tagsArray) {
                    return collection.filter((item) => isContainTag(item['hashTags'], tagsArray));
                }
            };
            let filteredPosts = photoPosts.slice();
            Object.keys(filterConfig).forEach(function (field) {
                if (filterHelper[field]) {
                    filteredPosts = filterHelper[field](filteredPosts, filterConfig[field]);
                }
            });
            return filteredPosts.slice(skip, skip + get).sort(sortDownByDate);
        },
        validatePhotoPost: function (photoPost, afterEdit = false) {
            if (!afterEdit) {
                if (!(isContainFields(Object.keys(photoPost), requiredFields))) {
                    return false;
                }
            }
            let isGreat = [];
            let status = false;
            if (photoPost) {
                let validateHelper = {
                    description: function (decription) {
                        return decription.length > 9 && decription.length < 201;
                    },
                    hashTags: function (tags) {
                        return tags.every(isGreatTag);
                    },
                    photoLink: function (link) {
                        return link.length > 0;
                    }
                };
                Object.keys(photoPost).forEach(function (field) {
                    if (validateHelper[field]) {
                        status = validateHelper[field](photoPost[field]);
                        isGreat.push(status);
                    }
                });
            }
            return !isGreat.includes(false);
        }
    };
}());
//console.log(P.addPhotoPost({hashTags: ["IUYT"], description: 'I was there', photoLink: 'http'}));
//console.log(P.addPhotoPost({hashTags: [], description: 'I was there', photoLink:'http'}));
/*console.log(P.editPhotoPost('5',{
    likes: ['Masha']
}));*/
//console.log(P.getPhotoPost('5'));
//console.log(P.getPhotoPosts());
//console.log(P.getPhotoPosts(0,10, {author:'petr', dateTo:new Date('2019-03-07')}));
/*console.log(P.validatePhotoPost({
    id: new Date().getMilliseconds(),
    description: "Love is love",
    creationDate: new Date("2019-03-06T23:00:00"),
    author: "Petr Ivanov",
    photoLink: "http://",
    hashTags: ["auto", "dwdwdwdwfwklfwefkwfk"],
    likes: []
}));*/
/*console.log(P.validatePhotoPost({
    id: new Date().getMilliseconds(),
    description: "Love is love",
    creationDate: new Date("2019-03-06T23:00:00"),
    author: "Petr Ivanov",
    photoLink: "",
    hashTags: ["auto"],
    likes: []
}));*/
//console.log(P.getPhotoPost('1'));
/*console.log(P.editPhotoPost('1',{
    id: "1",
    description: "Love is COOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOl",
    creationDate: new Date("2019-03-06T23:00:00"),
    author: "Ivanov",
    photoLink: "http://",
    hashTags: ["buba", "dwdwdwdwfwwefkwfk"],
    likes: []
}));*/
//console.log(P.getPhotoPost('1'));
