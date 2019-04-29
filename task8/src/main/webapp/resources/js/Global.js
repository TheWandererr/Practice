const Global = (function() {
    const name = getName();
    const unLog = getUnLog();
    const user = createUser();
    const get = 10;
    const postTools = new PostTools();
    const pageController = new Controller(user);
    let filterConf = {};
    let display = {};
    let skip = 0;
    const posts = PostTools.getPosts(skip, Number.MAX_SAFE_INTEGER, filterConf).then((answer) => {
        display = new Display(user, answer.slice(skip, skip + get), answer.length);
        return answer;
    });
    function isEmptyFilter(object) {
        return JSON.stringify(object) === '{}';
    }
    function getUnLog() {
        return name === null;
    }
    function getName() {
        return sessionStorage.getItem('username');
    }
    function createUser() {
        return {name, unLog};
    }
    function activateUser(come) {
        user.name = come.username;
        user.unLog = false;
        sessionStorage.setItem('username', user.name);
    }
    function deactivateUser() {
        user.unLog = true;
        user.name = '';
        sessionStorage.removeItem('username');
    }
    return {
        processUser: function(come) {
            if (come) {
                activateUser(come);
            } else {
                deactivateUser();
            }
            display.updateUserInfo(user);
        },
        afterLog: function() {
            PostTools.getPosts(skip, get).then((respone) => {
                display.getPage(respone);
            });
        },
        login: async function(inUser) {
         return await fetch('/login', {method: 'post', body: inUser});
        },
        logout: async function() {
            const resp = await fetch('/logout', {method: 'post'});
            if (resp.status !== PostTools.OK) {
                    alert('Error');
            } else {
                Global.processUser();
                display.getPage();
            }
        },
        filterPosts: function(filterConfig = {}) {
            skip = 0;
            if (!isEmptyFilter(filterConfig)) {
                Object.keys(filterConfig).forEach((key) => filterConf[key] = filterConfig[key]);
            } else {
                filterConf = {};
            }
            PostTools.getPosts(skip, Number.MAX_SAFE_INTEGER, filterConf).then((response) => {
                display.getPage(response.slice(skip, skip + get), false, false, response.length);
            });
        },
        removePhotoPost: function(id) {
            skip = 0;
            PostTools.delete(id).then(() => {
                PostTools.getPosts(skip, get, filterConf).then((response)=> {
                    display.getPage(response, false, true);
                });
            });
        },
        likePostById: function(id) {
            PostTools.like(id).then(() => {
                PostTools.getPost(id).then((resp) => {
                    display.updatePostLikes(resp);
                });
            });
        },
        dislikePostById: function(id) {
            PostTools.like(id).then(() => {
                PostTools.getPost(id).then((resp) => {
                    display.updatePostLikes(resp, false);
                });
            });
        },
        showMore: function() {
            skip += 10;
            PostTools.getPosts(skip, get, filterConf).then((resp)=>{
                display.showMore(resp);
            });
        },
        addPhotoPost: async function(formData, event) {
            skip = 0;
            PostTools.add(formData)
                .then(()=> {
                        PostTools.getPosts(skip, get).then((resp)=> {
                        Display.postsAddFormSwap(event);
                        Display.deleteContentFromAddForm();
                        display.getPage(resp);
                    });
                })
                .catch(()=> {
                    alert('Error');
                });
        },
        editPhotoPost: async function(formData, event) {
            skip = 0;
            PostTools.edit(formData)
                .then(() => {
                    PostTools.getPosts(skip, get).then((resp) => {
                        Display.postsAddFormSwap(event);
                        Display.deleteContentFromAddForm();
                        display.getPage(resp);
                    });
                })
                .catch(()=> {
                alert('Error');
            });
        },
        /* editPhotoPost: async function(formData) {
            const utl = PostTools.PHOTO_POST_URL;
            return await fetch(url, {method: PostTools})
        }*/
        /*  getPostById: function(id) {
            return postService.get(id);
        },
        showMore: function() {
            skip += 10;
            const nextPosts = postService.getPosts(skip, get, filterConf);
            view.showMore(nextPosts);
        },
        addPhotoPost: function(post) {
            if (!user.unLog && postService.add(post, user.name)) {
                skip = 0;
                view.getPosts(postService.getPosts(skip, get), true);
                return true;
            }
            return false;
        },
        removePhotoPost: function(id) {
            if (!user.unLog && postService.remove(id)) {
                skip = 0;
                view.getPosts(postService.getPosts(skip, get, filterConf), false, true);
                return true;
            }
            return false;
        },
        editPhotoPost: function(id, editedPost) {
            if (!user.unLog && postService.edit(id, editedPost)) {
                skip = 0;
                view.getPosts(postService.getPosts(skip, get));
                return true;
            }
            return false;
        },
        filterPosts: function(filterConfig = {}) {
            skip = 0;
            if (!isEmptyFilter(filterConfig)) {
                Object.keys(filterConfig).forEach((key) => filterConf[key] = filterConfig[key]);
            } else {
                filterConf = {};
            }
            const result = postService.getPosts(skip, postService.getPostListLength(), filterConf);
            view.getPosts(result.slice(skip, skip + get), false, false, result.length);
        },
        likePostById: function(id) {
            if (!user.unLog && postService.like(id, user.name)) {
                view.updatePostLikes(postService.get(id));
                return true;
            }
            return false;
        },
        dislikePostById: function(id) {
            if (!user.unLog && !postService.like(id, user.name)) {
                view.updatePostLikes(postService.get(id), false);
                return true;
            }
            return false;
        },

        login: function(username) {
            user.name = username;
            user.unLog = false;
            view.updateUserInfo(user);
            view.getPosts(postService.getPosts());
        },*/
    };
}());
