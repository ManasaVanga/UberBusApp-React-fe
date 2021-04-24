/* Filter cars page */
import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert, Table, Container } from 'react-bootstrap';
import CarServiceApi from '../../api/CarServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_SEATS, CAR_FUEL_TYPES } from '../../Constants.js';
import LocationServiceApi from '../../api/LocationServiceApi';
import BookingConfirmDetailsPopUp from './bookingConfirmDetails';
import { useHistory } from 'react-router-dom';

const container = {
    color: "white",
}
const container1={
    color:"orange",
}
class FilterCarsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            availableCars: [],
            make: '',
            seats: 'Any',
            fueltype: 'Any',
            colour: 'Any',
            location: 'Any',
            bodytype: 'Any',
            locations: [],
            errorMessage: '',
            popUp: false,
            selectedCar: '',
        };
        this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.confirmBooking = this.confirmBooking.bind(this);
        this.togglePopUp = this.togglePopUp.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmitFilter = event => {
        event.preventDefault();
        // filter available cars based on attributes specified
        let newFilter = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime,
            availableCars: this.state.availableCars,
            make: this.state.make,
            seats: this.state.seats,
            fueltype: this.state.fueltype,
            colour: this.state.colour,
            location: this.state.location,
            bodytype: this.state.bodytype
        };
        // publish filter cars request to backend
        CarServiceApi.filterCars(newFilter).then(res => {
            this.setState({
                availableCars: res.data.availableCars,
                errorMessage: ''
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message, availableCars: [] });
        });
    }

    togglePopUp(car) {
        if (this.state.popUp)
            car = null;
        this.setState({
            popUp: !this.state.popUp,
            selectedCar: car
        });
    }

    confirmBooking(car){
        this.props.history.push({
            pathname: '/confirmBooking',
            state: {
                car: car, 
                locations: this.state.locations,
                pickupTime: this.state.pickupTime,
                returnTime: this.state.returnTime,
            }
        });       
    };

    componentDidMount() {
        const { availableCars, pickupTime, returnTime } = this.props;

        // redirect to dashboard if props don't exist
        if (availableCars.length === 0 || pickupTime === '' || returnTime === '') {
            this.props.history.push('/dashboard');
        }

        this.setState({
            availableCars: availableCars,
            pickupTime: pickupTime,
            returnTime: returnTime
        });

        // obtain all locations
        let locationArray = this.state.locations;
        LocationServiceApi.getAllLocations().then(res => {
            res.data.forEach(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address,
                    name: location.name
                }
                locationArray.push(locationObject);
                this.setState({ locations: locationArray });
            });
        });
    }

    render() {
        return (

            <Container style={container}>
                {this.state.popUp && <BookingConfirmDetailsPopUp locations={this.state.locations} car={this.state.selectedCar} pickupTime={this.state.pickupTime} returnTime={this.state.returnTime} togglePopUp={this.togglePopUp} />}
                <h2>Search for a car</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error filtering cars!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <Form onSubmit={this.handleSubmitFilter} id="filter_form" >

                    <Form.Group controlId="exampleForm.ControlSelect2" responsive>
                        <Form.Label>Location</Form.Label>
                        <Form.Control name="location" as="select" onChange={this.handleChange}>
                            <option>Any</option>
                            {this.state.locations.map(location =>
                                <>
                                    <option value={location.id}>{location.name + " @ " + location.address}</option>
                                </>
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col >
                            <Button type="submit">Filter Buses</Button>
                        </Col>
                    </Form.Group>
                </Form>


                <h2>Available Cars from {this.state.pickupTime} till {this.state.returnTime}</h2>
                <Table bordered responsive style={container1}>
                    <thead>
                        <tr>
                            <th>Make</th>
                            <th>Seats</th>
                            <th>Body Type</th>
                            <th>Colour</th>
                            <th>Cost per hour</th>
                            <th>Fuel Type</th>
                            <th>Location</th>
                            <th>Address</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.availableCars.map(car =>
                            <tr>
                                <td>{car.make}</td>
                                <td>{car.seats}</td>
                                <td>{car.bodytype}</td>
                                <td>{car.colour}</td>
                                <td>${car.costperhour}</td>
                                <td>{car.fueltype}</td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <>
                                            {location.id === car.location &&
                                                <>
                                                    {location.name}
                                                </>
                                            }
                                        </>
                                    )}
                                </td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <>
                                            {location.id === car.location &&
                                                <>
                                                    {location.address}
                                                </>
                                            }
                                        </>
                                    )}
                                </td>
                                <td>
                                    <Button onClick={() => this.confirmBooking(car)}>Book</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        )
    }
}

export default FilterCarsPage;
