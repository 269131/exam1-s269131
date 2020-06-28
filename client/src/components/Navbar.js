import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar,Form,Button, Col, Badge } from 'react-bootstrap';
//import API from '../api/API'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";


class BarraNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = { username:'',password:'',loggedUser:'',userLogged: false};
}



  logout = () => {

    this.setState({
      username: '',
      password:'',
      userLogged: false
    })
  }

  componentWillReceiveProps(props){
  
    if( !this.state.userLogged )
      this.setState({ username: '', password: ''})

    if( props.userLogged )
      this.setState({ loggedUser : this.state.username})

    if( this.state.userLogged !== props.userLogged )
      this.setState({username: '',password:'',userLogged: !this.state.userLogged})

  }

  
  onSubmitConfirmed = () => {

    if ( this.state.username === '' || this.state.password === '' ){

      window.alert('Fill each forms');
      return;


    }

    this.props.login(this.state.username,this.state.password)
  }

  onChangePw = (e) =>{

        this.setState({
        password: e.target.value
    })

  }

  onChangeUser = (e) =>{

  
        this.setState({
        username: e.target.value
    })
  
  }

  render(){
  return (

<Router>
      <Route>
      {window.location.pathname.includes("/user")  && !this.state.userLogged ?  <Redirect to='/visitator' /> : null } 
      { this.state.userLogged ? <Redirect to='/userRental' /> : null }
      </Route>

    <Navbar bg="dark" variant="dark">

    <Navbar.Brand ><h1><strong>Rental's Company</strong></h1></Navbar.Brand>
    <Form.Row style={{position: 'absolute', right: 0}} >

  {this.state.userLogged ? 

    <>
    <h1> <Badge variant="secondary" className="mr-4">Welcome {this.props.Loggedusername} </Badge> </h1> 
    <Button variant="outline-light" className="mr-4" onClick={() => this.props.logout()}>LogOut</Button>   
    </>
  
  :  

    <>

    <Col sm={4} >

    <Form.Control  placeholder="Username"  
    value={this.state.username}
    onChange={this.onChangeUser}


    />
    </Col>

    <Col sm={4}  >

    <Form.Control
    type="password"
    placeholder="Password"
    value={this.state.password}
    onChange={this.onChangePw}
    />

    </Col>

    <Button onClick={() => this.onSubmitConfirmed(this.state.username,this.state.password)}>Submit</Button>

    </>
    }

    </Form.Row>    
    </Navbar>
    </Router>
  
  );
 }
}

export default BarraNav;

