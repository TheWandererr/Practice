class PostList {
    static _MIN_DESCRIPTION_LENGTH = 10;
    static _MAX_DESCRIPTION_LENGTH = 200;
    static _MAX_TAG_LENGTH = 20;
    static _filterHelper = {
        author: function(collection, author) {
            return collection.filter((item) => item.author.toLowerCase()
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
        return filteredPosts.sort(self._sortDownByDate).slice(skip, skip + get);
    }
    edit(id, post) {
        if (post) {
            const tmp = this.get(id);
            if (!tmp) {
                return false;
            }
            const objectToEdit = {};
            Object.keys(tmp).forEach((item) => {objectToEdit[item] = tmp[item]});
            Object.keys(post).forEach((item) => {
                switch (item) {
                    case 'description':
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
    add(post, username) {
        if (PostList._validate(post)) {
            post.creationDate = new Date();
            post.id = Math.floor(post.creationDate.valueOf() *
                Math.random()).toString();
            post.author = username;
            post.likes = [];
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
    like(id, user) {
        const tmp = this.get(id);
        const index = tmp.likes.indexOf(user);
        if (index === -1) {
            tmp.likes.push(user);
            return true;
        } else {
            tmp.likes.splice(index, 1);
            return false;
        }
    }
    getPostListLength() {
        return this._posts.length;
    }
    static _validate(photoPost, afterEdit = false) {
        if (!afterEdit) {
            const requiredFields = [
                'description',
                'hashTags',
                'photoLink',
            ];
            if (!(PostList._isContainFields(Object.keys(photoPost),
                requiredFields))) {
                return false;
            }
        }
        return  Object.keys(PostList._validateHelper).every((field) =>
            PostList._validateHelper[field](photoPost[field]));
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
