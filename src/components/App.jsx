import { Header } from "./Header"
import { Main } from "./Main"
import { Footer } from "./Footer"
import { useEffect, useState } from "react"
import { useNavigate, Route, Routes } from "react-router-dom"
import { EditAvatarPopup } from "./EditAvatarPopup"
import { EditProfilePopup } from "./EditProfilePopup"
import { AddPlacePopup } from "./AddPlacePopup"
import { ImagePopup } from "./ImagePopup"
import { CurrentUserContext } from "../context/CurrentUserContext"
import { ConfirmDeletePopup } from "./ConfirmDeletePopup"
import { ProtectedRoute } from "./ProtectedRoute"
import { InfoTooltip } from "./InfoTooltip"
import { Register } from "./Register"
import { Login } from "./Login"
import { api } from "../utils/Api"
import { authApi } from "../utils/Auth"

function App() {
  const [isEditAvatarPopup, setEditAvatarPopup] = useState(false)
  const [isEditProfilePopupOpen, setEditProfilePopup] = useState(false)
  const [isAddPlacePopup, setAddPlacePopup] = useState(false)
  const [isImagePopup, setImagePopup] = useState(false)
  const [isConfirmDeletePopupOpen, setConfirmDeletePopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [cards, setCards] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const [email, setEmail] = useState(false)
  const [isLogedIn, setIslogedIn] = useState(false)
  const [status, setStatus] = useState(false)
  const [tooltip, setTooltip] = useState(false)

  const navigate = useNavigate()

  function handleEditAvatarClick() {
    setEditAvatarPopup(true)
  }

  function handleEditProfileClick() {
    setEditProfilePopup(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopup(true)
  }

  function handleCardClick(card) {
    setImagePopup(true)
    setSelectedCard({ name: card.name, link: card.link })
  }

  function handleConfirmDeleteClick(card) {
    setSelectedCard(card)
    setConfirmDeletePopup(!isConfirmDeletePopupOpen)
  }

  function closeAllPopups() {
    setEditAvatarPopup(false)
    setEditProfilePopup(false)
    setAddPlacePopup(false)
    setImagePopup(false)
    setConfirmDeletePopup(false)
    setTooltip(false)
  }

  useEffect(() => {
    Promise.all([ api.getUserInfo(), api.getCardList() ])
      .then(([ userInfo, cardData ]) => {
        setCurrentUser(userInfo)
        setCards(cardData)
      })
      .catch(err => console.log(`Сервер не нашёл данные, ${err}`))
  }, [])

  useEffect(() => {
   const token = localStorage.getItem('token')
    if(token) {
      authApi.checkToken(token)
       .then(res => {
            setEmail(res.email)
            setIslogedIn(true)
            navigate('/')
        })
      .catch(err => console.log(`Ошибка при обработке токена, ${err}`))
    }
  }, [])

  function handleLogin(password, email) {
    setIsLoading(true)
    authApi.login(password, email)
      .then(res => {
        if(res.token) {
          localStorage.setItem('token', res.token)
          setEmail(email)
          setIslogedIn(true)
          navigate('/')
        }
    })
      .catch(err => {console.log(`Ошибка при авторизации пользователя ${err}`)
      setTooltip(true)
      setStatus(false)
    })
    .finally(() => setIsLoading(false))
  }

  function handleRegister(password, email) {
    setIsLoading(true)
    authApi.register(password, email)
      .then(() => {
        setTooltip(true)
        setStatus(true)
    })
    .catch(err => {console.log(`Ошибка при регистрации пользователя ${err}`)
      setTooltip(true)
      setStatus(false)
    })
    .finally(() => setIsLoading(false))
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setIslogedIn(false)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id)
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((item) => item._id === card._id ? newCard : item))
      })
      .catch(err => console.log(`Ошибка при попытке поставить лайк, ${err}`))
  }

  function handleCardDelete(card) {
    setIsLoading(true)
    api.deleteCard(card._id)
      .then(() => {setCards((element) => element.filter((item) => item._id !== card._id))
        closeAllPopups()
      })
      .catch(err => console.log(`Ошибка при удалении карточки, ${err}`))
      .finally(() => setIsLoading(false))
  }

  function handleUpdateUser(user) {
    setIsLoading(true)
    api.setUserInfo(user.name, user.about)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
        })
        .catch(err => console.log(`Ошибка при редактировании профиля, ${err}`))
        .finally(() => setIsLoading(false))
  }

  function handleUpdateAvatar(url) {
    setIsLoading(true)
    api.setUserAvatar(url)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(err => console.log(`Ошибка при редактировании аватара, ${err}`))
      .finally(() => setIsLoading(false))
  }

  function handleAddPlaceSubmit(name, link) {
    setIsLoading(true)
    api.addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch(err => console.log(`Ошибка при создании карточки, ${err}`))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        closeAllPopups()
      }
    })
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if(e.target.classList.contains('popup_opened') || e.target.classList.contains('popup__close')) {
        closeAllPopups()
      }
    })
  }, [])

  return (
    <CurrentUserContext.Provider value={ currentUser }>
      <div className="content">
        <div className="page">
          <Header
            isLogedIn = { isLogedIn }
            email = { email }
            isLogout = { handleLogout }
          />
          <Routes>
            <Route path='/'
              element = { <ProtectedRoute
              element = { Main }
              isLogedIn = { isLogedIn }
              onEditAvatar = { handleEditAvatarClick }
              onEditProfile = { handleEditProfileClick }
              onAddPlace = { handleAddPlaceClick }
              onCardClick = { handleCardClick }
              onCardLike = { handleCardLike }
              onConfirmDelete = { handleConfirmDeleteClick }
              cards = { cards } /> } 
            />
            <Route path="/sign-in"
              element = { <Login 
              onLogin = { handleLogin }
              isOpen = { tooltip }
              isLoading = { isLoading }
              onClose = { closeAllPopups } /> }
            />
            <Route path="/sign-up"
              element = { <Register
              isLoading = { isLoading }
              onRegister = {handleRegister}
              isOpen = { tooltip }
              onClose = { closeAllPopups } /> }
            />
          </Routes>
          <Footer/>
          <EditAvatarPopup
            isOpen = { isEditAvatarPopup }
            onClose = { closeAllPopups }
            onUpdateAvatar = { handleUpdateAvatar }
            isLoading = { isLoading }
          />
          <EditProfilePopup
            isOpen = { isEditProfilePopupOpen }
            onClose = { closeAllPopups }
            onUpdateUser = { handleUpdateUser }
            isLoading = { isLoading }
          />
          <AddPlacePopup
            isOpen = { isAddPlacePopup }
            onClose = { closeAllPopups }
            onAddPlace = { handleAddPlaceSubmit }
            isLoading = { isLoading }
          />
          <ImagePopup
            isOpen = { isImagePopup }
            onClose = { closeAllPopups }
            card = { selectedCard }
          />
          <ConfirmDeletePopup
            isOpen = { isConfirmDeletePopupOpen }
            onClose = { closeAllPopups }
            card = { selectedCard }
            onCardDelete = { handleCardDelete }
            isLoading = { isLoading }
          />
          <InfoTooltip
            isOpen = { tooltip }
            onClose = { closeAllPopups }
            status = { status }
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App