import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, FormControl, Row, Col, Card,Table, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker'


class Payment extends React.Component {

  state = {

    cvv: null,
    name: null,
    creditCard: null,
    selectedDate: null

  }

verifyPayment = () => {


let operation = this.props.verifyPay(this.state.name,this.state.creditCard,this.state.cvv,this.state.selectedDate)

if(!operation)
  this.setState({ cvv : null, name: null, creditCard: null, selectedDate: null})

}


render(){

 return (

<div>
<h2><strong>Rental Information:</strong></h2>

<Table striped bordered hover>
  <thead>
    <tr>
      <th>Beginning Date</th>
      <th>End Date</th>
      <th>Model</th>
      <th>Price</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td> {this.props.bd}</td>
      <td>{this.props.ed}</td>
      <td> {this.props.md}</td>
      <td> {this.props.pr}</td>
    </tr>
    </tbody>
  </Table>

<Card style={{ width: '36rem' }} className="px-3 mx-3">
  <Card.Body>
<InputGroup className="mb-3" onChange={e => this.setState({name : e.target.value}) }>
  <InputGroup.Prepend>
    <InputGroup.Text>Full Name</InputGroup.Text>
  </InputGroup.Prepend>
  <FormControl />
</InputGroup>

<InputGroup className="mb-3" onChange={e => this.setState({creditCard : e.target.value}) }>
  <InputGroup.Prepend>
    <InputGroup.Text>Credit Card Number</InputGroup.Text>
  </InputGroup.Prepend>
  <FormControl />
</InputGroup>

<Row>
<Col>
<h4><strong>Expiration Date</strong></h4>

<DatePicker selected={this.state.selectedDate} onChange={date => this.setState({selectedDate: date})} 
  dateFormat='yyyy/MM/dd'
  minDate = {(new Date()).setDate((new Date()).getDate() + 1)}
  className = "py-2"/>
</Col>

<InputGroup className="mb-3 py-2" onChange={e => this.setState({cvv: e.target.value}) }>
  <InputGroup.Prepend>
    <InputGroup.Text>cvv</InputGroup.Text>
  </InputGroup.Prepend>
  <FormControl />
</InputGroup>

</Row>
<Button variant="dark" className="my-1" onClick={ () => this.verifyPayment()} >Confirm</Button>

</Card.Body></Card>
</div>
  );

 }
}

export default Payment;

