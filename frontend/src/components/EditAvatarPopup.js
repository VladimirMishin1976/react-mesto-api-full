import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const linkAvatar = React.useRef('');

  function hundleSubmit(e) {
    e.preventDefault();
    /* Значение инпута, полученное с помощью рефа */
    onUpdateAvatar({
      avatar: linkAvatar.current.value
    });
  }

  return (
    <PopupWithForm title="Обновить аватар" buttonText='Сохранить' name='edit-avatar' isOpen={isOpen}
      onClose={onClose} onSubmit={hundleSubmit} >
      <label className="popup__field">
        <input className="popup__input" type="url" placeholder="Ссылка на картинку" name="link" ref={linkAvatar} required />
        <span className="popup__input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;