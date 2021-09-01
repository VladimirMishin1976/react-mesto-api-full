function PopupWithForm({ title, name, isOpen, onClose, buttonText, children, onSubmit }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <form className="popup__container" name={name} onSubmit={onSubmit}>
        <h2 className="popup__title">{title}</h2>

        {children}

        <button className="popup__save" type="submit">{buttonText}</button>
        <button className="popup__close" type="button" aria-label="Закрыть" onClick={onClose}></button>
      </form>
    </div>
  );
}

export default PopupWithForm;