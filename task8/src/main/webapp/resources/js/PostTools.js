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
        const err = await resp.json();
        const reason = JSON.stringify(err);
        throw new Error(reason);
    }
    static async onSuccess(resp) {
        try {
            return await resp.json();
        } catch (e) {
            return {status: PostTools.OK};
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
            return PostTools.onError(resp);
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async getPost(id) {
        const url = `${this.PHOTO_POST_URL}id=${id}`;
        const resp = await fetch(url, {method: PostTools._GET});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async delete(postId) {
        const self = this;
        const url = `${self.PHOTO_POST_URL}${Controller.ID}=${postId}`;
        const resp = await fetch(url, {method: self._DELETE});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async like(id) {
        const url = `${this._PHOTO_POST_LIKE_URL}${id}`;
        const resp = await fetch(url, {method: PostTools.POST});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async add(formData) {
        const url = PostTools.PHOTO_POST_URL;
        const resp = await fetch(url, {method: PostTools.POST, body: formData});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        } else {
            return PostTools.onSuccess(resp);
        }
    }
    static async edit(formData) {
        const url = PostTools.PHOTO_POST_URL;
        const resp = await fetch(url, {method: PostTools.PUT, body: formData});
        if (resp.status !== PostTools.OK) {
            return PostTools.onError(resp);
        } else {
            return PostTools.onSuccess(resp);
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
}
