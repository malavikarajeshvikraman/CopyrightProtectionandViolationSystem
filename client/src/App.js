import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "./App.css";
import Main from "./pages/Main";
import Registration from "./pages/Registration";
import IPFS from "./pages/IPFS";
import Header from './components/Header/Header.js';
import Carousel from "./pages/Carousel.js";
import Gallery from "./pages/Gallery";
import Dashboard from "./pages/Dashboard";
import Copyrights from"./pages/Copyrights";
import Requests from'./pages/Requests';
import Violation from './pages/Violation';

function App() {
  return (
//     <Routes>
//   <Route path="teams/:teamId" element={<Team />} />
//   <Route path="teams/new" element={<NewTeam />} />
// </Routes>
<div className="App">
  

   <Router>
   <Header/>
   <Routes>

        <Route path="/registration" element={<Registration />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/carousel" element={<Carousel />} />
       <Route path="/" element={<Main />} />
       <Route path="/IPFS" element={<IPFS /> } />
       <Route path="/dashboard" element ={<Dashboard/>}/>
       <Route path="/copyrights" element ={<Copyrights/>}/>
       <Route path="/requests" element ={<Requests/>}/>
       <Route path="/violation" element ={<Violation/>}/>
     </Routes> 
     </Router>
 
     </div>

  );
}

export default App;
