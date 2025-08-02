import logo from './logo.svg';
import './App.css';
import '@fontsource/barlow';
import { router } from "./routes/router.jsx";
import { RouterProvider } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { login, logout } from './store/auth-slice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const authenticate = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/users/profile", { withCredentials: true });
  //       const user = response.data.user;
  //       console.log(user);
  //       dispatch(login({
  //         _id: user._id,
  //         name: user.name,
  //         email: user.email,
  //         position: user.position,
  //         gender: user.gender,
  //         location: user.location
  //       }));
  //     }
  //     catch (error) {
  //       if (error.response && error.response.status === 401) {
  //         dispatch(logout());
  //       }
  //       else {
  //         console.log(error.message);
  //       }
  //     }
  //   }
  //   authenticate();
  // }, []);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
