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
            decription = decription.replace(/\r?\n/g, '').trim();
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
    constructor() {
        this._posts = [];
        this.restore();
    }
    clear() {
        this._posts = [];
    }
    getPage(skip = 0, get = 10, filterConfig = {}) {
        const self = this;
        let filteredPosts = self._posts.slice();
        Object.keys(filterConfig).forEach(function(field) {
            if (PostList._filterHelper[field]) {
                filteredPosts = PostList._filterHelper[field](filteredPosts,
                    filterConfig[field]);
            }
        });
        return filteredPosts.sort(PostList._sortDownByDate).slice(skip, skip + get);
    }
    edit(id, post) {
        if (post) {
            const tmp = this.get(id);
            if (!tmp) {
                return false;
            }
            const objectToEdit = {};
            Object.keys(tmp).forEach((item) => {
                objectToEdit[item] = tmp[item];
            });
            Object.keys(post).forEach((item) => {
                switch (item) {
                    case 'description':
                    case 'photoLink': {
                        objectToEdit[item] = post[item];
                        break;
                    }
                    case 'hashTags': {
                        objectToEdit[item] = PostList._toLowerCase(post[item]);
                    }
                }
            });
            if (PostList._validate(objectToEdit, true)) {
                const index = this._posts.indexOf(tmp);
                this._posts.splice(index, 1, objectToEdit);
                PostList.save(objectToEdit, {edit: true});
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
            post.hashTags = PostList._toLowerCase(post.hashTags);
            this._posts.push(post);
            PostList.save(post, {add: true});
            return true;
        }
        return false;
    }
    remove(id) {
        const tmp = this.get(id);
        if (tmp) {
            this._posts.splice(this._posts.indexOf(tmp), 1);
            PostList.save(tmp, {del: true});
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
            PostList.save(tmp, {edit: true});
            return true;
        } else {
            tmp.likes.splice(index, 1);
            PostList.save(tmp, {edit: true});
            return false;
        }
    }
    getPostListLength() {
        return this._posts.length;
    }
    getPosts() {
        return this._posts;
    }
    restore() {
        Object.keys(localStorage).forEach((id) => {
            this._posts.push(this._fixPostDate(JSON.parse(localStorage.getItem(id))));
        });
    }
    static strToDate(str) {
        return new Date(str);
    }
    static save(post, params) {
        if (params.add) {
            localStorage.setItem(post.id, JSON.stringify(post));
        }
        if (params.del) {
            localStorage.removeItem(post.id);
        }
        if (params.edit) {
            localStorage.removeItem(post.id);
            localStorage.setItem(post.id, JSON.stringify(post));
        }
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
        return Object.keys(PostList._validateHelper).every((field) =>
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
        const tags = what.filter((item) => PostList._isContainPart(where, item));
        return tags.length > 0 && where.length > 0;
    }
    static _isContainPart(where, tag) {
        const res = where.filter((item) => item.includes(tag));
        return res.length > 0;
    }
    static _sortDownByDate(a, b) {
        return b.creationDate - a.creationDate;
    }
    static _toLowerCase(arr) {
        return arr.length ? arr.toString().toLowerCase().split(',') : [];
    }
    _fixPostDate(post) {
        post.creationDate = PostList.strToDate(post.creationDate);
        return post;
    }
}
