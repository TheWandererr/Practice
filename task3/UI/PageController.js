class PageController {
    static _TAPE_CLASS = 'main-col';
    static _FILTER_CLASS = 'filter';
    static _CLEAR_BUTTON_CLASS = 'clear-button';
    static _LOG_OUT_ID = 'exit';
    static _LOG_IN_ID = 'enter';
    static _FILTER_SHELL_CLASS = 'dark';
    static _MAIN_TAPE_CLASS = 'main-col';
    static _LOGIN_FORM_ELEMENT_CLASS = 'log-form';
    static _FORM_AUTH_CLASS = 'form-inner';
    static _ERROR_PARAGRAPH_CLASS = 'error-auth';
    static _ADD_BUTTON_CLASS = 'add-button';
    static _ADD_SUBMIT_FORM_CLASS = 'add-change-form';
    static _DROP_ZONE_CLASS = 'dropzone';
    static _DROP_ZONE_ID = 'dropzone';
    static _DRAG_OVER_CLASS = 'dropzone-dragover';
    static _FORM_FIELDS_CLASS = 'fields';
    constructor(user) {
        this._user = user;
        PageController._createPostButtonsHandler();
        PageController._createFilterHandle();
        PageController._createLogOutHandler();
        PageController._createLogInHandler();
        PageController._createEnterEventHandler();
        PageController._createBtnToTapeCLick();
        PageController._createBtnAddClick();
        PageController._createDragDropHandler();
        PageController._createAddSubmitHandler();
    }
    static _createRawPost(fields) {
        return {
            photoLink: fields.curBg.style.background.substring(
                fields.curBg.style.background.indexOf('(') + 2,
                fields.curBg.style.background.lastIndexOf(')') - 1),
            description: fields.curDescription.value,
            hashTags: PageController._deleteRedundantFromTags(fields.curTags.value.trim()
                .replace(/\s*[#+-,;. ]+\s*/g, '#')
                .split('#')),
        };
    }
    static _pushUserInfo(user) {
        sessionStorage.setItem('username', user);
    }
    static _onAuthCheck(username, pass) {
        return username.length > 0 && pass.length > 0;
    }
    static _clearInputValues(fragment) {
        Array.from(fragment.querySelectorAll('input')).forEach((item) => {
            item.value = '';
        });
    }
    static _fixFilterParams(params) {
        const fixedFilter = {};
        Object.keys(params).filter((item) => params[item].toString().length > 0).forEach((field) => {
            switch (field) {
                case 'hashTags':
                case 'author': {
                    fixedFilter[field] = params[field];
                    break;
                }
                case 'dateTo':
                case 'dateFrom': {
                    fixedFilter[field] = new Date(params[field]);
                    break;
                }
            }
        });
        return fixedFilter;
    }
    static _deleteRedundantFromTags(tags) {
        const res = [];
        tags.forEach(function(tag) {
            if (tag) {
                res.push(tag);
            }
        });
        return res;
    }
    static _createAddSubmitHandler() {
        const addSubmit = document.querySelector(`.${PageController._ADD_SUBMIT_FORM_CLASS}`);
        addSubmit.addEventListener('submit', PageController._handleFormAdd);
    }
    static _createBtnToTapeCLick() {
        const toTape = document.querySelector(`.${View._TO_POSTS_CLASS}`);
        toTape.addEventListener('click', PageController._handleToTape);
    }
    static _createPostButtonsHandler() {
        const postList = document.querySelector(`.${PageController._TAPE_CLASS}`);
        postList.addEventListener('click', PageController._handleBtnPostClick);
    }
    static _createFilterHandle() {
        const filter = document.querySelector(`.${PageController._FILTER_CLASS}`);
        filter.addEventListener('input', PageController._handleFilterInput);
        filter.addEventListener('click', PageController._handleFilterClearOn);
    }
    static _createLogOutHandler() {
        const logout = document.querySelector(`#${PageController._LOG_OUT_ID}`);
        logout.addEventListener('click', PageController._handleOnClickLogout);
    }
    static _createLogInHandler() {
        const login = document.querySelector(`#${PageController._LOG_IN_ID}`);
        login.addEventListener('click', View.postsAuthSwap);
    }
    static _createBtnAddClick() {
        const addButton = document.querySelector(`.${PageController._ADD_BUTTON_CLASS}`);
        addButton.addEventListener('click', View.postsAddFormSwap);
    }
    static _createEnterEventHandler() {
        const enter = document.querySelector(`.${PageController._FORM_AUTH_CLASS}`);
        enter.addEventListener('submit', PageController._handleAuthorization);
    }
    static _createDragDropHandler() {
        const dropZone = document.getElementById(PageController._DROP_ZONE_ID);
        const upload = function(file) {
            const fileName = file.name;
            View.changeDropZoneAppearance(dropZone, `images/${fileName}`);
        };
        dropZone.ondrop = function(e) {
            e.preventDefault();
            upload(e.dataTransfer.files[0]);
        };
        dropZone.ondragover = function() {
            dropZone.className = PageController._DRAG_OVER_CLASS;
            return false;
        };
        dropZone.ondragleave = function() {
            dropZone.className = PageController._DROP_ZONE_CLASS;
            return false;
        };
    }
    static _handleBtnPostClick(event) {
        if (event.target.tagName !== 'BUTTON') {
            return;
        }
        if (event.target.className === View._LIKE_BUTTON_CLASS) {
            Global.likePostById(event.target.parentElement.id);
        }
        if (event.target.className === View._DELETE_BUTTON_CLASS) {
            Global.removePhotoPost(event.target.parentElement.id);
        }
        if (event.target.className === View._CHANGE_BUTTON_CLASS) {
            View.postsAddFormSwap(event);
        }
        if (event.target.className === View._LIKED_BUTTON_CLASS) {
            Global.dislikePostById(event.target.parentElement.id);
        }
        if (event.target.className === View._MORE_BUTTON_CLASS) {
            Global.showMore();
        }
    }
    static _handleFilterInput(event) {
        let filter = event.currentTarget;
        const inputs = filter.querySelectorAll('input');
        const params = {
            author: inputs[0].value,
            dateFrom: inputs[1].value,
            dateTo: inputs[2].value,
            hashTags: inputs[3].value.trim().split(/[.,;# ]/),
        };
        params.hashTags = PageController._deleteRedundantFromTags(params.hashTags);
        filter = PageController._fixFilterParams(params);
        Global.filterPosts(filter);
    }
    static _handleFilterClearOn(event) {
        if (event.target.tagName !== 'BUTTON') {
            return;
        }
        if (event.target.className === PageController._CLEAR_BUTTON_CLASS) {
            PageController._clearInputValues(event.currentTarget);
        }
        Global.filterPosts();
    }
    static _handleOnClickLogout(event) {
        sessionStorage.removeItem('username');
        Global.logout();
        if (!View.arePostsHidden()) {
            View.postsAuthSwap(event, true);
        } else {
            View.addFormAuthSwap();
        }
    }
    static _handleAuthorization(event) {
        event.preventDefault();
        const form = document.querySelector(`.${PageController._FORM_AUTH_CLASS}`);
        const inputs = form.querySelectorAll('input');
        const username = inputs[0].value;
        const pass = inputs[1].value;
        const error = form.querySelector(`.${PageController._ERROR_PARAGRAPH_CLASS}`);
        if (PageController._onAuthCheck(username, pass)) {
            PageController._clearInputValues(form);
            error.innerText = '*Required fields';
            View.postsAuthSwap(event, false);
            PageController._pushUserInfo(username);
            Global.login(username);
        } else {
            error.innerText = 'Check entered data and try again';
        }
    }
    static _handleToTape(event) {
        View.postsAuthSwap(event, false);
    }
    static _handleFormAdd(event) {
        event.preventDefault();
        const postId = document.querySelector(`.${PageController._FORM_FIELDS_CLASS}`)
            .getAttribute('id');
        const fields = {
            curBg: document.getElementById(PageController._DROP_ZONE_ID),
            curDescription: document.getElementById(View._POST_DESCRIPTION_ID),
            curTags: document.getElementById(View._POST_TAGS_ID),
        };
        const post = PageController._createRawPost(fields);
        const requiredMes = document.getElementsByClassName(PageController._ERROR_PARAGRAPH_CLASS)[1];
        const flag = postId ? Global.editPhotoPost(postId, post) : Global.addPhotoPost(post);
        requiredMes.innerText = flag ? '*Required fields' : 'Check entered data and try again';
        if (flag) {
            View.postsAddFormSwap(event);
            View.deleteContentFromAddForm();
        }
    }
}
