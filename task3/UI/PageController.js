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
    static _FILTER_AUTHOR_FIELD = 'author';
    static _FILTER_DATE_FROM_FIELD = 'dateFrom';
    static _FILTER_DATE_TO_FIELD = 'dateTo';
    static _FILTER_HASHTAGS_FIELD = 'hashTags';
    static _TRIM_SIZE_START = 2;
    static _TRIM_SIZE_END = -1;
    static _TYPING_TIMER = 0;
    static _DONE_TYPING_INTERVAL = 1000;
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
                fields.curBg.style.background.indexOf('(') + PageController._TRIM_SIZE_START,
                fields.curBg.style.background.lastIndexOf(')') + PageController._TRIM_SIZE_END),
            description: fields.curDescription.value,
            hashTags: PageController._deleteRedundantFromTags(fields.curTags.value.trim()
                .replace(/\s*[#+-,;. ]+\s*/g, '#')
                .split('#')),
        };
    }
    static _createFilterConfig(formElements) {
        return {
            author: formElements.namedItem(PageController._FILTER_AUTHOR_FIELD).value,
            dateFrom: formElements.namedItem(PageController._FILTER_DATE_FROM_FIELD).value,
            dateTo: formElements.namedItem(PageController._FILTER_DATE_TO_FIELD).value,
            hashTags: formElements.namedItem(PageController._FILTER_HASHTAGS_FIELD).value.trim().split(/[.,;# ]/),
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
    static _fixFilterConfig(params) {
        params.hashTags = PageController._deleteRedundantFromTags(params.hashTags);
        const fixedFilter = {};
        Object.keys(params).filter((item) => params[item].toString().length).forEach((field) => {
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
        filter.addEventListener('keydown', function() {
            clearTimeout(PageController._TYPING_TIMER);
        });
        filter.addEventListener('keyup', function() {
            clearTimeout(PageController._TYPING_TIMER);
            PageController._TYPING_TIMER = setTimeout(function() {
                const params = PageController._createFilterConfig(filter.elements);
                Global.filterPosts(PageController._fixFilterConfig(params));
            }, PageController._DONE_TYPING_INTERVAL);
        });
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
