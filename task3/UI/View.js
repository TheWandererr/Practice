class View {
    static _USERNAME_ID = 'username';
    static _POST_TAGS_ID = 'post-tags';
    static _POST_DESCRIPTION_ID = 'post-description';
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
    constructor(user, initialPosts, total) {
        this._user = user;
        this._displayedNumber = 0;
        this._totalNumber = total;
        this.getPage(initialPosts);
    }
    showMore(postsToAdd) {
        const self = this;
        document.getElementsByClassName(View._PHOTOS_CLASS)[0]
            .appendChild(self._createPostsFragment(postsToAdd));
        if (self._displayedNumber === self._totalNumber) {
            View._disableElementVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        }
    }
    getPage(posts, add = false, del = false, totalNumber = this._totalNumber) {
        const self = this;
        const docElement = document.getElementsByClassName(View._PHOTOS_CLASS)[0];
        View._clearInnerHtml(docElement);
        this._displayedNumber = 0;
        docElement.appendChild(self._createPostsFragment(posts));
        this._onGetPageChange(add, del, totalNumber);
    }
    updatePostLikes(post, isLike = true) {
        const self = this;
        const requiredPost = document.getElementById(post.id);
        const likesField = requiredPost.getElementsByClassName(View._LIKES_COUNT_CLASS)[0];
        likesField.innerHTML = `${post.likes.length} likes`;
        const btnLike = isLike ? requiredPost.getElementsByClassName(View._LIKE_BUTTON_CLASS)[0]:
            requiredPost.getElementsByClassName(View._LIKED_BUTTON_CLASS)[0];
        btnLike.outerHTML = self._createLikeButton(post);
    }
    updateUserInfo(user) {
        this._user.name = user.name;
        this._user.unLog = user.unLog;
    }
    static changeDropZoneAppearance(dropZone, image = null) {
        dropZone.className = PageController._DROP_ZONE_CLASS;
        const innerText = dropZone.children[0];
        if (image) {
            View._clearInnerText(innerText);
            dropZone.style.background = `url("${image}") no-repeat`;
        } else {
            innerText.innerText = 'Drop file here';
            dropZone.style.background = '';
        }
    }
    static arePostsHidden() {
        return document.getElementsByClassName(View._HIDDEN_POSTS_CLASS)[0];
    }
    static isAddFormHidden() {
        return document.getElementsByClassName(View._HIDDEN_ADD_CHANGE_FORM_CLASS)[0];
    }
    static postsAuthSwap() {
        const hidePosts = !View.arePostsHidden();
        View._makeGlobalChanges(hidePosts);
        View._makeChangesToTape(hidePosts);
    }
    static addFormAuthSwap() {
        const hideAdd = !View.isAddFormHidden();
        View._makeGlobalChanges(hideAdd);
        View._makeChangesToAddForm(hideAdd);
    }
    static postsAddFormSwap(event, hidePosts = true) {
        if (!View.arePostsHidden()) {
            View._makeChangesToTape(hidePosts);
            View._makeChangesToAddForm(!hidePosts);
            View._changeAddFormContent(event, hidePosts);
        } else {
            View._makeChangesToTape(!hidePosts);
            View._makeChangesToAddForm(hidePosts);
            View._changeAddFormContent(event, !hidePosts);
        }
    }
    static deleteContentFromAddForm() {
        const dropArea = document.getElementById(PageController._DROP_ZONE_ID);
        View.changeDropZoneAppearance(dropArea);
        View._deleteDescriptionContent();
        View._deleteHashTagsContent();
    }
    static _makeChangesToAddForm(hideAdd) {
        View._changeAddFormDisplay(hideAdd);
        View._changeAddButtonText(!hideAdd);
    }
    static _makeChangesToTape(hidePosts) {
        View._changeFilterDisplay(hidePosts);
        View._changePostsDisplay(hidePosts);
    }
    static _makeGlobalChanges(hidePosts) {
        View._changeAuthDisplay(hidePosts);
        View._changeBottomLineDisplay(hidePosts);
        View._changeShowDisplay(hidePosts);
        View._changeMainBackground(hidePosts);
        View._updHeaderOnSwap(hidePosts);
    }
    static _loadContentToAddForm(post) {
        const dropArea = document.getElementById(PageController._DROP_ZONE_ID);
        View.changeDropZoneAppearance(dropArea, post.photoLink);
        View._loadDescriptionContent(post.description);
        View._loadHashTagsContent(post.hashTags);
    }
    static _loadHashTagsContent(what) {
        const where = document.getElementById(View._POST_TAGS_ID);
        where.value = View._fixHashTags(what);
    }
    static _loadDescriptionContent(what) {
        const where = document.getElementById(View._POST_DESCRIPTION_ID);
        where.value = what;
    }
    static _deleteHashTagsContent() {
        const where = document.getElementById(View._POST_TAGS_ID);
        where.value = '';
    }
    static _deleteDescriptionContent() {
        const where = document.getElementById(View._POST_DESCRIPTION_ID);
        where.value = '';
    }
    static _formatDate(strDate) {
        const date = PostList.strToDate(strDate);
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
    static _changeAddFormContent(event, hide) {
        if (hide) {
            const authorArea = document.getElementsByClassName(View._POST_AUTHOR_CLASS)[0];
            authorArea.innerHTML = document.getElementById(View._USERNAME_ID).textContent;
            const dateArea = document.getElementsByClassName(View._POST_DATE_CLASS)[0];
            const post = Global.getPostById(event.target.parentElement.getAttribute('id'));
            dateArea.innerHTML = post ? dateArea.innerHTML =
                View._formatDate(post.creationDate) : View._formatDate(new Date().toString());
            if (event.target.className !== View._ADD_BUTTON_CLASS) {
                View._loadContentToAddForm(post);
                View._changeAddFormId(post.id);
            }
        } else {
            View.deleteContentFromAddForm();
        }
    }
    static _changeAddButtonText(hide) {
        const addButton = document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0];
        if (hide) {
            addButton.innerText = 'BACK';
        } else {
            addButton.innerText = 'ADD PHOTO';
        }
    }
    static _changeFooterMargin(hide) {
        const footer = document.querySelector(`.${View._FOOTER_CLASS}`);
        footer.style.marginTop = hide ? '0' : '3%';
    }
    static _changeMainBackground(hide) {
        const mainBg = document.querySelector(hide ? `.${View._MAIN_CLASS}` : `.${View._MAIN_LOGIN_CLASS}`);
        mainBg.className = hide ? View._MAIN_LOGIN_CLASS : View._MAIN_CLASS;
        View._changeFooterMargin(hide);
    }
    static _changeShowDisplay(hide) {
        const show = document.querySelector(hide ? `.${View._SHOW_CLASS}` : `.${View._HIDDEN_SHOW_CLASS}`);
        show.className = hide ? View._HIDDEN_SHOW_CLASS : View._SHOW_CLASS;
    }
    static _changeBottomLineDisplay(hide) {
        const line = document.querySelector(hide ? `.${View._BOTTOM_LINE_CLASS}` : `.${View._HIDDEN_BOTTOM_LINE_CLASS}`);
        line.className = hide ? View._HIDDEN_BOTTOM_LINE_CLASS : View._BOTTOM_LINE_CLASS;
    }
    static _changeAuthDisplay(hide) {
        const loginForm = document
            .querySelector(`.${PageController._LOGIN_FORM_ELEMENT_CLASS}`);
        if (hide) {
            View._enableElementVisibility(loginForm);
        } else {
            View._disableElementVisibility(loginForm);
        }
    }
    static _changePostsDisplay(hidePosts) {
        const posts = document.querySelector(hidePosts ? `.${PageController._MAIN_TAPE_CLASS}` : `.${View._HIDDEN_POSTS_CLASS}`);
        posts.className = hidePosts ? View._HIDDEN_POSTS_CLASS : PageController._MAIN_TAPE_CLASS;
    }
    static _changeAddFormId(id) {
        const form = document
            .querySelector(`.${View._ADD_CHANGE_FIELDS}`);
        form.setAttribute('id', id);
    }
    static _changeAddFormDisplay(hiddenPosts) {
        const form = document
            .querySelector(!hiddenPosts ? `.${View._HIDDEN_ADD_CHANGE_FORM_CLASS}` : `.${View._ADD_CHANGE_POST}`);
        form.className = !hiddenPosts ? View._ADD_CHANGE_POST : View._HIDDEN_ADD_CHANGE_FORM_CLASS;
    }
    static _changeFilterDisplay(hidePosts) {
        const filterShell = document
            .querySelector(hidePosts ? `.${PageController._FILTER_SHELL_CLASS}` : `.${View._HIDDEN_FILTER_CLASS}`);
        filterShell.className = hidePosts ? View._HIDDEN_FILTER_CLASS : PageController._FILTER_SHELL_CLASS;
    }
    static _clearInnerText(htmlElement) {
        htmlElement.innerText = '';
    }
    static _clearInnerHtml(htmlElement) {
        htmlElement.innerHTML = '';
    }
    static _enableElementVisibility(el) {
        el.style.display = 'inline';
    }
    static _disableElementVisibility(el) {
        el.style.display = 'none';
    }
    static _updHeaderOnSwap(hide) {
        const login = document.getElementById(PageController._LOG_IN_ID);
        const toTape = document.getElementsByClassName(View._TO_POSTS_CLASS)[0];
        if (hide) {
            View._disableElementVisibility(login);
            View._enableElementVisibility(toTape);
        } else {
            View._disableElementVisibility(toTape);
            View._enableElementVisibility(login);
        }
    }
    static _updHeaderOnLog(user) {
        const username = document.getElementById(`${View._USERNAME_ID}`);
        const logIn = document.getElementById(`${PageController._LOG_IN_ID}`);
        const logOut = document.getElementById(`${PageController._LOG_OUT_ID}`);
        if (!user.unLog) {
            username.innerHTML = user.name;
            View._disableElementVisibility(logIn);
            View._enableElementVisibility(logOut);
        } else {
            View._clearInnerHtml(username);
            View._disableElementVisibility(logOut);
            View._enableElementVisibility(logIn);
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
    _createPostElement(post) {
        return `
                    <h3>${post.author}</h3>
                    <h3 class="date">${View._formatDate(post.creationDate)}</h3>
                    <div class="image"><img src=${post.photoLink} alt="/"></div>
                    ${this._createChangeButton(post)}                  
                    ${this._createDeleteButton(post)}
                    ${this._createLikeButton(post)}
                    <a class="count-like">${post.likes.length} likes</a>
                    <p>${post.description}<br>${View._fixHashTags(post.hashTags)}</p>
                `;
    }
    _createLikeButton(post) {
        return `<button class="${!this._user.unLog ? post.likes.includes(this._user.name) ?
            View._LIKED_BUTTON_CLASS : View._LIKE_BUTTON_CLASS : View._HIDDEN_ELEMENT_CLASS}"
                type="submit"><i class="fa fa-heart" aria-hidden="true"></i>♥ Like</button>`;
    }
    _createDeleteButton(post) {
        return `<button class="${post.author === this._user.name ? View._DELETE_BUTTON_CLASS : View._HIDDEN_ELEMENT_CLASS}"
                    type="submit">Delete</button>`;
    }
    _createChangeButton(post) {
        return `<button class="${post.author === this._user.name ? View._CHANGE_BUTTON_CLASS : View._HIDDEN_ELEMENT_CLASS}"
                     type="submit">Change</button>`;
    }
    _createPostsFragment(posts) {
        const self = this;
        const fragment = document.createDocumentFragment();
        posts.forEach(function(post) {
            const postEl = document.createElement('li');
            postEl.setAttribute('id', post.id);
            postEl.innerHTML = self._createPostElement(post);
            fragment.appendChild(postEl);
            self._displayedNumber += 1;
        });
        return fragment;
    }
    _onLoginUpdate() {
        View._updHeaderOnLog(this._user);
        View._enableElementVisibility(document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0]);
    }
    _onLogoutUpdate() {
        View._updHeaderOnLog(this._user);
        View._disableElementVisibility(document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0]);
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
            View._enableElementVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        } else {
            View._disableElementVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        }
    }
}

