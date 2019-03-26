class View {
    static _LOGIN = 'LOGIN';
    static _LOGOUT = 'LOGOUT';
    static _ADD_BUTTON_CLASS = 'add-button';
    static _PHOTOS_CLASS = 'photos';
    static _MORE_BUTTON_CLASS = 'more-button';
    static _LIKE_BUTTON_CLASS = 'btn-like';
    static _LIKED_BUTTON_CLASS = 'btn-liked';
    static _CHANGE_BUTTON_CLASS = 'change-button';
    static _DELETE_BUTTON_CLASS = 'delete-button';
    static _LIKES_COUNT_CLASS = 'count-like';
    static _HIDDEN_ELEMENT_CLASS = 'hidden-element';
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
            View._disableButtonVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        }
    }
    getPage(posts, add = false, del = false, totalNumber = this._totalNumber) {
        const self = this;
        const docElement = document.getElementsByClassName(View._PHOTOS_CLASS)[0];
        docElement.innerHTML = View._removeAllPosts();
        this._displayedNumber = 0;
        docElement.appendChild(self._createPostsFragment(posts));
        this._onGetPageChange(add, del, totalNumber);
    }
    updatePostLikes(post, isLike = true) {
        const self = this;
        const requiredPost = document.getElementById(post.id);
        const likesField = requiredPost.getElementsByClassName(View._LIKES_COUNT_CLASS)[0];
        likesField.innerHTML = `${post.likes.length} likes`;
        const btnLike = isLike? requiredPost.getElementsByClassName(View._LIKE_BUTTON_CLASS)[0]:
            requiredPost.getElementsByClassName(View._LIKED_BUTTON_CLASS)[0];
        btnLike.outerHTML = self._createLikeButton(post);
    }
    static _removeAllPosts() {
        return `<ul class="photos">
                </ul>`
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
    _createPostElement(post) {
        return `
                    <h3>${post.author}</h3>
                    <h3 class="date">${View._formatDate(post.creationDate)}</h3>
                    <img src=${post.photoLink} alt="/"><br>
                    ${this._createChangeButton(post)}                  
                    ${this._createDeleteButton(post)}
                    ${this._createLikeButton(post)}
                    <a class="count-like">${post.likes.length} likes</a>
                    <p>${post.description}<br>${View._fixHashTags(post.hashTags)}</p>
                `;
    }
    _createLikeButton(post){
        return `<button class="${!this._user.unLog?post.likes.includes(this._user.name)?
            View._LIKED_BUTTON_CLASS: View._LIKE_BUTTON_CLASS: View._HIDDEN_ELEMENT_CLASS}"
                type="submit"><i class="fa fa-heart" aria-hidden="true"></i>♥ Like</button>`
    }
    _createDeleteButton(post){
        return `<button class="${post.author === this._user.name? View._DELETE_BUTTON_CLASS: View._HIDDEN_ELEMENT_CLASS}"
                    type="submit">Delete</button>`
    }
    _createChangeButton(post){
        return `<button class="${post.author === this._user.name? View._CHANGE_BUTTON_CLASS: View._HIDDEN_ELEMENT_CLASS}"
                     type="submit">Change</button>`
    }
    _createPostsFragment(posts){
        const self = this;
        const fragment = document.createDocumentFragment();
        posts.forEach(function (post) {
            const postEl = document.createElement('li');
            postEl.setAttribute('id', post.id);
            postEl.innerHTML = self._createPostElement(post);
            fragment.appendChild(postEl);
            self._displayedNumber += 1;
        });
        return fragment;
    }
    _onLoginUpdate() {
        View._updateHeader(this._user);
        View._enableButtonVisibility(document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0]);
    }
    _onLogoutUpdate() {
        View._updateHeader(this._user);
        View._disableButtonVisibility(document.getElementsByClassName(View._ADD_BUTTON_CLASS)[0]);
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
            View._enableButtonVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        } else {
            View._disableButtonVisibility(document.getElementsByClassName(
                View._MORE_BUTTON_CLASS)[0]);
        }
    }
}

