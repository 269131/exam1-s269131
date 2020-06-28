import React from 'react';
import './App.css';
import BarraNav from './components/Navbar';
import Search from './components/Search';
import {Nav} from 'react-bootstrap';
import UserSearch from './components/UserSearch'
import UserHistory from './components/UserHistory'
import API from './api/API';
import 'bootstrap/dist/css/bootstrap.min.css';
import Payment from './components/Payment'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";



class App extends React.Component {

state = {

  bdate: null,
  edate: null,
  pr: null,
  mod: null,
  numberOfRentals: '',
  Loggedusername: '',
  userLogged: false,
  payment:false,
  path: true

}

deleteUserRental = async (idcar,startingDay, endDay) => {

const result = await API.deleteRental(idcar,this.state.Loggedusername,startingDay, endDay)


return result;  
}

getUserHistory = async () => {

const rentals = await API.askForUserRentals(this.state.Loggedusername);
  
return rentals;
}


displayPayment = (beginDate,endDate,model,price) =>{

if( beginDate === null || endDate === null || price === null || model === null ){
  
  window.alert('Fill each forms');
  return;
}
  
this.setState({payment:true, bdate : beginDate, edate : endDate, pr : price, mod : model})



}

getCarsAvailable = async (startingDay, endDay, category ) => {

const availableCars = await API.askForFreeCars(startingDay, endDay, category )

return availableCars;

}

verifyPayment = (name, credicard, cvv,date) => {

if ( !API.verifyPayment(name, credicard, cvv,date)){
  window.alert('Fill forms with correct information');
  return false;
}

this.setState({payment: false})
window.alert('Payment was successfully made, you correctly book the car')


this.insertRental()

return true;
}


insertRental = async () => {

API.askForIdCar( this.state.bdate.split("-").join(""), this.state.edate.split("-").join(""), this.state.mod)
.then( c => API.makeRental( this.state.Loggedusername, c,  
  this.state.bdate.split("-").join(""), this.state.edate.split("-").join("") )) 

}


logout = () => {

  API.userLogout().then(() => {

    this.setState({userLogged: false, payment: false, Loggedusername:''});
  }).catch((errorObj)=>{this.handleErrors(errorObj)});;

}

getNumOfRentals = async () => {

  const num = await API.askForNumOfRentals(this.state.Loggedusername)

  return num;
  }

login(username,password){

  API.userLogin(username, password).then(
    (user) => { 
      this.setState({userLogged:true, Loggedusername: user.username})

    }
  ).catch(
    (errorObj) => {
      console.log(errorObj.errors[0]);
      this.setState({ userLogged: this.state.userLogged})
      window.alert('Username and/or Password are not correct');

    }
  );

  
}

getCarsForCCategory = async () => {

  const crs = await API.askForCarforC()              
  
return crs;
}

  
getCars = async () => {

  let crsObj = [];
  const crs = await API.askForCars()              

  

  for (let cr of crs)
    crsObj.push({ model : cr.Model , category : cr.Category , brand : cr.Brand})
  
  return crsObj;

  };


getBrands = async () => {

let brsObj = [];
const brs = await API.askForBrands()              

for (let br of brs)
  brsObj.push({ value : br , state : false })


return brsObj;
};


getCategories = async () => {

let catsObj = [];
const cats = await API.askForCategories();


for (let cat of cats)
  catsObj.push({ value : cat , state: false })


return catsObj;
};


render() {


return (

    <Router>
    <div className="App">

    <Route>
    { !this.state.payment ? null :
    <Redirect to='/userPayment' /> } </Route>    


      <Route>
      { window.location.pathname.includes('/user') && !this.state.userLogged ? null :  <Redirect to='/visitator' /> } 
     
      </Route>
        

      <BarraNav Loggedusername = {this.state.Loggedusername} userLogged={this.state.userLogged} 
      login={this.login.bind(this)} logout={this.logout.bind(this)}/>

      { this.state.userLogged && !this.state.payment ? 
      
      <>
      <Nav variant="tabs" defaultActiveKey="rental">
      <Nav.Item>
      <Nav.Link eventKey="rental" onClick = { () => this.setState({path:true})}>Rental</Nav.Link>
      </Nav.Item>
      <Nav.Item>
      <Nav.Link eventKey="history"  onClick = { () => this.setState({path:false})}>History</Nav.Link>
      </Nav.Item>
      </Nav>
    


    {this.state.path ? <Route><Redirect to='/userRental'/></Route> : <Route><Redirect to='/userHistory'/></Route> }

    
    {} 
    

    { this.state.path ?
     <UserSearch numOfRents={this.getNumOfRentals()} getFreeCars={this.getCarsAvailable.bind(this)}
      numofCarsForCat={this.getCarsForCCategory()} displayPayment={this.displayPayment.bind(this)}/> 
    : <UserHistory allRentals={this.getUserHistory()} deleteRent={this.deleteUserRental.bind(this)} />} 
      
     
      </>
      :
      !this.state.payment && !this.state.userLogged &&
      <Search categories={this.getCategories()} brands={this.getBrands()} cars={this.getCars()}/>
      }
      
    </div>

    { !this.state.payment ? null : 
    <Payment bd={this.state.bdate} ed={this.state.edate} md={this.state.mod} pr={this.state.pr} 
             verifyPay={this.verifyPayment.bind(this)}/>}  

    </Router>
  ); 
 }
}

export default App;

