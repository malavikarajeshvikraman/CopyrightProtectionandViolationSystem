import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './copyright.css';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import Axios from "axios";
import copyright from '../abis/copyrightcontract.json';
import web3 from "web3";
class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
          web3: null,
          account: null,
          meta: null,
          hash: [],
          authid : 0
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
    });
      }
    
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    async loadBlockchainData() {
      const data = {
    
        meta : null,
    
      }
      const hashes = [];
      const a  = this.state.authid;
 
      const web3 =window.web3;
     
        const app  = {
          start: async function() {
            try {
              // get contract instance
            
              const networkId = await web3.eth.net.getId();
              const deployedNetwork = copyright.networks[networkId];
              data.meta = new web3.eth.Contract(
                copyright.abi,
                deployedNetwork.address,)
              ;
              console.log(deployedNetwork);
              console.log(data.meta)
              // get accounts
              const accounts = await web3.eth.getAccounts();
              this.account = accounts[0];
        
              this.refreshValue();
            } catch (error) {
              console.error(error);
            }
          },
    
          refreshValue: async function() {
            // const { getValue } = await data.meta.methods;
            // const storeValue = await getValue().call();
            this.checkLastBlock();
          },
               
        
          checkLastBlock: async function() {
            const latest = await web3.eth.getBlockNumber()
            let txStr = ''
            for(let i = 0; i <= latest; i++ ) {
              const block = await web3.eth.getBlock(i);
              // console.log(`Searching block ${ block.number }...`);
              if (block && block.transactions) {
                // for (let tx of block.transactions) {
                //     let transaction = await web3.eth.getTransaction(tx);
                //     let data = web3.utils.hexToAscii('0x' + transaction.input.slice(138, transaction.input.length))
                //     if (this.account === transaction.from && transaction.to !== null) {
                //       txStr += `<li>Block ${i} : `
                //       txStr += `To Address: ${transaction.to}, Data: ${data}, Timestamp: ${block.timestamp}</li>`
                //     }
                //   }
                // const txULElement = document.getElementsByClassName("tx")[0];
                // txULElement.innerHTML = txStr
                for (let tx of block.transactions) {
                let transaction = await web3.eth.getTransaction(tx);
                let data = web3.utils.hexToAscii('0x' + transaction.input.slice(330, 422))
                if (this.account === transaction.from && transaction.to === '0x1B6095e094fd500554b75a9A97F59B7404eBFFcB') {
                    var auth=transaction.input.slice(262,266);
                    auth=web3.utils.hexToNumber('0x'+auth)
                    if(auth === a)
                               { console.log('here')
                               hashes.push("https://ipfs.infura.io/ipfs/"+data);
                               }
                               
                }
                }
     
    
              }
             
            }
   
           
          },
    
        }
        try {
          // get contract instance
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = copyright.networks[networkId];
          data.meta = new web3.eth.Contract(
            copyright.abi,
            deployedNetwork.address,
          );
    
          // get accounts
          const accounts = await web3.eth.getAccounts();
          this.account = accounts[0];
    
          app.refreshValue();
          this.setState({hash:Array.from(new Set(hashes))});
        } catch (error) {
          console.error(error);

        }  
      
        const res = app.start().then(this.setState({hash : Array.from(new Set(hashes))}));
        
        
      
    }
  render() {
      console.log("gotin")
      
    return (
        <div className="text-center">
        <h1 className='Heading'>Copyright Licenses</h1>
        <table>
          <tr>
            <th> URL {this.state.hash.length}</th>
          </tr>
          {this.state.hash.map((person, index) => (
            <tr>
            <td> {index}</td>
  
            </tr>

))}
        </table>
  

    
    </div>
    
    
    )
  }
}

export default App;