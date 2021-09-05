import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <>
      <main className="content">

        <section className="profile">
          <div className="profile__avatar-container" onClick={onEditAvatar}>
            <img className="profile__avatar" src={currentUser.avatar} alt="Аватар пользователя" />
            <div className="profile__aratar-pointer"></div>
          </div>
          <div className="profile__container">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button className="profile__edit-button" type="button" aria-label="Закрыть" onClick={onEditProfile}></button>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>

          <button className="profile__add-button" type="button" aria-label="Добавить фото" onClick={onAddPlace}></button>
        </section>

        <section className="cards">
          <ul className="cards__list">
            {cards.map((card) => {
              return (
                <Card card={card} onCardClick={onCardClick} key={card._id} onCardLike={onCardLike} onCardDelete={onCardDelete} />
              );
            })
            }
          </ul>
        </section>
      </main>
    </>
  );
}

export default Main;

