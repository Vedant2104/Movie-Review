
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
          <Route path="/admin" element={<h1 className='text-4xl text-center'>Welcome to Admin Page , {user ? (<h1>{user.name}</h1>):(<></>)}</h1>} />
          <Route path="/user" element={<UserProfile/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
