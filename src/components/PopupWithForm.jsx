export function PopupWithForm(props) {
  return(
   <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={ props.onClose } aria-label="Закрыть"></button>
        <h2 className="popup__title ">{ props.title }</h2>
        <form className="popup__form" name={ props.name } onSubmit={ props.onSubmit } noValidate>
          { props.children }
          <button type="submit" className="popup__submit" aria-label="save">{ props.buttonText }</button>
        </form>
      </div>
   </div>
  )
}