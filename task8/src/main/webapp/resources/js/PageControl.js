class Controller {
    static ID = 'id';
    static _TAPE_CLASS = 'main-col';
    static _FILTER_CLASS = 'filter';
    static _FILTER_DATE_INPUT_CLASS = 'filter-date-input';
    static _CLEAR_BUTTON_CLASS = 'clear-button';
    static _LOG_OUT_ID = 'exit';
    static _LOG_IN_ID = 'enter';
    static _FILTER_SHELL_CLASS = 'dark';
    static _MAIN_TAPE_CLASS = 'main-col';
    static _LOGIN_FORM_ELEMENT_CLASS = 'log-form';
    static _FORM_AUTH_CLASS = 'form-inner';
    static _FORM_AUTH_NAME = 'logForm';
    static _FORM_AUTH_USERNAME = 'authUser';
    static _FORM_AUTH_PASS = 'authPass';
    static _ERROR_PARAGRAPH_CLASS = 'error-auth';
    static _ADD_BUTTON_CLASS = 'add-button';
    static _ADD_SUBMIT_FORM_CLASS = 'add-change-form';
    static _DROP_ZONE_ID = 'drop-area';
    static _FORM_FIELDS_CLASS = 'fields';
    static _FILTER_AUTHOR_FIELD = 'author';
    static _FILTER_DATE_FROM_FIELD = 'dateFrom';
    static _FILTER_DATE_TO_FIELD = 'dateTo';
    static _FILTER_HASHTAGS_FIELD = 'hashTags';
    static _TYPING_TIMER = 0;
    static _DONE_TYPING_INTERVAL = 1300;
    constructor(user) {
        this._user = user;
        Controller._FILE = null;
        Controller._createPostButtonsHandler();
        Controller._createFilterHandle();
        Controller._createLogOutHandler();
        Controller._createLogInHandler();
        Controller._createEnterEventHandler();
        Controller._createBtnToTapeCLick();
        Controller._createBtnAddClick();
        Controller._createDragDropHandler();
        Controller._createAddSubmitHandler();
    }
    static processUploadedFile(file) {
        Controller._setFile(file);
        Display.previewFile(file);
    }
    static _setFile(file) {
        Controller._FILE = file;
    }
    static _fixFilterConfig(params) {
        params.hashTags = Display._deleteRedundantFromTags(params.hashTags);
        const fixedFilter = {};
        Object.keys(params).filter((item) => params[item].toString().length).forEach((field) => {
            fixedFilter[field] = params[field];
        });
        return fixedFilter;
    }
    static _createRequestForm(fields) {
        const formData = new FormData();
        let file = fields.namedItem(PostTools.LINK).files[0];
        if (!file) {
            file = Controller._FILE;
        }
        formData.append(PostTools.LINK, file);
        formData.append(PostTools.DESCRIPTION, fields.namedItem(PostTools.DESCRIPTION).value);
        formData.append(PostTools.TAGS, fields.namedItem(
            PostTools.TAGS).value);
        return formData;
    }
    static _createFilterConfig(formElements) {
        return {
            author: formElements.namedItem(Controller._FILTER_AUTHOR_FIELD).value,
            dateFrom: formElements.namedItem(Controller._FILTER_DATE_FROM_FIELD).value,
            dateTo: formElements.namedItem(Controller._FILTER_DATE_TO_FIELD).value,
            hashTags: formElements.namedItem(Controller._FILTER_HASHTAGS_FIELD).value.trim().split(/[.,;# ]/),
        };
    }
    static _createImgSrc(blobResp) {
        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(blobResp);
    }
    static _createAddSubmitHandler() {
        const addSubmit = document.querySelector(`.${Controller._ADD_SUBMIT_FORM_CLASS}`);
        addSubmit.addEventListener('submit', Controller._handleFormAdd);
    }
    static _createBtnToTapeCLick() {
        const toTape = document.querySelector(`.${Display._TO_POSTS_CLASS}`);
        toTape.addEventListener('click', Controller._handleToTape);
    }
    static _createPostButtonsHandler() {
        const postList = document.querySelector(`.${Controller._TAPE_CLASS}`);
        postList.addEventListener('click', Controller._handleBtnPostClick);
    }
    static _createFilterHandle() {
        const filter = document.querySelector(`.${Controller._FILTER_CLASS}`);
        const filterDateInput = document.querySelector(`.${Controller._FILTER_DATE_INPUT_CLASS}`);
        filter.addEventListener('keydown', function() {
            clearTimeout(Controller._TYPING_TIMER);
        });
        filter.addEventListener('keyup', function() {
            clearTimeout(Controller._TYPING_TIMER);
            Controller._TYPING_TIMER = setTimeout(function() {
                const params = Controller._createFilterConfig(filter.elements);
                Global.filterPosts(Controller._fixFilterConfig(params));
            }, Controller._DONE_TYPING_INTERVAL);
        });
        filter.addEventListener('click', Controller._handleFilterClearOn);
        filterDateInput.addEventListener('change', function() {
            const params = Controller._createFilterConfig(filter.elements);
            setTimeout(function() {
                Global.filterPosts(Controller._fixFilterConfig(params));
            }, Controller._DONE_TYPING_INTERVAL);
        });
    }
    static _createLogOutHandler() {
        const logout = document.querySelector(`#${Controller._LOG_OUT_ID}`);
        logout.addEventListener('click', Controller._handleOnClickLogout);
    }
    static _createLogInHandler() {
        const login = document.querySelector(`#${Controller._LOG_IN_ID}`);
        login.addEventListener('click', Display.postsAuthSwap);
    }
    static _createBtnAddClick() {
        const addButton = document.querySelector(`.${Controller._ADD_BUTTON_CLASS}`);
        addButton.addEventListener('click', Display.postsAddFormSwap);
    }
    static _createEnterEventHandler() {
        const enter = document.querySelector(`.${Controller._FORM_AUTH_CLASS}`);
        enter.addEventListener('submit', Controller._handleAuthorization);
    }
    static _createDragDropHandler() {
        const dropArea = document.getElementById(Controller._DROP_ZONE_ID);
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
            dropArea.addEventListener(eventName, function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        ['dragenter', 'dragover'].forEach((eventName) => {
            dropArea.addEventListener(eventName, function() {
                dropArea.classList.add('highlight');
            });
        });
        ['dragleave', 'drop'].forEach((eventName) => {
            dropArea.addEventListener(eventName, function() {
                dropArea.classList.remove('highlight');
            });
        });
        dropArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            Controller.processUploadedFile(file);
        });
            }
    static _handleBtnPostClick(event) {
        if (event.target.tagName !== 'BUTTON') {
            return;
        }
        if (event.target.className === Display._LIKE_BUTTON_CLASS) {
            Global.likePostById(event.target.parentElement.id);
        }
        if (event.target.className === Display._DELETE_BUTTON_CLASS) {
            Global.removePhotoPost(event.target.parentElement.id);
        }
        if (event.target.className === Display._CHANGE_BUTTON_CLASS) {
            Display.postsAddFormSwap(event);
        }
        if (event.target.className === Display._LIKED_BUTTON_CLASS) {
            Global.dislikePostById(event.target.parentElement.id);
        }
        if (event.target.className === Display._MORE_BUTTON_CLASS) {
            Global.showMore();
        }
    }
    static _handleFilterClearOn(event) {
        if (event.target.tagName !== 'BUTTON') {
            return;
        }
        if (event.target.className === Controller._CLEAR_BUTTON_CLASS) {
            Display._deleteInputValues(event.currentTarget);
        }
        Global.filterPosts();
    }
    static async _handleOnClickLogout(event) {
        await Global.logout(event);
        if (!Display.arePostsHidden()) {
            Display.postsAuthSwap(event, true);
        } else {
            Display.addFormAuthSwap();
        }
    }
    static async _handleAuthorization(event) {
        event.preventDefault();
        const form = document.forms[Controller._FORM_AUTH_NAME];
        const inputs = form.elements;
        const error = form.querySelector(`.${Controller._ERROR_PARAGRAPH_CLASS}`);
        const req = {};
        req.username = inputs.namedItem(Controller._FORM_AUTH_USERNAME).value;
        req.pass = inputs.namedItem(Controller._FORM_AUTH_PASS).value;
        const data = JSON.stringify(req);
        try {
            await Global.login(data);
            error.innerText = '*Required fields';
            Global.processUser(req);
            Display._deleteInputValues(form);
            Display.postsAuthSwap(event, false);
            Global.afterLog();
        } catch (e) {
            error.innerText = 'Check entered data and try again';
            console.log(e.message);
        }
    }
    static _handleToTape(event) {
        Display.postsAuthSwap(event, false);
    }
    static _handleFormAdd(event) {
        event.preventDefault();
        const postId = document.querySelector(`.${Controller._FORM_FIELDS_CLASS}`)
            .getAttribute(Controller.ID);
        const fields = document.forms.addChangeForm.elements;
        const formData = Controller._createRequestForm(fields);
        if (!postId) {
            Global.addPhotoPost(formData, event);
        } else {
            formData.append(Controller.ID, postId);
            Global.editPhotoPost(formData, event);
        }
    }
}
