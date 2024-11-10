
import './App.css'
import { Navbar } from './components/Navbar'
import { SignUp } from './components/SignUp'

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { SignIn } from './components/SignIn';
import MainMenu from './components/MainMenu';
import Forgot from './components/Forgot';
import { useEffect } from 'react';
import  UserProfile from './components/UserProfile';
import Admin from './components/Admin';
import MovieDetails from './components/MovieDetails';



function App() {
  let user;
  // useEffect(() => {
  //   user = JSON.parse(localStorage.getItem("userInfo"));
  // })
  
  // console.log(user);
  return (
    <>
    <Router>
        <Navbar />
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot" element={<Forgot/>} />
          <Route path="/" element={<MainMenu/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/user" element={<UserProfile/>} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
