import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [nameCard, setNameCard] = React.useState('');
  const [linkCardImage, setLinkCardImage] = React.useState('');

  React.useEffect(_ => {
    setNameCard('');
    setLinkCardImage('');
  }, [isOpen]);

  function handleChangeNameCard(e) {
    setNameCard(e.target.value);
  }

  function handleChangeLinkCardImage(e) {
    setLinkCardImage(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: nameCard,
      link: linkCardImage
    });
  }

  return (
    <PopupWithForm title="Новое место" buttonText='Создать' name='add-card'
      isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} >
      <label className="popup__field">
        <input className="popup__input" type="text" placeholder="Название" name="name" minLength="2" maxLength="30"
          onChange={handleChangeNameCard} value={nameCard} required/>
        <span className="popup__input-error"></span>
      </label>
      <label className="popup__field">
        <input className="popup__input" type="url" placeholder="Ссылка на картинку" name="link"
          onChange={handleChangeLinkCardImage} value={linkCardImage} required/>
        <span className="popup__input-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup;