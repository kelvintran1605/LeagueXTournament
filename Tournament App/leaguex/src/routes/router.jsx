import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Login from "../pages/Login.jsx";
import SignUp from '../pages/SignUp.jsx';
import Password from '../components/steps/Password.jsx';
import SignUpLayout from '../layouts/SignUpLayout.jsx';
import Layout from '../layouts/HomeLayout.jsx';
import Home from '../pages/Home';
import { RegisterArea } from '../contexts/RegisterContext.js';
import Name from '../components/steps/BasicInfo.jsx';
import Welcome from '../pages/Welcome.jsx';
import Team from '../pages/Team.jsx';
import CreateTeam from "../pages/CreateTeam.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"
import RootLayout from '../layouts/RootLayout.jsx';
import PublicOnlyRoute from "../components/PublicOnlyRoute.jsx";
import UserDashBoard from '../layouts/UserDashBoard.jsx';
import BrowseTeam from '../pages/BrowseTeam.jsx';
import TeamSettings from '../pages/TeamSettings.jsx';
import Profile from '../pages/Profile.jsx';
import AdminDashboard from '../pages/AdminDashBoard.jsx';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute.jsx';
import BrowseTournament from "../pages/BrowseTournament.jsx";
export const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<RootLayout />}>
        <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
        </Route>
        <Route path='/user-dashboard' element={<ProtectedRoute><UserDashBoard /></ProtectedRoute>}>
            <Route path='browse-team' element={<BrowseTeam />} />
            <Route path='team' element={<Team />} />
            <Route path='team-settings' element={<TeamSettings />}></Route>
            <Route path='profile' element={<Profile />}></Route>
            <Route path='browse-tournaments' element={<BrowseTournament />}></Route>
        </Route>
        <Route path='/admin-dashboard' element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path='welcome' element={<Welcome />} />
        <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="create-account" element={<PublicOnlyRoute><RegisterArea><SignUpLayout /></RegisterArea></PublicOnlyRoute>}>
            <Route index element={<SignUp />}></Route>
            <Route path='password' element={<Password />}></Route>
            <Route path='info' element={<Name />}></Route>
        </Route>
        <Route path='create-team' element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
    </Route>


));
