/* landing page component */
import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import UserServiceApi from '../api/UserServiceApi';

class LandingPage extends Component {
    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        const isUserStaff = UserServiceApi.isUserStaff();
        return (
                <Container id="landing-page" fluid>
                    <div >
                        <h1 >Uber Bus</h1>

                        {(isUserLoggedIn && !isUserStaff) &&
                            <>
                                <Link to="/dashboard">
                                    <Button variant="warning" style={{ fontSize: '2vh' }}>Dashboard</Button>
                                </Link>
                            </>
                        }
                        {(isUserLoggedIn && isUserStaff) &&
                            <>
                                <Link to="/staff">
                                    <Button variant="warning" style={{ fontSize: '2vh' }}>Manage System</Button>
                                </Link>
                            </>
                        }
                        {!isUserLoggedIn &&
                            <>
                                <Link to="/signup">
                                    <Button variant="warning" style={{ fontSize: '2vh' }}>Sign Up Now</Button>
                                </Link>
                            </>
                        }
                    </div>
                </Container>
        )
    }
}

export default LandingPage;
