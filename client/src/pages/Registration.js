import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from 'react-router-dom';
import "../App.css";
import "./Registration.css";
import birds from "./birds.jpg"

export default function Registration() {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:5000/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    Axios.post("http://localhost:5000/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].username);
      }
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].username);
      }
    });
  }, []);



  useEffect(() => {
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].username);
      }
      else
        alert("Illegal Login")
    });
  }, []);

  return (

    <section class="container">
    <div class="left-half">
      <div className="images">
       <img src={birds}/> 
      </div>
      <div className="head">
       <h1> COPYRIGHT PROTECTION AND VIOLATON DETECTION USING BLOCKCHAIN</h1>         
      </div>
    </div>


    <div class="right-half">
      <div className="registration">
        <h1>Registration</h1>
        <div className="username">
          <label>Username</label>
          <input
            type="text"
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}
          />
        </div>
        <div className="password"> 
          <label>Password  </label>
          <input
            type="text"
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
          />
        </div>
        
        <br></br>
        <br></br>
        <button onClick={register}> Register </button>
      </div>
      
      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      <Link to="/ipfs">
        <button onClick={login}> Login </button>
        </Link>
      </div>

      {/* <Link to="/ipfs">
        <button classname="btn btn-contact">Upload Image</button>
      </Link> */}
    </div>
  </section>
     
  );
}
