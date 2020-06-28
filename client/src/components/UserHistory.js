import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Table} from 'react-bootstrap';
import moment from 'moment';


class UserHistory extends React.Component {

state = {

oldRentals: [],
newRentals: [],

}

componentDidMount(){

  this.props.allRentals
  .then( elems => this.setState({oldRentals: [...elems].filter( e => e.BeginDate < moment(new Date()).format('YYYYMMDD')),
                                 newRentals: [...elems].filter( e => e.BeginDate > moment(new Date()).format('YYYYMMDD'))}) ) 
  .catch( err => console.log(err) );

}

askForDelete = (i) => {

  let newArray = []
  let copy = [...this.state.newRentals]
  let deletedElem = this.state.newRentals[i]

  for( let elem of copy) {
    if( deletedElem !== elem )
      newArray.push({IdCar: elem.IdCar,BeginDate: elem.BeginDate,EndDate: elem.EndDate})
  }


  this.props.deleteRent( copy[i].IdCar, copy[i].BeginDate, copy[i].EndDate )


  this.setState({ newRentals: [...newArray]});



}

render(){
 return (

  <div>
    <h1>Old Rentals: </h1>
    
    <Table striped bordered hover>
  <thead>
    <tr>
      <th>ID</th>
      <th>Beginning Date</th>
      <th>End Date</th>
    </tr>
    </thead>
    <tbody>
    {this.state.oldRentals.map( (car,index) => (
        
    <tr key={index}><td>{car.IdCar}</td><td>{[car.BeginDate.slice(0, 4), "-", car.BeginDate.slice(4, 6), "-", car.BeginDate.slice(6, 8)].join('')}</td>
    <td>{[car.EndDate.slice(0, 4), "-", car.EndDate.slice(4, 6), "-", car.EndDate.slice(6, 8)].join('')}</td></tr>

      ))}

    </tbody>
  </Table>

  <h1 className="my-3">Future Rentals: </h1>
    
    <Table striped bordered hover >
  <thead>
    <tr>  
      <th>#</th>
      <th>ID</th>
      <th>Beginning Date</th>
      <th>End Date</th>
    </tr>
    </thead>
    <tbody>
    {this.state.newRentals.map( (car,index) => (
        
    <tr key={index}>
    <td><Button onClick={ () => this.askForDelete(index) } variant="danger">Delete</Button></td><td>
    {car.IdCar}</td><td>{[car.BeginDate.slice(0, 4), "-", car.BeginDate.slice(4, 6), "-", car.BeginDate.slice(6, 8)].join('')}</td>
    <td>{[car.EndDate.slice(0, 4), "-", car.EndDate.slice(4, 6), "-", car.EndDate.slice(6, 8)].join('')}</td></tr>

      ))}

    </tbody>
  </Table >  


  </div>    
   
  ); 
 
 }
}


export default UserHistory;