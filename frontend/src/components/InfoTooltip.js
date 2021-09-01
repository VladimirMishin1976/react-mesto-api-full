function InfoTooltip({ image, text, isOpen, onClose }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__container popup__container_place_info-tool'>
        <img className='info-tool__img' alt={text} src={image} />
        <h2 className=" popup__title popup__title_type_center">{text}</h2>
        <button className="popup__close popup__close_type_center" type="button" aria-label="Закрыть" onClick={onClose}></button>
      </div>
    </div >
  )
}

export default InfoTooltip;