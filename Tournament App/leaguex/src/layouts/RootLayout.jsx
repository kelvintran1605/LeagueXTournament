import { Outlet } from "react-router-dom";
import AuthManager from "../components/AuthManager";
const RootLayout = () => {
    return (
        <>
            <AuthManager />
            <Outlet />
        </>
    );
}

export default RootLayout;