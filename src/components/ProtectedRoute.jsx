import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ element: Component, ...props }) => {
    return(
        props.isLogedIn ? <Component { ...props } /> : <Navigate to='/sign-in'/>
    )
}