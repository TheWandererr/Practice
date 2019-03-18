class PostList {
    static _MIN_DESCRIPTION_LENGTH = 10;
    static _MAX_DESCRIPTION_LENGTH = 200;
    static _MAX_TAG_LENGTH = 20;
    static _filterHelper = {
        author: function(collection, author) {
            return collection.filter((item) => !item.author.toLowerCase()
                .trim()
                .includes(author.toLowerCase().trim()));
        },
        dateTo: function(collection, dateTo) {
            return collection.filter((item) =>
                item.creationDate <= dateTo);
        },
        dateFrom: function(collection, dateFrom) {
            return collection.filter((item) =>
                item.creationDate >= dateFrom);
        },
        hashTags: function(collection, tagsArray) {
            return collection.filter((item) =>
                PostList._isContainTag(item.hashTags, tagsArray));
        },
    };
    static _validateHelper = {
        description: function(decription) {
            return decription.length >= PostList._MIN_DESCRIPTION_LENGTH &&
                decription.length <= PostList._MAX_DESCRIPTION_LENGTH;
        },
        hashTags: function(tags) {
            return tags.every(PostList._isGreatTag);
        },
        photoLink: function(link) {
            return link.length > 0;
        },
    };
    constructor(initialPosts) {
        this._posts = (initialPosts || []);
    }

    clear() {
        this._posts = [];
    }

    getPage(skip = 0, get = 10, filterConfig = {}) {
        const self = this;
        let filteredPosts = this._posts.slice();
        Object.keys(filterConfig).forEach(function(field) {
            if (PostList._filterHelper[field]) {
                filteredPosts = PostList._filterHelper[field](filteredPosts,
                    filterConfig[field]);
            }
        });
        return filteredPosts.slice(skip, skip + get).sort(self._sortDownByDate);
    }

    edit(id, post) {
        if (post) {
            const tmp = this.get(id);
            if (!tmp) {
                return false;
            }
            const objectToEdit = {};
            Object.keys(tmp).forEach((item) => objectToEdit[item] = tmp[item]);
            Object.keys(post).forEach((item) => {
                switch (item) {
                    case 'description':
                    case 'likes':
                    case 'photoLink': {
                        objectToEdit[item] = post[item];
                        break;
                    }
                    case 'hashTags': {
                        objectToEdit[item] = this._toLowerCase(post[item]);
                    }
                }
            });
            if (PostList._validate(objectToEdit, true)) {
                const index = this._posts.indexOf(tmp);
                this._posts.splice(index, 1, objectToEdit);
                return true;
            }
        }
        return false;
    }

    add(post) {
        post.creationDate = new Date();
        post.id = Math.floor(post.creationDate.valueOf() *
            Math.random()).toString();
        post.author = `Name for <${post.id}>`;//  temporary solution
        post.likes = [];
        if (PostList._validate(post)) {
            post.hashTags = this._toLowerCase(post.hashTags);
            this._posts.push(post);
            return true;
        }
        return false;
    }

    remove(id) {
        const tmp = this.get(id);
        if (tmp) {
            this._posts.splice(this._posts.indexOf(tmp), 1);
            return true;
        }
        return false;
    }

    get(id) {
        return this._posts.find((value) => value.id === id);
    }

    addAll(posts) {
        if (posts) {
            const self = this;
            const failedValidation = [];
            posts.forEach(function(item) {
                if (!self.add(item)) {
                    failedValidation.push(item);
                }
            });
            return failedValidation;
        }
        return posts;
    }

    static _validate(photoPost, afterEdit = false) {
        if (!afterEdit) {
            const requiredFields = [
                'id',
                'description',
                'creationDate',
                'hashTags',
                'likes',
                'author',
                'photoLink',
            ];
            if (!(PostList._isContainFields(Object.keys(photoPost),
                requiredFields))) {
                return false;
            }
        }
        const isGreat = [];
        let status = false;
        if (photoPost) {
            Object.keys(photoPost).forEach(function(field) {
                if (PostList._validateHelper[field]) {
                    if (field) {
                        status = PostList._validateHelper[field](photoPost[field]);
                        isGreat.push(status);
                    } else {
                        isGreat.push(false);
                    }
                }
            });
        }
        return !isGreat.includes(false);
    }

    static _isContainFields(where, what) {
        return what.every(function(element) {
            return where.includes(element);
        });
    }

    static _isGreatTag(tag) {
        return tag.trim().length <= PostList._MAX_TAG_LENGTH && tag.trim().length > 0;
    }

    static _isContainTag(where, what) {
        const tags = what.filter((item) => where.includes(item));
        return tags.length > 0;
    }

    _sortDownByDate(a, b) {
        return b.creationDate - a.creationDate;
    }

    _toLowerCase(arr) {
        return arr.toString().toLowerCase().split(',');
    }
}

const obj = new PostList([
    {
        id: '5',
        description: 'Do more than u can',
        creationDate: new Date('2019-03-07T23:30:00'),
        author: 'Petr',
        photoLink: 'http://life',
        hashTags: [],
        likes: [],
    },
    {
        id: '6',
        description: 'GO GO GO GO GO',
        creationDate: new Date('2019-03-05T23:30:00'),
        author: 'LEXA',
        photoLink: 'http://lexa',
        hashTags: ['JUSTGO'],
        likes: [],
    },
]);
console.log(obj.addAll([
    {
        description: 'Life is life',
        photoLink: '',
        hashTags: [],
        likes: [],
    },
    {
        description: 'Look at that!!!',
        photoLink: 'http://look',
        hashTags: ['444444444444444444444444'],
        likes: [],
    },
    {
        description: 'Pam pam pam',
        photoLink: 'http://ganna',
        hashTags: ['qqqwwweeerrrtttyyyuo'],
        likes: [],
    },
    {
        description: 'My favorite car',
        photoLink: 'http://lexa',
        hashTags: ['auto'],
        likes: [],
    },
    {
        description: 'Hi, my dear friends',
        photoLink: 'http://chelik',
        hashTags: ['family', 'friend'],
        likes: [],
    },
    {
        description: 'Hello, my dear dad',
        photoLink: 'http://chel',
        hashTags: [],
        likes: [],
    },
    {
        description: 'car house honor',
        photoLink: 'http://molly',
        hashTags: [],
        likes: [],
    },
    {
        description: 'its my home',
        photoLink: 'http://valya',
        hashTags: [],
        likes: [],
    },
    {
        description: 'sport sport sport!!!',
        photoLink: 'http://serega',
        hashTags: [],
        likes: [],
    },
    {
        description: 'I love you',
        photoLink: 'http://kris',
        hashTags: [],
        likes: [],
    },
    {
        description: 'thanks for day',
        hashTags: [],
        likes: [],
    },
    {
        description: 'pam param pam pam',
        photoLink: 'http://mac',
        hashTags: [],
        likes: [],
    },
    {
        description: 'funny moment',
        photoLink: 'http://alex',
        hashTags: [],
        likes: [],
    },
    {
        description: 'animals are wonderful',
        photoLink: 'http://felya',
        hashTags: [],
        likes: [],
    },
    {
        description: 'lovely boy',
        photoLink: 'http://max',
        hashTags: [],
        likes: [],
    },
    {
        creationDate: new Date('2019-03-07'),
        photoLink: 'http://Sparkle',
        hashTags: [],
        likes: [],
    },
    {
        description: 'love me like you do',
        photoLink: 'http://ellie',
        hashTags: [],
        likes: [],
    },
    {
        description: 'Hey, soul sister',
        photoLink: 'http://train',
        hashTags: [],
        likes: [],
    },
    {
        description: 'wake me up in the sky',
        hashTags: ['avia'],
        likes: [],
    },
]));
console.log(obj.getPage(0, 10,
    {dateFrom: new Date('2019-03-06'), dateTo: new Date('2019-03-10 21:00')}));
console.log(obj.add([]));
console.log(obj.add(
    {hashTags: ['IUYT'], description: 'I was there', photoLink: 'http'}
    ));
console.log(obj.add(
    {hashTags: [], description: 'I was there', photoLink: 'http'}
    ));
console.log(obj.edit('5', {likes: ['Masha'], hashTags: ['OK']}));
console.log(obj.get('5'));
console.log(obj.getPage(0, 10, {hashTags: ['auto']}));
console.log(obj.edit('22566', {
    likes: ['Masha'],
}));
console.log(obj.remove('1'));
console.log(obj.remove('11111'));
console.log(obj.clear());
console.log(obj.getPage());
console.log(obj.add({a: 'ff'}));
