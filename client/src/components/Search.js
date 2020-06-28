import React from 'react';
import Menu from './Menu';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button } from 'react-bootstrap';
//import getInfo from '../server/visitator';


class Search extends React.Component {

state = {

    cars : null,
    brands: null,
    categories: null,
    menuState : false
   
}

componentDidMount() {

this.props.cars
  .then( cars => this.setState({cars}))
  .catch( err => console.log(err));

this.props.brands
  .then( brands => this.setState({brands}))
  .catch( err => console.log(err));

this.props.categories
  .then( categories => this.setState({categories}))
  .catch( err => console.log(err));  


}

getCars = () => {

if ( this.state.categories != null && this.state.brands != null && this.state.cars != null ){

let cats = this.state.categories.filter( c => !c.state ).map( c => c.value )
let brs = this.state.brands.filter( b => !b.state  ).map(b => b.value )

let selectedCars = [...this.state.cars]


for ( let cat of cats ) 

    selectedCars = selectedCars.filter( c => c.category !== cat ) 


for ( let br of brs )

    selectedCars = selectedCars.filter( b => b.brand !== br )

console.log(selectedCars)

return selectedCars;

 }


return [];
}

setButton2 = (index) => {


    let copy = [...this.state.brands]
    
    copy[index].state = !copy[index].state
     
    this.setState({
        brands : copy
    })
    

}


setButton = (index) => {


let copy = [...this.state.categories]

copy[index].state = !copy[index].state
 
this.setState({
    categories : copy
})

}

getColor2 = (index) => {

    if( this.state.brands[index].state )
        return 'success';
    
    return 'secondary';   
    
    
}

getColor = (index) => {

if( this.state.categories[index].state )
    return 'success';

return 'info';   


}

StateChange = () => {

this.setState({ changeState : !this.state.changeState})

return this.state.changeState;
}


render(){


  return (

    <>

    <h1 className="py-3"> Find the Car of your Dream </h1>

    <div className="py-4">
   
    <h1 className="py-1"> Categories: </h1>

    
    { !this.state.categories  ? null :  
    
    this.state.categories.map( (category,index) => (
    <Button key={index} onClick={ () => this.setButton(index) } variant={this.getColor(index)} className = "btn-lg px-5 mx-4">
     {this.state.categories[index].value} </Button>

    ))}

  </div>

  <h1 className="py-1"> Brands: </h1>

  <div className="py-4">

    { !this.state.brands ? null :
    
    this.state.brands.map( (brand,index) => (
    <Button key={index} onClick={ () => this.setButton2(index) } variant={this.getColor2(index)} className = "btn-lg px-5 my-2 mx-4">
    {this.state.brands[index].value} </Button>
  
    ))}


  </div>

  <Button variant="dark" className="my-3" onClick = {() => 
    this.state.menuState ?  this.setState( {menuState: this.state.menuState}) : this.setState( {menuState: true} )
    } ><h3>Search</h3></Button>


    { this.state.menuState ? 
    <Menu cars = {this.getCars()}
                  /> : null  }
    
    

    </>

  );
}
}

export default Search;

