import React from 'react';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import {Form,Col,Container,Row,Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table'



//import API from '../api/API'
//import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";

class UserSearch extends React.Component {

state = {

findedCars: [],
numCarSelected: null,
payment: false,
totalPriece: null,
A: null,
B: null,
C: null,
D: null,
E: null,
selectedCar: null,
availableCars: null,
selectedBDate : null,  
selectedEDate : null,
category : null,
age : null,
km : null,
Driver : false,
Insurance : false,
displayCars : false,
numOfR : null

}

componentDidMount(){



this.props.numofCarsForCat
  .then( el => this.setState({A: el.A, B: el.B, C: el.C, D: el.D, E: el.E}))
   .catch( err => console.log(err) );

this.props.numOfRents
  .then( num => this.setState({numOfR: num.numOfRentals}))
  .catch( err => console.log(err) );
  
}

verifyForms = () => {


  if( this.state.selectedBDate === null || this.state.selectedEDate === null || this.state.category === null
      || this.state.age === null || this.state.km === null ){

      this.setState({ displayCars : false})
      window.alert('Fill each forms');

      return;

      }
      const d1 =  parseInt(moment(this.state.selectedBDate).format('YYYYMMDD'))
      const d2 =  parseInt(moment(this.state.selectedEDate).format('YYYYMMDD'))

        this.props.getFreeCars( d1,d2 , this.state.category  )
        .then( cars => this.setState({ findedCars: [...cars]}))
        .then( () => this.setState({displayCars : true, totalPriece : this.calculateCost()}))
        .catch( err => console.log(err) )

        //this.setState({displayCars : true, totalPriece : this.calculateCost()})


}

calculateCost = () => {


let priece;
let variabile = 1;
let totCars

(new Date()).setDate((new Date()).getDate() + 365)

let d1 = moment(this.state.selectedBDate)
let d2 = moment(this.state.selectedEDate)
let numofDay = d2.diff(d1,'days')

if( this.state.category === 'A' ) {
  priece = 80
  totCars=this.state.A
}
if( this.state.category === 'B' ) {
  priece = 70
  totCars=this.state.B
}
if( this.state.category === 'C' ) {
  priece = 60  
  totCars=this.state.C

}
if( this.state.category === 'D' ) {
  priece = 50
  totCars=this.state.D
}
if( this.state.category === 'E' ) {
  priece = 40
  totCars=this.state.E
}

priece = priece * numofDay

if ( this.state.age.includes("25") )
  variabile = variabile * 1.05


else
  variabile = variabile *1.10


if( this.state.km.includes(" 50") )
  variabile = variabile * 0.95


if( this.state.km.includes("Unlimited") )
  variabile = variabile * 1.05


if( this.state.Driver )
  variabile = variabile * 1.15


if( this.state.Insurance )
  variabile = variabile * 1.20

if( this.state.numOfR >= 3 )
  variabile = variabile * 0.90  

const leftCars = this.state.findedCars.map( c => c.NumOfCars).reduce( (a,b) => a+b, 0)

if( totCars*0.1 < leftCars)
 variabile = variabile *1.10  


return (priece*variabile).toFixed(2);

}
/*
reloadState = (cars) => {

this.setState({ findedCars: [...cars]})
let p = cars.map( c => c.NumOfCars).reduce( (a,b) => a+b, 0)
this.setState({numCarSelected: p})

}
*/
setDriver = (value) => {

  this.setState({ Driver : value})

}

setInsurance = (value) => {

  this.setState({ Insurance : value})
}

render(){


return(

<>



<Row>
<Col md={6}>
<h3>Begin Date: </h3>
  <DatePicker selected={this.state.selectedBDate} onChange={date => this.setState({selectedBDate: date})} 
  dateFormat='yyyy/MM/dd'
  minDate = {new Date()} 
  maxDate = {(new Date()).setDate((new Date()).getDate() + 365)}
  className = "py-2"/>
</Col>

<Col md={4}>
<h3>End Date: </h3>
   <DatePicker     
   selected={this.state.selectedBDate >= this.state.selectedEDate ? null :  this.state.selectedEDate} 
   onChange={date => this.setState({selectedEDate: date})} 
   dateFormat='yyyy/MM/dd'
   minDate = { this.state.selectedBDate === null ? (new Date()).setDate((new Date()).getDate() + 1)  : 
    new Date(this.state.selectedBDate).setDate(new Date(this.state.selectedBDate).getDate()+1 )  }

   maxDate = {(new Date()).setDate((new Date()).getDate() + 365)}
   className = "py-2"/>
</Col>

</Row>

<Container>
    <Form >
    <Row> 
    <Col md={4}>
    <Form.Group as={Col} controlId="form1" className = "py-3">
      <Form.Label ><h3>Category: </h3></Form.Label>
      <Form.Control size="sm" as="select" defaultValue="Categories"
      
      
      onChange={ (event) => event.target.value !== "Select a categories" ? 
      this.setState({ category : event.target.value }) : this.setState({ category : null})}>

        <option>Select a categories</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
        <option>E</option>
      </Form.Control>
    </Form.Group>
    </Col>

    <Col md="auto">
    <Form.Group as={Col} controlId="form2" className = "py-3">
      <Form.Label ><h3>Age:</h3></Form.Label>
      <Form.Control size="sm" as="select" defaultValue="Categories"
      onChange={ (event) => event.target.value !== "Age" ? 
      this.setState({ age : event.target.value }) : this.setState({ age : null})}>
      
        <option>Age</option>
        <option>&lt; 25</option>
        <option>&gt; 65</option>
      </Form.Control>
    </Form.Group>
    </Col>

    <Col md={4}>
    <Form.Group as={Col} controlId="form3" className = "py-3 w-25%">
      <Form.Label ><h3>Km/day:</h3></Form.Label>
      <Form.Control size="sm" as="select" defaultValue="Categories"
      onChange={ (event) => event.target.value !== "estimated number of kilometers" ? 
      this.setState({ km : event.target.value }) : this.setState({ km : null})}>

        <option>estimated number of kilometers</option>
        <option>Less than 50 km/day</option>
        <option>Less than 150 km/day</option>
        <option>Unlimited km/day</option>

      </Form.Control>
    </Form.Group>
    </Col>
    
    </Row>

    <Form.Group controlId="drivers">
  
    <Form.Check type="checkbox" label="Extra Drivers" onChange={ () => this.setDriver(!this.state.Driver)}/>
  
    </Form.Group>

    <Form.Group controlId="insurance">
    <Form.Check type="checkbox" label="Extra Insucrance" onChange={ () => this.setInsurance(!this.state.Insurance)}/>

    </Form.Group>


    </Form>
    </Container>

    <Button variant="dark" className="my-3" onClick = {() => this.verifyForms()} ><h3>Search</h3></Button>

    
    <div>  
    {!this.state.displayCars &&  this.state.findedCars.length === 0 ? null :
    <React.Fragment>
    <Table responsive="sm" className = "py-3"> 
    <thead>
    <tr> 
    <th>Price</th><th>Model</th><th>Brand</th><th>Num of Cars</th></tr>
    </thead>
    <tbody>

    {this.state.findedCars.map( (car,index) => ( 

    <tr key={index}><td>{this.state.totalPriece}</td><td>{car.Model}</td><td>{car.Brand}</td><td>{car.NumOfCars}</td></tr>

    )) 
    
    }</tbody>
     </Table> 
    
    <Row><Col md={4}>
    <Form.Group as={Col} controlId="formForBuy" className = "py-3 w-25%">
    <Form.Label ><h3>Select a Car:</h3></Form.Label>
    <Form.Control size="sm" as="select" defaultValue="Categories"
    onChange={ (event) => event.target.value !== "Cars" ? 
    this.setState({ selectedCar : event.target.value }) : this.setState({ selectedCar : null})}>

    <option>Cars</option>
    {this.state.findedCars.map( (car,index) => ( 

    <option key={index}>{car.Model}</option>

    ))} 


    </Form.Control>
    </Form.Group> 
    </Col>
    
    <Col md={3}>  
    
    
    </Col>

    </Row>
      
      <Button variant="primary" className="my-5 py-2 px-3"
      onClick={ () => this.state.selectedCar === null ? window.alert('Select one car') :
       this.props.displayPayment( moment(this.state.selectedBDate).format('YYYY-MM-DD'), 
        moment(this.state.selectedEDate).format('YYYY-MM-DD'), this.state.selectedCar,this.state.totalPriece)} >  

      <h3>Confirm</h3>
      </Button>
      

    </React.Fragment> }

    </div> 

</>

);}


}

export default UserSearch;