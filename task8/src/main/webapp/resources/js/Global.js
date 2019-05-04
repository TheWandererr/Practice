const Global = (function() {
    // let ctrlDate = new Date().getMilliseconds();
    // setFixDate();
    let filterConf = {};
    let display = {};
    let skip = 0;
    const name = getName();
    const unLog = getUnLog();
    const user = createUser();
    const get = 10;
    const postTools = new PostTools();
    const pageController = new Controller(user);
    const posts = PostTools.getPosts(skip, Number.MAX_SAFE_INTEGER, filterConf).then((answer) => {
        display = new Display(user, answer.slice(skip, skip + get), answer.length);
        return answer;
    });
    /* function setFixDate() {
        const fetched = sessionStorage.getItem('sDate');
        if (fetched) {
            ctrlDate = Number.parseInt(fetched);
        } else {
            sessionStorage.setItem('sDate', ctrlDate.toString());
        }
    }*/
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
        afterLog: async function() {
            try {
                const resp = await PostTools.getPosts(skip, get);
                display.getPage(resp);
            } catch (e) {
                console.log(e.message);
            }
        },
        login: async function(inUser) {
            const resp = await fetch('/login', {method: 'post', body: inUser});
            if (resp.status !== PostTools.OK) {
                return PostTools.onError(resp);
            }
        },
        logout: async function() {
            try {
                await fetch('/logout', {method: 'post'});
                Global.processUser();
                display.getPage();
            } catch (e) {
                console.log(e.message);
            }
        },
        filterPosts: async function(filterConfig = {}) {
            try {
                skip = 0;
                if (!isEmptyFilter(filterConfig)) {
                    Object.keys(filterConfig).forEach((key) => filterConf[key] = filterConfig[key]);
                } else {
                    filterConf = {};
                }
                const resp = await PostTools.getPosts(skip, Number.MAX_SAFE_INTEGER, filterConf);
                display.getPage(resp.slice(skip, skip + get), false, false, resp.length);
            } catch (e) {
                console.log(JSON.stringify(e));
            }
        },
        removePhotoPost: async function(id) {
            try {
                skip = 0;
                await PostTools.delete(id);
                const resp = await PostTools.getPosts(skip, get, filterConf);
                display.getPage(resp, false, true);
            } catch (e) {
                console.log(e.message);
            }
        },
        likePostById: async function(id) {
            try {
                await PostTools.like(id);
                const resp = await PostTools.getPost(id);
                display.updatePostLikes(resp);
            } catch (e) {
                console.log(e.message);
            }
        },
        dislikePostById: async function(id) {
            try {
                await PostTools.like(id);
                const resp = await PostTools.getPost(id);
                display.updatePostLikes(resp, false);
            } catch (e) {
                console.log(e.message);
            }
        },
        showMore: async function() {
            try {
                skip += 10;
                const resp = await PostTools.getPosts(skip, get, filterConf);
                display.showMore(resp);
            } catch (e) {
                console.log(e.message);
            }
        },
        addPhotoPost: async function(formData, event) {
            try {
                skip = 0;
                await PostTools.add(formData);
                const resp = await PostTools.getPosts(skip, get);
                Display.postsAddFormSwap(event);
                Display.deleteContentFromAddForm();
                display.getPage(resp);
            } catch (e) {
                console.log(e.message);
                alert('Error: check inputs');
            }
        },
        editPhotoPost: async function(formData, event) {
            try {
                skip = 0;
                await PostTools.edit(formData);
                const resp = await PostTools.getPosts(skip, get);
                Display.postsAddFormSwap(event);
                Display.deleteContentFromAddForm();
                display.getPage(resp);
            } catch (e) {
                console.log(e.message);
                alert('Error: check inputs');
            }
        },
    };
}());
