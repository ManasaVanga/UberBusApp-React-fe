/* Bookings confirm details page */
import React, { Component } from 'react';
import { Form, Col, Button, Alert, Container } from 'react-bootstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import BookingServiceApi from '../../api/BookingServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import '../../styles/cars.css';

class BookingConfirmDetailsPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            location: {},
            destination: '',
            destinations: [],
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false,
            locations: this.props.location.state.locations,
            car: this.props.location.state.car,
            pickupTime: this.props.location.state.pickupTime,
            returnTime: this.props.location.state.returnTime,
        };
        this.handleConfirmButton = this.handleConfirmButton.bind(this);
        this.handleCancelButton = this.handleCancelButton.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleConfirmButton = event => {
        // prevent browser from refreshing on click
        event.preventDefault();
        // generate new booking object

        console.log(this.state.destination);

        let newBooking = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime,
            user: UserServiceApi.getLoggedInUserID(),
            car: this.state.car._id,
            destination: this.state.destination,
            location: this.state.car.location,
        };

        console.log(newBooking);

        // publish create booking request to backend
        BookingServiceApi.createBooking(newBooking)
            .then(res => {
                // redirect to booking details page on success
                window.location.href = `/mybookings/${res.data.response.booking._id}`;
            })
            .catch((error) => {
                // display error message on failure
                this.setState({ errorMessage: error.response.data.message });
            })
    };

    handleCancelButton = event => {
        // prevent browser from refreshing on click
        // event.preventDefault();
        // this.props.togglePopUp();
        window.location.href = `/dashboard`;
    };

    componentDidMount() {
        const  car  = this.state.car;

        // obtain location from id
        LocationServiceApi.getLocationFromId(car.location)
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
                        }
                        // set new location object to react state array
                        this.setState({
                            location: locationObject,
                            isLoading: true
                        })
                    });
            });

        // obtain all destinations
        let destinationArray = this.state.destinations;
        let defaultDestination = this.state.destination;
        LocationServiceApi.getAllLocations().then(res => {
            res.data.forEach(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address,
                    name: location.name
                }
                destinationArray.push(locationObject);
            });
            defaultDestination = destinationArray[0].id;
            this.setState({ destination: defaultDestination });
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

    calculateBookingCost() {
        // cost calculation based on pickup time and return time difference
        const pickupTimeHours = new Date(this.state.pickupTime);
        const returnTimeHours = new Date(this.state.returnTime);
        const timeDeltaHours = new Date(returnTimeHours - pickupTimeHours).getTime() / 3600;

        const cost = parseInt(this.state.car.costperhour) * (timeDeltaHours / 1000);

        // const cost = parseInt(this.props.car.costperhour) * (timeDeltaHours / 1000);
        return cost.toFixed(2);
    }

    render() {
        // const {pickupTime, returnTime } = this.props;
        const car = this.state.car;
        const locations = this.state.locations;
        const pickupTime = this.state.pickupTime;
        const returnTime = this.state.returnTime;

        const cost = this.calculateBookingCost();

        return (
        <html>
            <body>
        <div className="container">
            {this.state.errorMessage && <Alert variant="danger">
                <Alert.Heading>Booking failed!</Alert.Heading>
                <p>
                    {this.state.errorMessage}
                </p>
            </Alert>}
            <Form responsive>
            <h2>Confirm Booking?</h2>
            <b>Pickup time: </b> {pickupTime} <br></br>
            <b>Return time: </b> {returnTime} <br></br>
            <b>Cost: </b> ${cost} <br></br>
            <b>Location: </b> {locations.map(location =>
                <>
                    {location.id === car.location &&
                        <>
                            {location.name}
                        </>
                    }
                </>
            )} <br></br>
            <b>Address: </b> {locations.map(location =>
                <>
                    {location.id === car.location &&
                        <>
                            {location.address}
                        </>
                    }
                </>
            )} <br></br>
            <Col sm={4}>
                <div className="cars-div-white">
                    <img src={car.image} alt="car" width="100" />
                    <h2 style={{ marginTop: '1vh' }}>{car.make}</h2>
                    <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                    <h5>${car.costperhour} per hour</h5>
                    <a href={"/locations/" + car.location}><strong>Garage Location:</strong> {car.location}</a>
                </div>
            </Col>

            <Container>
                <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control name="destination" as="select" onChange={this.handleChange}>

                        {this.state.destinations.map(destination =>
                            <>
                                <option value={destination.id} defaultValue={destination.id}>{destination.name + " @ " + destination.address}</option>
                            </>
                        )}
                    </Form.Control>
                </Form.Group>
            </Container>
            <Button variant="success" onClick={this.handleConfirmButton}>Confirm</Button>
            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
            </Form>
        </div>
        </body>
        </html>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAF3TYatEpzOshnx4qtfRNuthI3j6GWUms"
})(BookingConfirmDetailsPopUp);
