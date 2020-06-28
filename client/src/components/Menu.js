import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import Logo from './grey.jpg';

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {cars : props.cars};
}


render(){

 return (

<>

<Carousel>
{this.props.cars.map( (car,index) => (



<Carousel.Item key={index}> 
  <img 
  className="img-responsive center-block"
  src={Logo}
  alt="descripton"
  />
  <Carousel.Caption>
  <h1>{car.model} </h1>
  <h5>{`Category: ${car.category} Brand: ${car.brand}`}</h5>
  </Carousel.Caption>
</Carousel.Item> 


 ))}     

</Carousel>  

</>
  );

 }
}

export default Menu;

