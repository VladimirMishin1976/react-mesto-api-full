class Api {
  constructor({ address}) {
    this._address = address;
    // this._token = token;
  }

  //  проверка ответа
  _checkResponse(res) {
    return res.ok
      ? res.json()
      : Promise.reject(`Ошибка: ${res.status}`);
  }


  getUserInfo() { //1. Загрузка информации о пользователе с сервера
    return fetch(`${this._address}/users/me`,
      {
        credentials: "include",
        headers: {
          // 'Authorization': `Bearer ${this._token}`,
        }
      }).then(this._checkResponse);
  }

  setUserInfo({ name, about }) { //3. Редактирование профиля
    return fetch(`${this._address}/users/me`,
      {
        credentials: "include",
        method: 'PATCH',
        headers: {
          // 'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          about: about
        })
      }
    ).then(this._checkResponse);
  }

  getInitialCards() { //2. Загрузка карточек с сервера
    return fetch(`${this._address}/cards`,
      {
        credentials: "include",
        headers: {
          // 'Authorization': `Bearer ${this._token}`,
        }
      }).then(this._checkResponse);
  }

  addCard({ name, link }) {  //4. Добавление новой карточки
    return fetch(`${this._address}/cards`,
      {
        credentials: "include",
        method: 'POST',
        headers: {
          // 'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          link: link
        })
      }).then(this._checkResponse);
  }

  removeCard(cardId) {  // 7. Удаление карточки
    return fetch(`${this._address}/cards/${cardId}`,
      {
        credentials: "include",
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${this._token}`,
        },
      }).then(this._checkResponse);
  }

  // Получение ссылки текущей(выбраной) карточки
  setCurrentElement(elem) {
    this.elem = elem;
  }

  // 8. Постановка и снятие лайка
  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return fetch(`${this._address}/cards/likes/${cardId}`,
        {
          credentials: "include",
          method: 'Delete',
          headers: {
            // 'Authorization': `Bearer ${this._token}`,
          }
        }).then(this._checkResponse);
    } else {
      return fetch(`${this._address}/cards/likes/${cardId}`,
        {
          credentials: "include",
          method: 'PUT',
          headers: {
            // 'Authorization': `Bearer ${this._token}`,
          }
        }).then(this._checkResponse);
    }
  }

  // 9. Обновление аватара пользователя
  editAvatarPhoto({ avatar }) {
    return fetch(`${this._address}/users/me/avatar`,
      { 
        credentials: "include",
        method: "PATCH",
        headers: {
          // 'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar: avatar
        })
      }).then(this._checkResponse);
  }
}

const api = new Api({
  address: 'http://api.mesto15.student.nomoredomains.club',
  // token: '1ffa7dc3-7c04-464d-a554-c3e498742c2a'
});

export default api;