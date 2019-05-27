class Display {
    static _USERNAME_ID = 'username';
    static _POST_TAGS_ID = 'post-tags';
    static _POST_DESCRIPTION_ID = 'post-description';
    static _FILE_INPUT_ID = 'fileElem';
    static _HIDDEN_ELEMENT_CLASS = 'hidden-element';
    static _HIDDEN_POSTS_CLASS = 'hidden-posts';
    static _HIDDEN_FILTER_CLASS = 'hidden-filter';
    static _HIDDEN_ADD_CHANGE_FORM_CLASS = 'hidden-add';
    static _HIDDEN_BOTTOM_LINE_CLASS = 'hidden-bottom-line';
    static _HIDDEN_SHOW_CLASS = 'hidden-show';
    static _ADD_BUTTON_CLASS = 'add-button';
    static _PHOTOS_CLASS = 'photos';
    static _MORE_BUTTON_CLASS = 'more-button';
    static _LIKE_BUTTON_CLASS = 'btn-like';
    static _LIKED_BUTTON_CLASS = 'btn-liked';
    static _CHANGE_BUTTON_CLASS = 'change-button';
    static _DELETE_BUTTON_CLASS = 'delete-button';
    static _LIKES_COUNT_CLASS = 'count-like';
    static _TO_POSTS_CLASS = 'to-tape';
    static _ADD_CHANGE_POST = 'add-change-post';
    static _ADD_CHANGE_FIELDS = 'fields';
    static _BOTTOM_LINE_CLASS = 'bottom-line';
    static _SHOW_CLASS = 'show';
    static _MAIN_CLASS = 'main';
    static _MAIN_LOGIN_CLASS = 'main-login';
    static _FOOTER_CLASS = 'footer';
    static _POST_AUTHOR_CLASS = 'post-author';
    static _POST_DATE_CLASS = 'post-date';
    static _IMAGE_ZONE_ID = 'gallery';
    constructor(user, initialPosts, total) {
        this._user = user;
        this._displayedNumber = 0;
        this._totalNumber = total;
        this.getPage(initialPosts);
    }
    updatePostLikes(post, isLike = true) {
        const self = this;
        const requiredPost = document.getElementById(post.id);
        const likesField = requiredPost.getElementsByClassName(Display._LIKES_COUNT_CLASS)[0];
        likesField.innerHTML = `${post.likes.length} likes`;
        const btnLike = isLike ? requiredPost.getElementsByClassName(Display._LIKE_BUTTON_CLASS)[0]:
            requiredPost.getElementsByClassName(Display._LIKED_BUTTON_CLASS)[0];
        btnLike.outerHTML = self._createLikeButton(post);
    }
    updateUserInfo(user) {
        this._user.name = user.name;
        this._user.unLog = user.unLog;
    }
    async showMore(postsToAdd) {
        const self = this;
        document.getElementsByClassName(Display._PHOTOS_CLASS)[0]
            .appendChild(await self._createPostsFragment(postsToAdd));
        if (self._displayedNumber === self._totalNumber) {
            Display._disableElementVisibility(document.getElementsByClassName(
                Display._MORE_BUTTON_CLASS)[0]);
        }
    }
    async getPage(posts, add = false, del = false, totalNumber = this._totalNumber) {
        const self = this;
        if (posts) {
            const docElement = document.getElementsByClassName(Display._PHOTOS_CLASS)[0];
            self._displayedNumber = 0;
            const toAppend = await self._createPostsFragment(posts);
            Display.clearInnerHtml(docElement);
            docElement.appendChild(toAppend);
        }
        self._onGetPageChange(add, del, totalNumber);
    }
    static previewFile(file, dropZone=document.getElementById(Display._IMAGE_ZONE_ID)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            const img = document.createElement('img');
            img.setAttribute(Controller.ID, file.name);
            img.src = reader.result;
            Display.clearInnerHtml(dropZone);
            dropZone.appendChild(img);
        };
    }
    static formatDate(strDate) {
        const date = new Date(strDate);
        const year = date.getFullYear();
        const values = [
            (date.getMonth() + 1).toString(),
            date.getDate().toString(),
            date.getHours().toString(),
            date.getMinutes().toString(),
        ];
        const fixedValues = [];
        values.forEach(function(item) {
            if (item.length < 2) {
                fixedValues.push(`0${item}`);
            } else {
                fixedValues.push(item);
            }
        });
        return `${year}.${fixedValues[0]}.${fixedValues[1]} ${fixedValues[2]}:${fixedValues[3]}`;
    }
    static clearInnerHtml(htmlElement) {
        htmlElement.innerHTML = '';
    }
    static arePostsHidden() {
        return document.getElementsByClassName(Display._HIDDEN_POSTS_CLASS)[0];
    }
    static isAddFormHidden() {
        return document.getElementsByClassName(Display._HIDDEN_ADD_CHANGE_FORM_CLASS)[0];
    }
    static postsAuthSwap() {
        const hidePosts = !Display.arePostsHidden();
        Display._makeGlobalChanges(hidePosts);
        Display._makeChangesToTape(hidePosts);
    }
    static addFormAuthSwap() {
        const hideAdd = !Display.isAddFormHidden();
        Display._makeGlobalChanges(hideAdd);
        Display._makeChangesToAddForm(hideAdd);
    }
    static postsAddFormSwap(event, hidePosts = true) {
        if (!Display.arePostsHidden()) {
            Display._makeChangesToTape(hidePosts);
            Display._makeChangesToAddForm(!hidePosts);
            Display._changeAddFormContent(event, hidePosts);
        } else {
            Display._makeChangesToTape(!hidePosts);
            Display._makeChangesToAddForm(hidePosts);
            Display._changeAddFormContent(event, !hidePosts);
        }
    }
    static deleteContentFromAddForm() {
        Display._deleteFile();
        Display._deleteImage();
        Display._deleteDescriptionContent();
        Display._deleteHashTagsContent();
        Display._deletePostIdFromAdd();
    }
    static deleteInputValues(fragment) {
        Array.from(fragment.querySelectorAll('input')).forEach((item) => {
            item.value = '';
        });
    }
    static _makeChangesToAddForm(hideAdd) {
        Display._changeAddFormDisplay(hideAdd);
        Display._changeAddButtonText(!hideAdd);
    }
    static _makeChangesToTape(hidePosts) {
        Display._changeFilterDisplay(hidePosts);
        Display._changePostsDisplay(hidePosts);
    }
    static _makeGlobalChanges(hidePosts) {
        Display._changeAuthDisplay(hidePosts);
        Display._changeBottomLineDisplay(hidePosts);
        Display._changeShowDisplay(hidePosts);
        Display._changeMainBackground(hidePosts);
        Display._updHeaderOnSwap(hidePosts);
    }
    static async _loadContentToAddForm(post) {
        Display._loadDescriptionContent(post.description);
        Display._loadHashTagsContent(post.hashTags);
        try {
            const resp = await PostTools.downloadImage(post.photoLink);
            const blobResp = await resp.blob();
            const where = document.getElementById(Display._IMAGE_ZONE_ID);
            const img = document.createElement('img');
            img.src = Controller._createImgSrc(blobResp);
            where.appendChild(img);
            Display._loadDescriptionContent(post.description);
            Display._loadHashTagsContent(post.hashTags);
        } catch (e) {
            console.log(e.message);
        }
    }
    static _loadHashTagsContent(what) {
        const where = document.getElementById(Display._POST_TAGS_ID);
        where.value = Display._fixHashTags(what);
    }
    static _loadDescriptionContent(what) {
        const where = document.getElementById(Display._POST_DESCRIPTION_ID);
        where.value = what;
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
    static _deletePostIdFromAdd() {
        const postId = document.querySelector(`.${Controller._FORM_FIELDS_CLASS}`);
        if (postId) {
            postId.removeAttribute(Controller.ID);
        }
    }
    static _deleteHashTagsContent() {
        const where = document.getElementById(Display._POST_TAGS_ID);
        where.value = '';
    }
    static _deleteFile() {
        Controller.UPLOADED_IMAGE = null;
    }
    static _deleteImage() {
        const dropArea = document.getElementById(Display._IMAGE_ZONE_ID);
        Display.clearInnerHtml(dropArea);
        const fileInput = document.getElementById(Display._FILE_INPUT_ID);
        fileInput.value = null;
    }
    static _deleteDescriptionContent() {
        const where = document.getElementById(Display._POST_DESCRIPTION_ID);
        where.value = '';
    }
    static async _changeAddFormContent(event, hide) {
        if (hide) {
            const authorArea = document.getElementsByClassName(Display._POST_AUTHOR_CLASS)[0];
            authorArea.innerHTML = document.getElementById(Display._USERNAME_ID).textContent;
            const dateArea = document.getElementsByClassName(Display._POST_DATE_CLASS)[0];
            const id = event.target.parentElement.getAttribute(Controller.ID);
            if (id) {
                const post = await PostTools.getPost(id);
                dateArea.innerHTML = Display.formatDate(post.createdAt);
                if (event.target.className !== Display._ADD_BUTTON_CLASS) {
                    Display._loadContentToAddForm(post);
                    Display._changeAddFormId(post.id);
                }
            } else {
                dateArea.innerHTML = Display.formatDate(new Date().toString());
            }
        } else {
            Display.deleteContentFromAddForm();
        }
    }
    static _changeAddButtonText(hide) {
        const addButton = document.getElementsByClassName(Display._ADD_BUTTON_CLASS)[0];
        if (hide) {
            addButton.innerText = 'BACK';
        } else {
            addButton.innerText = 'ADD PHOTO';
        }
    }
    static _changeFooterMargin(hide) {
        const footer = document.querySelector(`.${Display._FOOTER_CLASS}`);
        footer.style.marginTop = hide ? '0' : '3%';
    }
    static _changeMainBackground(hide) {
        const mainBg = document.querySelector(hide ? `.${Display._MAIN_CLASS}` : `.${Display._MAIN_LOGIN_CLASS}`);
        mainBg.className = hide ? Display._MAIN_LOGIN_CLASS : Display._MAIN_CLASS;
        Display._changeFooterMargin(hide);
    }
    static _changeShowDisplay(hide) {
        const show = document.querySelector(hide ? `.${Display._SHOW_CLASS}` : `.${Display._HIDDEN_SHOW_CLASS}`);
        show.className = hide ? Display._HIDDEN_SHOW_CLASS : Display._SHOW_CLASS;
    }
    static _changeBottomLineDisplay(hide) {
        const line = document.querySelector(hide ? `.${Display._BOTTOM_LINE_CLASS}` : `.${Display._HIDDEN_BOTTOM_LINE_CLASS}`);
        line.className = hide ? Display._HIDDEN_BOTTOM_LINE_CLASS : Display._BOTTOM_LINE_CLASS;
    }
    static _changeAuthDisplay(hide) {
        const loginForm = document
            .querySelector(`.${Controller._LOGIN_FORM_ELEMENT_CLASS}`);
        if (hide) {
            Display._enableElementVisibility(loginForm);
        } else {
            Display._disableElementVisibility(loginForm);
        }
    }
    static _changePostsDisplay(hidePosts) {
        const posts = document.querySelector(
            hidePosts ? `.${Controller._MAIN_TAPE_CLASS}` : `.${Display._HIDDEN_POSTS_CLASS}`);
        posts.className = hidePosts ? Display._HIDDEN_POSTS_CLASS : Controller._MAIN_TAPE_CLASS;
    }
    static _changeAddFormId(id) {
        const form = document
            .querySelector(`.${Display._ADD_CHANGE_FIELDS}`);
        form.setAttribute(Controller.ID, id);
    }
    static _changeAddFormDisplay(hiddenPosts) {
        const form = document
            .querySelector(!hiddenPosts ? `.${Display._HIDDEN_ADD_CHANGE_FORM_CLASS}` : `.${Display._ADD_CHANGE_POST}`);
        form.className = !hiddenPosts ? Display._ADD_CHANGE_POST : Display._HIDDEN_ADD_CHANGE_FORM_CLASS;
    }
    static _changeFilterDisplay(hidePosts) {
        const filterShell = document
            .querySelector(hidePosts ? `.${Controller._FILTER_SHELL_CLASS}` : `.${Display._HIDDEN_FILTER_CLASS}`);
        filterShell.className = hidePosts ? Display._HIDDEN_FILTER_CLASS : Controller._FILTER_SHELL_CLASS;
    }
    static _enableElementVisibility(el) {
        el.style.display = 'inline';
    }
    static _disableElementVisibility(el) {
        el.style.display = 'none';
    }
    static _updHeaderOnSwap(hide) {
        const login = document.getElementById(Controller._LOG_IN_ID);
        const toTape = document.getElementsByClassName(Display._TO_POSTS_CLASS)[0];
        if (hide) {
            Display._disableElementVisibility(login);
            Display._enableElementVisibility(toTape);
        } else {
            Display._disableElementVisibility(toTape);
            Display._enableElementVisibility(login);
        }
    }
    static _updHeaderOnLog(user) {
        const username = document.getElementById(`${Display._USERNAME_ID}`);
        const logIn = document.getElementById(`${Controller._LOG_IN_ID}`);
        const logOut = document.getElementById(`${Controller._LOG_OUT_ID}`);
        if (!user.unLog) {
            username.innerHTML = user.name;
            Display._disableElementVisibility(logIn);
            Display._enableElementVisibility(logOut);
        } else {
            Display.clearInnerHtml(username);
            Display._disableElementVisibility(logOut);
            Display._enableElementVisibility(logIn);
        }
    }
    static _fixHashTags(tags) {
        const out = [];
        tags.forEach(function(item) {
            if (item) {
                const tag = `#${item}`;
                out.push(tag);
            }
        });
        return out.toString().replace(/,/g, '');
    }
    async _createPostElement(post) {
        const resp = await PostTools.downloadImage(post.photoLink);
        const blobResp = await resp.blob();
        const src = Controller._createImgSrc(blobResp);
        return `<h3>${post.author}</h3>
                <h3 class="date">${Display.formatDate(post.createdAt)}</h3>
                <div class="image"><img src=${src} alt="/"></div>
                ${this._createChangeButton(post)}                  
                ${this._createDeleteButton(post)}
                ${this._createLikeButton(post)}
                <a class="count-like">${post.likes.length} likes</a>
                <p>${post.description}<br>${Display._fixHashTags(post.hashTags)}</p>`;
    }
    async _createPostsFragment(posts) {
        const self = this;
        const fragment = document.createDocumentFragment();
        for (const post of posts) {
            const postEl = document.createElement('li');
            postEl.setAttribute(Controller.ID, post.id);
            postEl.innerHTML = await self._createPostElement(post);
            fragment.appendChild(postEl);
            self._displayedNumber += 1;
        }
        return fragment;
    }
    _createLikeButton(post) {
        return `<button class="${!this._user.unLog ? post.likes.includes(this._user.name) ?
            Display._LIKED_BUTTON_CLASS : Display._LIKE_BUTTON_CLASS : Display._HIDDEN_ELEMENT_CLASS}"
                type="submit"><i class="fa fa-heart" aria-hidden="true"></i>♥ Like</button>`;
    }
    _createDeleteButton(post) {
        return `<button class="${post.author === this._user.name ? Display._DELETE_BUTTON_CLASS : Display._HIDDEN_ELEMENT_CLASS}"
                    type="submit">Delete</button>`;
    }
    _createChangeButton(post) {
        return `<button class="${post.author === this._user.name ? Display._CHANGE_BUTTON_CLASS : Display._HIDDEN_ELEMENT_CLASS}"
                     type="submit">Change</button>`;
    }
    _onLoginUpdate() {
        Display._updHeaderOnLog(this._user);
        Display._enableElementVisibility(document.getElementsByClassName(Display._ADD_BUTTON_CLASS)[0]);
    }
    _onLogoutUpdate() {
        Display._updHeaderOnLog(this._user);
        Display._disableElementVisibility(document.getElementsByClassName(Display._ADD_BUTTON_CLASS)[0]);
    }
    _onGetPageChange(add = false, del = false, totalNumber) {
        if (!add && !del) {
            if (!this._user.unLog) {
                this._onLoginUpdate();
            } else {
                this._onLogoutUpdate();
            }
        }
        this._totalNumber = totalNumber;
        if (add) {
            this._totalNumber += 1;
        }
        if (del) {
            this._totalNumber -= 1;
        }
        if (this._totalNumber > this._displayedNumber) {
            Display._enableElementVisibility(document.getElementsByClassName(
                Display._MORE_BUTTON_CLASS)[0]);
        } else {
            Display._disableElementVisibility(document.getElementsByClassName(
                Display._MORE_BUTTON_CLASS)[0]);
        }
    }
}

