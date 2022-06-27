import React, { useState, useEffect } from 'react';
import { Component } from 'react';
import { Carousel } from '@sefailyasoz/react-carousel'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
const CarouselData = [
  {
    headerText: null,
    subText: 'Sub Text One',
    image: 'https://picsum.photos/300/300',
  },
  {
    headerText: 'Header Text Two',
    subText: null,
    image: 'https://picsum.photos/1200/800',
  },
  {
    headerText: null,
    subText: null,
    image: 'https://picsum.photos/720/720',
  },
  {
    headerText: 'Header Text Four',
    subText: 'Sub Text Four',
    image: 'https://picsum.photos/1920/1080',
  },
  {
    headerText: 'Header Text Five',
    subText: 'Sub Text Five',
    image: 'https://picsum.photos/480/360',
  },
]
class App extends Component {
 

  componentWillUpdate() {

  const response =  fetch(`https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${this.state.term}&image_type=photo&pretty=true`)
  .then(res =>{ res.json()    
    if(res)
   { this.setState({term:true})
     this.setState({term:true}) };
    })
  .then(data => {
    this.setState({images:data.hits});
    this.setState({term:false});
  })
  .catch(err => console.log(err));
  }

  constructor(props){
    super(props);
    this.state = {
      images: [],
      isLoading: true,
      contract2:null,
      term:'',
    };
  }

  // async componentDidMount () {
  //   const response =  fetch(`https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${this.state.term}&image_type=photo&pretty=true`)
  //     .then(res =>{ res.json()    
  //       if(res)
  //       this.setState({term:true});})
  //     .then(data => {
  //       this.setState({images:data.hits});
  //       this.setState({term:false});
  //     })
  //     .catch(err => console.log(err));

  // }

  render() {

    
  return (
      
    <div className="container mx-auto">
      {/* <ImageSearch searchText={(text) => this.setState({term:text})} />

      {!this.state.isLoading && this.state.images.length === 0 && <h1 className="text-5xl text-center mx-auto mt-32">No Images Found</h1> }

      {this.state.isLoading ? <h1 className="text-6xl text-center mx-auto mt-32">Loading...</h1> : <div className="grid grid-cols-3 gap-4">
        {this.state.images.map(image => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>} */}
      <Carousel
              data={CarouselData}
              autoPlay={true}
              rightItem={<FaArrowRight />}
              leftItem={<FaArrowLeft />}
              animationDuration={3000}
              headerTextType="black"
              subTextType="white"
              size="normal"
            />
    </div>

    
  );
  }

}
export default App;