import successfuly from '../images/successfuly.svg'
import error from '../images/error.svg'
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

export function InfoTooltip(props) {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!props.isOpen) return;
        
        function handleESC(e) {
          if (e.key === "Escape") {
            props.onClose()
          }
        }
        document.addEventListener("keydown", handleESC);
    
        return () => document.removeEventListener("keydown", handleESC);
    }, [props.isOpen]);

    function redirect() {
        if(props.status) {
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
                            <p className="auth__text">{ props.text }</p>
                        </>
                    ) : (
                        <>
                            <img src={error} className="auth__icon" alt="Ошибка"/>
                            <p className="auth__text">{ props.text }</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}