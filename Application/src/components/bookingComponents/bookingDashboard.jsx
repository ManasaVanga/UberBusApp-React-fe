/* Booking dashboard */
import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert, Container,Table } from 'react-bootstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import CarServiceApi from '../../api/CarServiceApi';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import '../../styles/login.css'

const container = {
    color: "white",
}

class BookingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            errorMessage: '',
            nextBooking: {},
            nextBookingExists: false,
            car: '',
            location: '',
            successHeader: '',
            successMsg: '',
            availablePickup: false,
            avaialbleReturn: false,
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePickupButton = this.handlePickupButton.bind(this);
        this.handleReturnButton = this.handleReturnButton.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        // check for available cars and redirect
        let newSearch = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime
        };
        // publish search all available cars request to backend
        CarServiceApi.searchAvailableCars(newSearch).then(res => {
            // passing available cars to filter car page
            this.props.updateCars(res.data.availableCars, this.state.pickupTime, this.state.returnTime);
            this.props.history.push('/filter');
        }).catch((error) => {
            // display error if there's any
            this.setState({ errorMessage: error.response.data.message });
        });
    };

    handlePickupButton() {
        // change booking status to picked up
        let nextBooking = this.state.nextBooking;
        nextBooking.status = 'Picked up';
        nextBooking.id = nextBooking._id;
        this.setState({
            nextBooking: nextBooking
        });
        // update booking object in database
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successHeader: 'Pickup success!',
                    successMsg: "Car has been picked up! Please return it before your specified return time.",
                    availablePickup: false,
                    avaialbleReturn: true
                });
            });
    }

    mapOnMarkerClick = (props, marker) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });

    mapOnMapClick = () =>
        this.setState({
            showingInfoWindow: false,
            selectedPlace: {},
            activeMarker: {}
        });

    handleReturnButton() {
        // change booking status to returned
        let nextBooking = this.state.nextBooking;
        nextBooking.status = 'Returned';
        nextBooking.id = nextBooking._id;
        this.setState({
            nextBooking: nextBooking
        });
        // update booking object in database
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successHeader: 'Return success!',
                    successMsg: "Car has been returned! Thanks for using MZA Car Share!",
                    avaialbleReturn: false
                })
            })
    }

    componentDidMount() {
        // obtain customer's upcoming booking  with required elements if any
        BookingServiceApi.getNextBooking().then(res => {
            if (Object.keys(res.data).length) {
                // display upcoming booking and show pickup/return button when available
                let currentTime = new Date();
                currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
                this.setState({
                    nextBooking: res.data,
                    nextBookingExists: true,
                    availablePickup: (!(new Date(res.data.pickuptime) > currentTime) && res.data.status === "Confirmed"),
                    avaialbleReturn: res.data.status === "Picked up"
                });
                CarServiceApi.getCar(res.data.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        });
                    });
                LocationServiceApi.getLocationFromId(res.data.location)
                    .then(res => {
                        LocationServiceApi.getGeocodeFromAddress(res.data.address)
                            .then(newRes => {
                                // Create object with address, latitude and longitude
                                let locationObject = {
                                    id: res.data._id,
                                    address: res.data.address,
                                    name: res.data.name,
                                    lat: newRes.data.results[0].geometry.location.lat,
                                    lng: newRes.data.results[0].geometry.location.lng,
                                    cars: res.data.cars
                                };
                                // set new location object to react state array
                                this.setState({
                                    location: locationObject,
                                    isLoading: true
                                });
                            });
                    });
            }
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div>
                {this.state.successMsg &&
                    <Alert variant="success">
                        <Alert.Heading>{this.state.successHeader}</Alert.Heading>
                        <p>
                            {this.state.successMsg}
                        </p>
                    </Alert>
                }
                {this.state.nextBookingExists &&
                <html>
                    <body >
                        <Container>
                        <h2 style={container}>Your upcoming ride: </h2>
                        <Table responsive>
                            <tr style={container}>
                                <th>Booking ID</th>
                                <th>Booking time</th>
                                <th>Pickup time</th>
                                <th>Return time</th>
                                <th>Cost</th>
                                <th>Location</th>
                                {/* <th>Destination</th> */}
                                <th>Address</th>
                                <th>Status</th>
                            </tr>
                            <tr style={container}>
                                <td>{this.state.nextBooking._id}</td>
                                <td>{this.state.nextBooking.bookedtime}</td>
                                <td>{this.state.nextBooking.pickuptime}</td>
                                <td>{this.state.nextBooking.returntime}</td>
                                <td>${this.state.nextBooking.cost}</td>
                                <td>{this.state.location.name}</td>
                                {/* <td>{this.state.destination.name}</td> */}
                                <td>{this.state.location.address}</td>
                                <td>{this.state.nextBooking.status}</td>
                            </tr>
                        </Table>
                            <Button href={`/mybookings/${this.state.nextBooking._id}`}>View Booking</Button>
                        </Container>
                    </body>
                    </html>
                }

                <br/>
                <br/>
                <br/>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error checking availability!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}

                {!this.state.nextBookingExists &&

                <html>
                    <body id="login">
                    <h2 style={container}>Find you a bus!</h2>
                <Form onSubmit={this.handleSubmit} id="availability_form" >
                    <Form.Group as={Row} controlId="formHorizontalFirstName">
                        <Form.Label column sm={2}>
                            Pickup Time
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="pickupTime" type="datetime-local" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalLastName">
                        <Form.Label column sm={2}>
                            Return Time
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="returnTime" type="datetime-local" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Check Availability</Button>
                        </Col>
                    </Form.Group>
                </Form>
                </body>
            </html>
                }
            </div>

        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAF3TYatEpzOshnx4qtfRNuthI3j6GWUms"
})(BookingDashboard);
