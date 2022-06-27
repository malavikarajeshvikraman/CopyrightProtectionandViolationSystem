import React, { Component  } from "react";
// import { CarouselData } from "./CarouselData";
import copyright from '../abis/copyrightcontract.json';
import web3 from "web3";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Swipe from "react-easy-swipe";
import './Carousel.css';
import Axios from "axios";
import { Carousel } from '@sefailyasoz/react-carousel'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      paused: false,
      web3: null,
      account: null,
      meta: null,
      hash: [],
      authid : 0,
      amount:0
    };  
  }
  
  moneyamount = event =>
  {
    this.setState({amount:event.target.value})

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
                           console.log(data)
                           let auth=transaction.input.slice(262,266);
                           auth = web3.utils.hexToNumber('0x'+auth);
                           hashes.push({image : "https://ipfs.infura.io/ipfs/"+data,authid: auth});
                           
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
    } catch (error) {
      console.error(error);
    }  
  
    const res = app.start().then(this.setState({hash : hashes}));
    
    console.log(this.state.hash)
  
}

  componentDidMount() {

    console.log(this.state.hash)

    setInterval(() => {
      if (this.state.paused === false) {
        let newSlide =
          this.state.currentSlide === this.state.hash.length - 1
            ? 0
            : this.state.currentSlide + 1;
        this.setState({ currentSlide: newSlide });
      }
    }, 3000);
  }

  nextSlide = () => {
    let newSlide =
      this.state.currentSlide === this.state.hash.length - 1
        ? 0
        : this.state.currentSlide + 1;
    this.setState({ currentSlide: newSlide });
  };

  prevSlide = () => {
    let newSlide =
      this.state.currentSlide === 0
        ? this.state.hash.length - 1
        : this.state.currentSlide - 1;
    this.setState({ currentSlide: newSlide });
  };

  setCurrentSlide = (index) => {
    this.setState({ currentSlide: index });
  };

  render() {
    return (
      <div className="mt-8">
        <div className="max-w-lg h-72 flex overflow-hidden nice relative">
          <div className="aol">
            <AiOutlineLeft
              onClick={this.prevSlide}
              className="absolute left-0 text-3xl inset-y-1/2 text-white cursor-pointer" style={{color:"blue"}}
            />
          </div>
          

          <Swipe onSwipeLeft={this.nextSlide} onSwipeRight={this.prevSlide}>
            {this.state.hash.map((slide, index) => {
              return (
                <>
                   <img
              
              src={slide.image}        
              
              alt="This is a carousel slide"
              key={index}
              
              className={
                index === this.state.currentSlide
                  ? "block w-full h-auto image object-cover"
                  : "hidden"
              }
              onMouseEnter={() => {
                this.setState({ paused: true });
            
              }}
              onMouseLeave={() => {
                this.setState({ paused: false });

              }}
            />
            <input type="number"  onChange={this.moneyamount}className={
                index === this.state.currentSlide
                  ? "block w-full h-auto image object-cover"
                  : "hidden"
              }
              onMouseEnter={() => {
                this.setState({ paused: true });
            
              }}
              onMouseLeave={() => {
                this.setState({ paused: false });

              }}></input>
            <button onClick={() => {  Axios.post("http://localhost:5000/addrequest", {
       ownerid : slide.authid,
       hashid :slide.image,
       userid:this.state.authid,
       amount:this.state.amount
    }).then((response) => {
      console.log(response);
    });}} className={
                index === this.state.currentSlide
                  ? "block w-full h-auto image object-cover"
                  : "hidden"
              }
              onMouseEnter={() => {
                this.setState({ paused: true });
            
              }}
              onMouseLeave={() => {
                this.setState({ paused: false });

              }}>Request Copyright</button>
                </>
             
                
              );
            
            })}
          </Swipe>

          <div className="absolute w-full flex justify-center bottom-0">
            {this.state.hash.map((element, index) => {
              return (
                <div
                  className={
                    index === this.state.currentSlide
                      ? "h-2 w-2 bg-blue-700 rounded-full mx-2 mb-2 cursor-pointer"
                      : "h-2 w-2 bg-white rounded-full mx-2 mb-2 cursor-pointer"
                  }
                  key={index}
                  onClick={() => {
                    this.setCurrentSlide(index);
                  }}
                ></div>
              );
            })}
          </div>

          <AiOutlineRight
            onClick={this.nextSlide}
            className="absolute right-0 text-3xl inset-y-1/2 text-white cursor-pointer" style={{color:"blue"}}
          />
          
        </div>
      </div>
    );
  }
}

export default App;