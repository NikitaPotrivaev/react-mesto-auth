import successfuly from '../images/successfuly.svg'
import error from '../images/error.svg'
import { useNavigate, useLocation } from "react-router-dom"

export function InfoTooltip(props) {
    const location = useLocation()
    const navigate = useNavigate()

    function redirect() {
        if(props.status)  {
            props.onClose()
            if(location.pathname === '/sign-up') {
                navigate('/sign-in')
            }
        }
        props.onClose()
    }

    return(
        <div className={ `popup ${props.isOpen ? 'popup_opened' : ''}` }>
            <div className="popup__container">
                <button className="popup__close" onClick = { redirect } type="button" aria-label="Закрыть форму" />
                <div className="auth__status">
                    { props.status ? (
                        <>
                            <img src={successfuly} className="auth__icon" alt="Успешно" />
                            <p className="auth__text">Вы успешно зарегистрировались!</p>
                        </>
                    ) : (
                        <>
                            <img src={error} className="auth__icon" alt="Ошибка"/>
                            <p className="auth__text">Что-то пошло не так! Попробуйте ещё раз.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}