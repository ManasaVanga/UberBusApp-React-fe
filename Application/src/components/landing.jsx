/* landing page component */
import React, { Component } from 'react';
// import { Button, Container } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import '../styles/landing.css';
// import UserServiceApi from '../api/UserServiceApi';

class LandingPage extends Component {
    render() {
        // const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        // const isUserStaff = UserServiceApi.isUserStaff();
        return (
                <Container id="landing-page" fluid>
                </Container>
        )
    }
}

export default LandingPage;
