import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './copyright.css';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import Axios from "axios";
import copyright from '../abis/copyrightcontract.json';
import cownership  from '../abis/cownershipcontract.json';
import Web3 from "web3";
class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
          web3: null,
          account: null,
          meta: null,
          hash: [],
          authid : 0,
          rows:[],
        };  
      }
      
      
      async componentWillMount() {
        await this.getuserid();
   
      }

      async getuserid()
      {
        // const response = await fetch('http://localhost:5000/getuserid').then(res => console.log(res.json()));
        
        Axios.get("http://localhost:5000/getuserid").then((response) => {
                this.setState({authid : response.data.userID});
                console.log(this.state.authid);
                this.getdata();
       
    });
 
      }

      getdata()
      {
        Axios.post("http://localhost:5000/readviolations",{authid:this.state.authid}).then((response) => {
     
          this.setState({rows :response.data.data});
          console.log(this.state.rows);
       });
     }
     
   
  render() {
      console.log("gotin")
    return (
        <div className="text-center">
        <h1 className='Heading'>Violations</h1>
        <table>
          <tr>
          <th> VID</th>
            <th> ViolatorID</th>
            <th> Hash </th>
          </tr>
          {this.state.rows.map((person, index) => (
            <tr>
            <td> {person.VID}</td>
            <td> {person.violatorid}</td>
            <td> {person.hash}</td>
            </tr>

))}
        </table>
        
    
    </div>
    
    
    )
  }
}

export default App;