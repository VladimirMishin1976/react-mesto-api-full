import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

import api from '../utils/api';

import * as auth from '../utils/auth';

import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
// изображения для попапа статуса регистрации/авторизации
import imgSuccessSign from '../images/success.svg';
import imgUnSuccessSign from '../images/unsuccess.svg';

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ link: '', name: '' });
  const [currentUser, setCurrentUser] = React.useState({ name: 'Жак-Ив Кусто', about: 'Исследователь' });
  const [cards, setCards] = React.useState([]);
  // Начальное состояние  loggedIn = null - для блокировки начального появления окна регистрации
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [userData, setUserData] = React.useState({ _id: '', email: '' });
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupData, setIsInfoTooltipPopupData] = React.useState({ image: '', text: '' });
  const history = useHistory();

  // Загрузка сохраненных данных о пользователе + карточках с сервера
  React.useEffect(() => {
    handleCheckToken();
    Promise.all([api.getInitialCards(), api.getUserInfo()])
      .then(([cardsData, userData]) => {
        setCards(cardsData);
        console.log(userData)//---------------------------------------------------------
        setCurrentUser(userData);
      }).catch(err => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id)

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, isLiked)
      .then(newCard => {
        setCards(state => state.map(c => c._id === card._id ? newCard : c));
      })
      .catch(err => console.error(err));
  }
  // функции карточек
  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(_ => {
        setCards(state => {
          return state.filter(c => c._id !== card._id);
        })
      }).catch(err => console.error(err));
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleAddPlaceSubmit(name, link) {
    api.addCard(name, link)
      .then(card => {
        closeAllPopups();
        setCards([card, ...cards]);
      }).catch(err => console.error(err));
  }

  // функции аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleUpdateUser(name, about) {
    api.setUserInfo(name, about)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      }).catch(err => console.error(err));
  }

  function handleUpdateAvatar(avatar) {
    api.editAvatarPhoto(avatar)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      }).catch(err => console.error(err));
  }
  //  закрыть попапы
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ image: '', text: '' });
    setIsInfoTooltipPopupOpen(false);
  }
  // Авторизация
  function handleRegister({ password, email }) {
    auth.register(password, email)
      .then(res => {
        const { email } = res.data;
        setUserData({ ...userData, email });
        setIsInfoTooltipPopupData({ image: imgSuccessSign, text: 'Вы успешно зарегистрировались!' });
        handleLogin({ password, email });
      })
      .catch(err => {
        console.log(err);
        setIsInfoTooltipPopupData({ image: imgUnSuccessSign, text: 'Что-то пошло не так! Попробуйте ещё раз.' })
      })
      .finally(_ => {
        setIsInfoTooltipPopupOpen(true);
      });
  }

  function handleLogin({ password, email }) {
    auth.authorize(password, email)
      .then(res => {
        const { token } = res;
        localStorage.setItem('token', token);
        setLoggedIn(true);
        history.push('/');
        setUserData({ ...userData, email });
      })
      .catch(err => {
        console.log(err);
        setIsInfoTooltipPopupData({ image: imgUnSuccessSign, text: err + ' Пароль или email неверен' });
        setIsInfoTooltipPopupOpen(true);
      })
  }

  function handleCheckToken() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.checkToken(token)
        .then(res => {
          const { _id, email } = res;
          setUserData({ _id, email });
          setLoggedIn(true);
          history.push('/');
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      setLoggedIn(false);
    }
  }

  function handleLogOut() {
    setLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/signin');
    setUserData({ _id: '', email: '' });
  }
  // если токен есть - при загрузке блокируется кратковременное появление окна регистрации
  if (loggedIn === null) {
    return (
      <Header userData={userData} handleLogOut={handleLogOut} />
    )
  }

  // // -----------------------------------------------------------------------------------------------------------------------------
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="container">
          <Header
            userData={userData}
            handleLogOut={handleLogOut}
            loggedIn={loggedIn} />

          <Switch>
            <ProtectedRoute exact path='/'
              loggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />

            <Route path='/signin'>
              <Login handleLogin={handleLogin} />
            </Route>
            <Route path='/signup'>
              <Register handleRegister={handleRegister} />
            </Route>
            <Route>
              {loggedIn ? (
                <Redirect to="/" />
              ) : (
                <Redirect to="/signup" />
              )}
            </Route>
          </Switch>

          <Footer />

          {/* Попап - редактировать профиль */}
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

          {/* <!-- Попап - Добавление картчки --> */}
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

          {/* <!-- Попап - изменить аватар --> */}
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

          {/* <!-- Попап - Показать картинку --> */}
          <ImagePopup onClose={closeAllPopups} card={selectedCard} />

          {/* Попап модального окна,который информирует пользователя об успешной */}
          <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups}
            image={isInfoTooltipPopupData.image} text={isInfoTooltipPopupData.text} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
