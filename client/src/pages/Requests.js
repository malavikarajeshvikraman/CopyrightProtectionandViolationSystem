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
          imageHash: '',
          contract2:null,
          buffer: null,
          modalmessage:'',
          isSubmitting:true,
        };  
      }
      
      
      async componentWillMount() {
        await this.getuserid();
        await this.loadWeb3()
        await this.loadBlockchainData()
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
        Axios.post("http://localhost:5000/readrequest",{authid:this.state.authid}).then((response) => {
     
          this.setState({rows :response.data.data});
          console.log(this.state.rows);
      
            
      
      });
      }
      async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        console.log(networkId)
        // const networkData1 = Image.networks[networkId]
        const networkData2 = cownership.networks[networkId]
        if(networkData2) {
          // const contract1 = new web3.eth.Contract(Image.abi, networkData1.address)
          const contract2 = new web3.eth.Contract(cownership.abi, networkData2.address)
          this.setState({ contract2 })
        } else {
          window.alert('Smart contract not deployed to detected network.')
        }
      }

      
      async loadWeb3() {
  

        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
   
  
    
     
     
    
   
  render() {
      console.log("gotin")
    return (
        <div className="text-center">
        <h1 className='Heading'>Requests</h1>
        <table>
          <tr>
            <th> Request ID</th>
            <th> Requestee ID </th>
            <th> Amount </th>
            <th> Accept </th>
          </tr>
          {this.state.rows.map((person, index) => (
            <tr>
            <td> {person.RID}</td>
            <td> {person.userid}</td>
            <td> {person.amount}</td>
            <td> <button onClick = {() => {  this.state.contract2.methods.newCownership(person.hash,person.ownerid,person.userid).send({from: this.state.account}).then((r)=>{
         console.log("Contract established");
         alert("Contract Established");
        });
    }}>Accept</button></td>
            </tr>

))}
        </table>
        
    
    </div>
    
    
    )
  }
}

export default App;