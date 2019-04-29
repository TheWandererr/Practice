class PostTools {
    static OK = 200;
    static PHOTO_POST_URL = '/photo-post?';
    static POST = 'post';
    static PUT = 'put';
    static _SKIP = 'skip';
    static _GET = 'get';
    static _DELETE = 'delete';
    static LINK = 'photoLink';
    static TAGS = 'hashTags';
    static DESCRIPTION = 'description';
    static _PHOTO_POSTS_URL = '/photo-posts?';
    static _PHOTO_POST_LIKE_URL = '/photo-post/like/';
    static async onError(resp) {
        // TEMP
        await resp.json().then((data)=> {
            console.log(JSON.stringify(data));
        });
    }
    static async onSuccess(resp) {
        return await resp.json();
    }
    static async getPost(id) {
        const url = `${this.PHOTO_POST_URL}id=${id}`;
        const resp = await fetch(url, {method: PostTools._GET});
        if (resp.status !== PostTools.OK) {
            alert('Error');
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async getPosts(skip=0, get=10, filterConfig={}) {
        let url = this._PHOTO_POSTS_URL;
        const params = [];
        Object.keys(filterConfig)
            .forEach((item)=>{
                params.push(`${item}=${filterConfig[item]}`);
            });
        url = `${url}${PostTools._SKIP}=${skip}&${PostTools._GET}=${get}`;
        if (params) {
                url = `${url}&${params.join('&')}`;
            }
        const resp = await fetch(url);
        if (resp.status !== PostTools.OK) {
            alert('Error');
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async delete(postId) {
        const self = this;
        const url = `${self.PHOTO_POST_URL}${Controller.ID}=${postId}`;
        const resp = await fetch(url, {method: self._DELETE});
        if (resp.status!==self.OK) {
            alert('Error');
        }
    }
    static async like(id) {
        const url = `${this._PHOTO_POST_LIKE_URL}${id}`;
        const resp = await fetch(url, {method: PostTools.POST});
        if (resp.status !== this.OK) {
            alert('Error');
        }
    }
    static async add(formData) {
        const url = PostTools.PHOTO_POST_URL;
        const resp = await fetch(url, {method: PostTools.POST, body: formData});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        }
    }
    static async edit(formData) {
        const url = PostTools.PHOTO_POST_URL;
        const resp = await fetch(url, {method: PostTools.PUT, body: formData});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        }
    }
    static async downloadImage(photoLink) {
        let url = '/photo-post?';
        url=`${url}${PostTools.LINK}=${photoLink}`;
        const resp = await fetch(url, {method: PostTools._GET});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        }
        return resp;
    }
    /* static _MIN_DESCRIPTION_LENGTH = 10;
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
                new Date(item.creationDate) <= new Date(dateTo));
        },
        dateFrom: function(collection, dateFrom) {
            return collection.filter((item) =>
                new Date(item.creationDate) >= new Date(dateFrom));
        },
        hashTags: function(collection, tagsArray) {
            return collection.filter((item) =>
                PostTools._isContainTag(item.hashTags, tagsArray));
        },
    };
    static _validateHelper = {
        description: function(decription) {
            decription = decription.replace(/\r?\n/g, '').trim();
            return decription.length >= PostTools._MIN_DESCRIPTION_LENGTH &&
                decription.length <= PostTools._MAX_DESCRIPTION_LENGTH;
        },
        hashTags: function(tags) {
            return tags.every(PostTools._isGreatTag);
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
    getPosts(skip = 0, get = 10, filterConfig = {}) {
        const self = this;
        let filteredPosts = self._posts.slice();
        Object.keys(filterConfig).forEach(function(field) {
            if (PostTools._filterHelper[field]) {
                filteredPosts = PostTools._filterHelper[field](filteredPosts,
                    filterConfig[field]);
            }
        });
        return filteredPosts.sort(PostTools._sortDownByDate).slice(skip, skip + get);
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
                        objectToEdit[item] = PostTools._toLowerCase(post[item]);
                    }
                }
            });
            if (PostTools._validate(objectToEdit, true)) {
                const index = this._posts.indexOf(tmp);
                this._posts.splice(index, 1, objectToEdit);
                PostTools.save(objectToEdit, {edit: true});
                return true;
            }
        }
        return false;
    }
    add(post, username) {
        if (PostTools._validate(post)) {
            post.creationDate = new Date();
            post.id = Math.floor(post.creationDate.valueOf() *
                Math.random()).toString();
            post.author = username;
            post.likes = [];
            post.hashTags = PostTools._toLowerCase(post.hashTags);
            this._posts.push(post);
            PostTools.save(post, {add: true});
            return true;
        }
        return false;
    }
    remove(id) {
        const tmp = this.get(id);
        if (tmp) {
            this._posts.splice(this._posts.indexOf(tmp), 1);
            PostTools.save(tmp, {del: true});
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
            if (!(PostTools._isContainFields(Object.keys(photoPost),
                requiredFields))) {
                return false;
            }
        }
        return Object.keys(PostTools._validateHelper).every((field) =>
            PostTools._validateHelper[field](photoPost[field]));
    }
    static _isContainFields(where, what) {
        return what.every(function(element) {
            return where.includes(element);
        });
    }
    static _isGreatTag(tag) {
        return tag.trim().length <= PostTools._MAX_TAG_LENGTH && tag.trim().length > 0;
    }
    static _isContainTag(where, what) {
        const tags = what.filter((item) => PostTools._isContainPart(where, item));
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
        post.creationDate = PostTools.strToDate(post.creationDate);
        return post;
    }*/
}
