import { useContext, useEffect, useState } from "react";
import { PopupWithForm } from "./PopupWithForm";
import { CurrentUserContext } from "../context/CurrentUserContext";

export function EditProfilePopup(props) {
    const currentUser = useContext(CurrentUserContext)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        setName(currentUser.name)
        setDescription(currentUser.about)
    }, [props.isOpen])

    function handleSubmit(e) {
        e.preventDefault()
        props.onUpdateUser({ 
            name, 
            about: description 
        })
    }
    
    return(
        <PopupWithForm
            isOpen = { props.isOpen }
            onClose = { props.onClose }
            onSubmit = { handleSubmit }
            title = 'Редактировать профиль'
            name = 'profile'
            buttonText = { props.isLoading ? 'Сохранение...' : 'Сохранить' }
        >
        <input name="name" className="popup__edit popup__edit_margin" type="text" placeholder="Ваше имя" value={ name || '' } onChange={ e => setName(e.target.value) } minLength="2" maxLength="40" required/>
            <span id="name-error" className="popup__error popup__error_active"></span>
        <input name="description" className="popup__edit" type="text" placeholder="Род деятельности" value={ description || '' } onChange={ e => setDescription(e.target.value) } minLength="2" maxLength="200" required/>
            <span id="description-error" className="popup__error popup__error_active"></span>
        </PopupWithForm>
    )
}