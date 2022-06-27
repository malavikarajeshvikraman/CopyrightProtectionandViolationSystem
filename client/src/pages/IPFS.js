import React, { Component } from 'react';
import { Alert ,Button,Modal } from 'react-bootstrap';
import './IPFS.css';
// import Image from '../abis/image.json';
import copyright from '../abis/copyrightcontract.json';
import  { Navigate } from 'react-router-dom'
import Web3 from "web3";
import Axios from "axios";
//import {imageHash} from 'image-hash';
import { Buffer  } from 'buffer';
import { create } from 'ipfs-http-client';
import { devNull } from 'os';
import image from './copyright.jpg';

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
}) 


class App extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  // Creates web3 instance that connects to Metamask
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
async loadBlockchainData() {
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })
  const networkId = await web3.eth.net.getId()
  console.log(networkId)
  // const networkData1 = Image.networks[networkId]
  const networkData2 = copyright.networks[networkId]
  if(networkData2) {
    // const contract1 = new web3.eth.Contract(Image.abi, networkData1.address)
    const contract2 = new web3.eth.Contract(copyright.abi, networkData2.address)
    this.setState({ contract2 })
  } else {
    window.alert('Smart contract not deployed to detected network.')
  }
}
  constructor(props){
    super(props);
    this.state = {
      imageHash: '',
      contract2:null,
      web3: null,
      buffer: null,
      account: null,
      ownerid:null,
      phash:null,
      phashes:[],
      authid: [],
      modalmessage:'',
      isSubmitting:true,

    };
  }
    // Processing the file
       captureFile = (event) => {
       event.preventDefault();
       console.log('file captured...')
       //Process File for IPFS...
       const file = event.target.files[0]
       const reader = new window.FileReader()
      //  The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read.
      reader.readAsArrayBuffer(file); 
      reader.onloadend = () => {
        this.setState({buffer : Buffer(reader.result)})
        console.log('buffer', this.state.buffer)
      }

  }
  onSubmitClick = async (event)=>{
  event.preventDefault()
  console.log("Submitting File");
  if(this.state.buffer){
    //console.log(this.state.buffer);
    const file =  await ipfs.add(this.state.buffer);
     const web3=window.web3;
    //compare with blockchain
    const latest=await web3.eth.getBlockNumber();
    for(let i=0; i<=latest;i++){
      const block = await web3.eth.getBlock(i);
      if (block && block.transactions){
        for(let tx of block.transactions){
          let data2,data3,auth;
          let transaction = await web3.eth.getTransaction(tx);
          // let data1 = '0x'+transaction.input.slice(0,transaction.input.length);
               if (transaction.to === '0x1B6095e094fd500554b75a9A97F59B7404eBFFcB')
              // if (transaction.to === '0x2E555395345DDeF429478b7EABECaB1b6d31CebB')
                {//data2=transaction.input.slice(16,transaction.input.length);
                 // data3=web3.utils.hexToAscii(data2);
                  //console.log(data3);
                  data2= web3.utils.hexToAscii('0x'+transaction.input.slice(74,202));
                  //console.log(data2);
                  this.state.phashes.push(data2);
                  //data3=web3.utils.hexToAscii('0x'+transaction.input.slice(330,546));
                  //console.log(data3);
                  auth=transaction.input.slice(262,266);
                  console.log(web3.utils.hexToNumber('0x'+auth));
                  this.state.authid.push(web3.utils.hexToNumber('0x'+auth));
                  //this.state.imghash.push(data3);
                }
        //  console.log('bytes : '+data1);
       }

       }


    }
   console.log(file);
   const imagehash = file.path;
   this.setState({imageHash: imagehash});
   var _data = {imageHash : imagehash}
  //  this.state.contract1.methods.set(imagehash).send({from: this.state.account}).then((r)=>{
  //    this.setState({imageHash: imagehash})
  //  })
   
   console.log(JSON.stringify(_data))
    const options =  {
      method: 'POST',
      headers : {'Content-type' : 'application/json'},
      body: JSON.stringify(_data),
    }
    const response = await fetch('http://localhost:5000/image',options).then(res => res.json()).then(json => 
    {console.log(json)
    this.setState({data : json});})
    this.setState({phash: this.state.data['phash']});
    this.setState({ownerid: this.state.data['ownerid']});
    console.log(this.state.phash,this.state.ownerid);
    let violationChecker=0;
    console.log(this.state.phashes);
    console.log(this.state.authid);
    for(let i=0;i<this.state.phashes.length;i++){
      if(this.state.phash==this.state.phashes[i]){
        violationChecker=1;

        break;
      }
    }
    if(violationChecker){
      console.log('violation');
        // console.log('violator is '+this.state.ownerid);
        alert("Violation detected");
        Axios.post("http://localhost:5000/addviolation", {
          ownerid : this.state.ownerid,        violaterid:this.state.authid,        hash:this.state.imageHash
    }).then((response) => {
      console.log(response);
    });
        window.ethereum.disable(); 
        

    }
    else{
      console.log('No violation');

              this.setState({ modalmessage:'No violation'});
              alert(this.state.modalmessage);
              Axios.post("http://localhost:5000/role", {
            });
    }
    
    this.state.contract2.methods.newCopyright(imagehash,Web3.utils.asciiToHex(this.state.phash.slice(0,32)),Web3.utils.asciiToHex(this.state.phash.slice(32,64)),this.state.ownerid).send({from: this.state.account}).then((r)=>{
     console.log("Gotin")
    });

           this.setState({isSubmitting:false});



   }

  // ipfs.add(this.state.buffer, (error, result) => {
  //   console.log('Ipfs result', result)
  //   if(error) {
  //     console.error(error)
  //     return
  //   }
  //   const imageHash = result[0].hash;
  //   console.log('Hash is ', imageHash);
  //    this.state.contract.methods.set(imageHash).send({ from: this.state.account }).then((r) => {
  //      return this.setState({ imageHash: imageHash })
  //    })
  // })
  
}
  render() {
    return (
      <div>
       
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <div className="container-form">

                  <h1> <b>Upload Image and Obtain Copyright</b> </h1>
                  <img
        class="image-rounded-corner"
        src= {image}
        alt="no preview available"
      />
                <form>
                  <input type="file" onChange={this.captureFile}></input>
                  <input type="submit" onClick={this.onSubmitClick}></input>
                  {this.state.isSubmitting && (
                  <span className="spinner-grow spinner-grow-sm"></span>
                )}
                </form>
                </div>
                <div>
                <p>
 
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;