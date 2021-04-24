/* Bookings details page */
import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Alert, Button, Col ,Container, Table} from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import "../../App.css"

const container = {
    color: "white",
}

class BookingDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            destination: {},
            booking: {},
            car: {},
            errorMessage: '',
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        };
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.getBookingDetails = this.getBookingDetails.bind(this);
        this.checkBookingPast = this.checkBookingPast.bind(this);
    }

    getBookingDetails() {
        // obtain a user's booking by booking id and also car and location associated
        BookingServiceApi.getUserBooking(this.props.match.params.id)
            .then(res => {
                this.setState({
                    booking: res.data.booking
                });
                CarServiceApi.getCar(this.state.booking.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        })
                    });
                LocationServiceApi.getLocationFromId(this.state.booking.location)
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
                LocationServiceApi.getLocationFromId(this.state.booking.destination)
                    .then(res => {
                        LocationServiceApi.getGeocodeFromAddress(res.data.address)
                            .then(newRes => {
                                let destinationObject = {
                                    id: res.data._id,
                                    address: res.data.name,
                                    name: res.data.name,
                                    lat: newRes.data.results[0].geometry.location.lat,
                                    lng: newRes.data.results[0].geometry.location.lng,
                                    cars: res.data.cars
                                };

                                this.setState({
                                    destination: destinationObject,
                                    isLoading: true
                                });
                            });
                    })
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
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

    componentDidMount() {
        this.getBookingDetails();
    }

    handleCancelButton() {
        // modify booking status to cancelled
        let booking = this.state.booking;
        booking.status = 'Cancelled';
        booking.id = booking._id;
        this.setState({
            booking: booking
        });
        BookingServiceApi.modifyBooking(this.state.booking)
            .then(() => {
                this.getBookingDetails()
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    checkBookingPast(pickupTime) {
        // check if booking pickup time has past current time
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
        return new Date(pickupTime) > currentTime;
    }

    render() {
        return (
            <html>
                <body >
            <div className="container">
                <h2 style={container}>Booking details</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading style={container}>Error obtaining booking!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                {!this.state.errorMessage &&
                    <>
                        <Container>

                        <Table bordered responsive="sm" style={container}>

                        <thead>
                        <tr>
                                <th>Booking ID</th>
                                <th>Booking time</th>
                                <th>Pickup time</th>
                                <th>Return time</th>
                                <th>Cost</th>
                                <th>Location</th>
                                <th>Destination</th>
                                <th>Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                                <td>{this.state.booking._id}</td>
                                <td>{this.state.booking.bookedtime}</td>
                                <td>{this.state.booking.pickuptime}</td>
                                <td>{this.state.booking.returntime}</td>
                                <td>${this.state.booking.cost}</td>
                                <td>{this.state.location.name}</td>
                                <td>{this.state.destination.name}</td>
                                <td>{this.state.location.address}</td>
                                <td>{this.state.booking.status}</td>
                            </tr>
                        </tbody>
                        </Table>
                        </Container>
                        {(this.state.booking.status === "Confirmed" && this.checkBookingPast(this.state.booking.pickuptime)) &&
                            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                        }
                        <Col lg={true} sm={4}>
                            <div className="cars-div-white" style={{ 'border': 'solid black 2px', 'color':'white' }}>
                                <img src={this.state.car.image} alt="car" width="100" />
                                <h2 style={{ marginTop: '1vh' }}>{this.state.car.make}</h2>
                                <p>{this.state.car.fueltype}, {this.state.car.bodytype}, {this.state.car.seats} seaters, {this.state.car.colour}</p>
                                <h5>Number Plate: {this.state.car.numberplate}</h5>
                                <p><b>Bus ID: </b>{this.state.car._id}</p>
                            </div>
                        </Col>
                    </>
                }
            </div>
                
            </body>
            </html>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAF3TYatEpzOshnx4qtfRNuthI3j6GWUms"
})(BookingDetailsPage);
