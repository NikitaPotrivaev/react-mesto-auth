import { PopupWithForm } from "./PopupWithForm";

export function ConfirmDeletePopup(props) {
    function handleSubmit(e) {
        e.preventDefault()
        props.onCardDelete(props.card)
    }

    return(
        <PopupWithForm
            isOpen = { props.isOpen }
            onClose = { props.onClose }
            onSubmit = { handleSubmit }
            title = 'Вы уверены ?'
            name = 'delete'
            buttonText = { props.isLoading ? 'Удаление...' : 'Да' }
        />
    )
}