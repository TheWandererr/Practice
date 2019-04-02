const Global = (function() {
    const name = getName();
    const unLog = getUnLog();
    const user = createUser();
    const get = 10;
    const postList = new PostList();
    const pageController = new PageController(user);
    let filterConf = {};
    let skip = 0;
    /*  const posts = [
        {
            id: '31',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'bob',
            photoLink: 'images/1.jpg',
            hashTags: ['justdoit'],
            likes: ['IVAN'],
        },
        {
            id: '30',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'bob',
            photoLink: 'images/2.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '29',
            description: 'I love this world',
            creationDate: new Date(),
            author: 'kolya',
            photoLink: 'images/3.jpg',
            hashTags: [],
            likes: [],
        },
        {
            id: '28',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/4.jpg',
            hashTags: [],
            likes: [],
        },
        {
            id: '27',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'BOB',
            photoLink: 'images/10.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '26',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/11.jpg',
            hashTags: [],
            likes: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', '', 'j', 'k', 'l', 'm'],
        },
        {
            id: '25',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/7.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '24',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/5.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '23',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/3.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '22',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/2.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '21',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/8.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '20',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/11.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '1',
            description: 'GO GO GO GO GO',
            creationDate: new Date(),
            author: 'IVAN',
            photoLink: 'images/12.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '2',
            description: 'Do more than u can',
            creationDate: new Date('2018-03-21T23:30:00'),
            author: 'Petr',
            photoLink: 'images/2.jpg',
            hashTags: [],
            likes: [],
        },
        {
            id: '3',
            description: 'GO GO GO GO GO',
            creationDate: new Date('2018-03-20T23:30:00'),
            author: 'LEXA',
            photoLink: 'images/3.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '4',
            description: 'Do more than u can',
            creationDate: new Date('2019-03-19T23:30:00'),
            author: 'Petr',
            photoLink: 'images/4.jpg',
            hashTags: [],
            likes: [],
        },
        {
            id: '5',
            description: 'GO GO GO GO GO',
            creationDate: new Date('2019-03-18T23:30:00'),
            author: 'LEXA',
            photoLink: 'images/5.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '6',
            description: 'Do more than u can',
            creationDate: new Date('2019-03-17T23:32:00'),
            author: 'Petr',
            photoLink: 'images/6.jpg',
            hashTags: ['hi', 'bye'],
            likes: [],
        },
        {
            id: '7',
            description: 'GO GO GO GO GO',
            creationDate: new Date('2019-03-16T22:30:00'),
            author: 'LEXA',
            photoLink: 'images/7.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '8',
            description: 'Do more than u can',
            creationDate: new Date('2019-03-15T23:30:00'),
            author: 'KOSTYA',
            photoLink: 'images/8.jpg',
            hashTags: [],
            likes: [],
        },
        {
            id: '9',
            description: 'GO GO GO GO GO',
            creationDate: new Date('2019-03-14T23:30:00'),
            author: 'LEXA',
            photoLink: 'images/9.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '10',
            description: 'Do more than u can',
            creationDate: new Date('2019-03-13T23:30:00'),
            author: 'Petr',
            photoLink: 'images/12.jpg',
            hashTags: [],
            likes: [],
        },
        {
            id: '11',
            description: 'GO GO GO GO GO',
            creationDate: new Date('2019-03-12T23:30:00'),
            author: 'LEXA',
            photoLink: 'images/14.jpg',
            hashTags: ['justdoit'],
            likes: [],
        },
        {
            id: '12',
            description: 'Do more than u can',
            creationDate: new Date('2019-03-11T23:30:00'),
            author: 'Petr',
            photoLink: 'images/13.jpg',
            hashTags: [],
            likes: [],
        },
    ];*/
    const posts = postList.getPosts();
    const view = new View(user, postList.getPage(skip, get), posts.length);
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
    return {
        getPostById: function(id) {
            return postList.get(id);
        },
        showMore: function() {
            skip += 10;
            const nextPosts = postList.getPage(skip, get, filterConf);
            view.showMore(nextPosts);
        },
        addPhotoPost: function(post) {
            if (!user.unLog && postList.add(post, user.name)) {
                skip = 0;
                view.getPage(postList.getPage(skip, get), true);
                return true;
            }
            return false;
        },
        removePhotoPost: function(id) {
            if (!user.unLog && postList.remove(id)) {
                skip = 0;
                view.getPage(postList.getPage(skip, get, filterConf), false, true);
                return true;
            }
            return false;
        },
        editPhotoPost: function(id, editedPost) {
            if (!user.unLog && postList.edit(id, editedPost)) {
                skip = 0;
                view.getPage(postList.getPage(skip, get));
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
            const result = postList.getPage(skip, postList.getPostListLength(), filterConf);
            view.getPage(result.slice(skip, skip + get), false, false, result.length);
        },
        likePostById: function(id) {
            if (!user.unLog && postList.like(id, user.name)) {
                view.updatePostLikes(postList.get(id));
                return true;
            }
            return false;
        },
        dislikePostById: function(id) {
            if (!user.unLog && !postList.like(id, user.name)) {
                view.updatePostLikes(postList.get(id), false);
                return true;
            }
            return false;
        },
        logout: function() {
            user.name = '';
            user.unLog = true;
            view.updateUserInfo(user);
            view.getPage(postList.getPage(skip, get));
        },
        login: function(username) {
            user.name = username;
            user.unLog = false;
            view.updateUserInfo(user);
            view.getPage(postList.getPage());
        },
    };
}());
