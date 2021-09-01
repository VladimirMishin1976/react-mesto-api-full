import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('Жак-Ив Кусто');
  const [description, setDescripton] = React.useState('Исследователь');

  // Обработчики изменения инпута обновляет стейт
  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescripton(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(_ => {
    setName(currentUser.name);
    setDescripton(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    // <!-- Попап - редактировать профиль -->
    <PopupWithForm title="Редактировать&nbsp;профиль" buttonText='Сохранить' name='edit-profile' isOpen={isOpen}
      onClose={onClose} onSubmit={handleSubmit}>
      <label className="popup__field">
        <input className="popup__input" type="text" placeholder="Имя" name="name" minLength="2" maxLength="40"
          onChange={handleChangeName} value={name} required/>
        <span className="popup__input-error"></span>
      </label>
      <label className="popup__field">
        <input className="popup__input" type="text" placeholder="Работа" name="about" minLength="2" maxLength="200"
          onChange={handleChangeDescription} value={description} required/>
        <span className="popup__input-error"></span>
      </label>
    </PopupWithForm>
  )

}

export default EditProfilePopup;