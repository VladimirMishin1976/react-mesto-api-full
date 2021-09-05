import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки

  const isOwn = card.owner === currentUser._id;
  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `card__trash ${isOwn ? '' : 'card__trash_hidden'}`
  );

  // Like  
  const isLike = card.likes.some(item => item === currentUser._id);
  const cardLikeButtonClassName = (
    `card__like ${isLike && 'card__like_choosed'}`
  )

  function handleClick() {
    onCardClick(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img className="card__image" src={card.link} alt={card.name} onClick={handleClick} />
      <div className="card__contain">
        <h3 className="card__caption">{card.name}</h3>
        <div className="card__like-contain">
          <button className={cardLikeButtonClassName} type="button" aria-label="Лайкнуть" onClick={handleLikeClick} ></button>
          <p className="card__like-count">{card.likes.length}</p>
        </div>
        <button className={cardDeleteButtonClassName} type="button" aria-label="Удалить" onClick={handleDeleteClick} ></button>
      </div>
    </li>
  );
}

export default Card;