import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";


export const router = createBrowserRouter([
    {   path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <div>"Home"</div>
    }
])