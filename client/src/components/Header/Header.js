import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Axios from "axios";
import "./Header.css";

const Header = () => {
    const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();
  useEffect(() =>{
      if(location.pathname==='/'){
          setActiveTab("Home");
      }
      else if(location.pathname==='/registration'){
          setActiveTab("Registration");
      }
     
      else if(location.pathname==='/ipfs'){
          setActiveTab("IPFS")
      }
      else if(location.pathname==='/carousel'){
          setActiveTab("Carousel");
      }
      else if(location.pathname==='/logout'){
        setActiveTab("Logout");
    }
  }, [location]);


  
    return (
    <div className='header'>
<p className='logo'> Copyright Protection and Violation Detection</p>
<div className='header-right'>
    <Link to="/">
        <p className={`${activeTab==="Home" ? "active" : ""}`} 
        onClick={() => setActiveTab("Home")}>Home</p>
        </Link>
    <Link to="/registration">
       <p className={`${activeTab==="Registration" ? "active" : ""}`}
               onClick={() => setActiveTab("Registration")}>Registration</p>
    </Link>
    <Link to="/ipfs">
       <p className={`${activeTab==="IPFS" ? "active" : ""}`}
               onClick={() => setActiveTab("IPFS")}>IPFS</p>
    </Link>
    <Link to="/carousel">
       <p className={`${activeTab==="Carousel" ? "active" : ""}`}
               onClick={() => setActiveTab("Carousel")}>Gallery</p>
    </Link>
    <Link to="/logout">
       <p className={`${activeTab==="logout" ? "active" : ""}`}
               onClick={() => {setActiveTab("logout");  Axios.get("http://localhost:5000/logout", {
            });}}>Logout</p>
    </Link>
</div>

    </div>
  )
}

export default Header