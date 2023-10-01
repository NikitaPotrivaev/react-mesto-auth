export function ImagePopup(props) {
    return(
        <div className={ `popup popup_zoom_active ${ props.isOpen ? 'popup_opened' : '' }`}>
            <div className="popup__zoom-container">
                <img src={ props.card.link } className="popup__image" alt={ props.card.name }/>
                <button type="button" className="popup__close" aria-label="Закрыть" onClick={ props.onClose }></button>
                <p className="popup__description">{ props.card.name }</p>
            </div>
        </div>
    )
}