import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
const Layout = () => {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    );
}

export default Layout;