class View {
    static _LOGIN = 'LOGIN';
    static _LOGOUT = 'LOGOUT';
    static _ADD_BUTTON_CLASS = 'add-button';
    static _PHOTOS_CLASS = 'photos';
    static _MORE_BUTTON_CLASS = 'more-button';
    static _LIKE_BUTTON_CLASS = 'btn-like';
    static _CHANGE_BUTTON_CLASS = 'change-button';
    static _DELETE_BUTTON_CLASS = 'delete-button';
    static _LIKES_COUNT_CLASS = 'count-like';
    static _MAIN_GREY_COLOR = '#35424a';
    static _MAIN_WHITE_COLOR = '#ffffff';
    static _MAIN_TOMATO_COLOR = 'tomato';
    constructor(user, initialPosts, total) {
        this._user = user;
        this._displayedNumber = initialPosts.length;
        this._totalNumber = total;
        this.getPage(initialPosts);
    }
    showMore(postsToAdd) {
        const self = this;
        const fragment = document.createDocumentFragment();
        postsToAdd.forEach(function(post) {
            const postEl = document.createElement('li');
            postEl.setAttribute('id', post.id);
            postEl.innerHTML = View._createPostElement(post);
            if (post.author !== self._user.name) {
                View._disableButtonVisibility(postEl.getElementsByClassName(
                    View._CHANGE_BUTTON_CLASS)[0]);
                View._disableButtonVisibility(postEl.getElementsByClassName(
                    View._DELETE_BUTTON_CLASS)[0]);
                if (self._user.unLog) {
                    View._disableButtonVisibility(postEl.getElementsByClassName(
                        View._LIKE_BUTTON_CLASS)[0]);
                }
            }
            fragment.appendChild(postEl);
            self._displayedNumber += 1;
        });
        if (self._displayedNumber === self._totalNumber) {
            View._disableButtonVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        }
        document.getElementsByClassName(View._PHOTOS_CLASS)[0].appendChild(fragment);
    }
    getPage(posts, add = false, del = false) {
        const docElement = document.getElementsByClassName(View._PHOTOS_CLASS)[0];
        View._removeChildes(docElement);
        this._onGetPageChange(add, del, posts.length);
        const fragment = document.createDocumentFragment();
        const self = this;
        posts.forEach(function(post) {
            const postEl = document.createElement('li');
            postEl.setAttribute('id', post.id);
            postEl.innerHTML = View._createPostElement(post);
            if (self._user.unLog) {
                View._disableButtonVisibility(postEl.getElementsByClassName(
                    View._LIKE_BUTTON_CLASS)[0]);
                View._disableButtonVisibility(postEl.getElementsByClassName(
                    View._CHANGE_BUTTON_CLASS)[0]);
                View._disableButtonVisibility(postEl.getElementsByClassName(
                    View._DELETE_BUTTON_CLASS)[0]);
            } else {
                if (self._user.name !== post.author) {
                    View._disableButtonVisibility(postEl.getElementsByClassName(
                        View._CHANGE_BUTTON_CLASS)[0]);
                    View._disableButtonVisibility(postEl.getElementsByClassName(
                        View._DELETE_BUTTON_CLASS)[0]);
                }
            }
            fragment.appendChild(postEl);
        });
        docElement.appendChild(fragment);
    }
    static updatePostLikes(id, likesCount, like = true) {
        const requiredPost = document.getElementById(id);
        const likesField = requiredPost.getElementsByClassName(View._LIKES_COUNT_CLASS)[0];
        likesField.innerHTML = `${likesCount} likes`;
        const btnLike = requiredPost.getElementsByClassName(View._LIKE_BUTTON_CLASS)[0];
        if (like) {
            btnLike.style.border = `${View._MAIN_GREY_COLOR} 2px solid`;
            btnLike.style.color = View._MAIN_GREY_COLOR;
            btnLike.innerHTML = '♥ Liked';
        } else {
            btnLike.style.border = `${View._MAIN_TOMATO_COLOR} 2px solid`;
            btnLike.style.color = View._MAIN_WHITE_COLOR;
            btnLike.innerHTML = '♥ Like';
        }
    }
    static _removeChildes(docElement) {
        while (docElement.firstChild) {
            docElement.removeChild(docElement.firstChild);
        }
    }
    static _createPostElement(post) {
        return `
                    <h3>${post.author}</h3>
                    <h3 class="date">${View._formatDate(post.creationDate)}</h3>
                    <img src=${post.photoLink} alt="/"><br>
                    <button class="change-button" type="submit">Change</button>
                    <button class="delete-button" type="submit">Delete</button>
                    <button class="btn-like" type="submit"><i class="fa fa-heart" aria-hidden="true"></i>♥ Like</button>
                    <a class="count-like">${post.likes.length} likes</a>
                    <p>${post.description}<br>${View._fixHashTags(post.hashTags)}</p>
                `;
    }
    static _enableButtonVisibility(button) {
        button.style.display = 'inline';
    }
    static _disableButtonVisibility(button) {
        button.style.display = 'none';
    }
    static _updateHeader(user) {
        const logInOut = document.getElementById('exit');
        const username = document.getElementById('username');
        if (!user.unLog) {
            username.innerHTML = user.name;
            logInOut.innerHTML = View._LOGOUT;
        } else {
            username.innerHTML = '';
            logInOut.innerHTML = View._LOGIN;
        }
    }
    static _fixHashTags(tags) {
        const out = [];
        tags.forEach(function(item) {
            const tag = `#${item}`;
            out.push(tag);
        });
        return out.toString().replace(/,/g, '');
    }
    static _formatDate(date) {
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
    _onLoginUpdate() {
        View._updateHeader(this._user);
        View._enableButtonVisibility(document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0]);
    }
    _onLogoutUpdate() {
        View._updateHeader(this._user);
        View._disableButtonVisibility(document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0]);
    }
    _onGetPageChange(add = false, del = false, displayed) {
        if (!add && !del) {
            if (!this._user.unLog) {
            this._onLoginUpdate();
        } else {
            this._onLogoutUpdate();
        }
        }
        if (add) this._totalNumber += 1;
        if (del) {
            this._totalNumber -= 1;
        }
        this._displayedNumber = displayed;
        if (this._totalNumber > this._displayedNumber) {
            View._enableButtonVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        } else {
            View._disableButtonVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        }
    }
}

