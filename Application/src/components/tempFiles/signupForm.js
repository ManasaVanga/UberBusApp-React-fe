/* Signup page */
import React, { useState } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import UserServiceApi from '../../api/UserServiceApi.js';
import "../styles/login.css";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBInput } from 'mdbreact';


function SignUpPage() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // handleSubmit = handleSubmit.bind();
    // handleChange = handleChange.bind();

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         firstname: '',
    //         lastname: '',
    //         email: '',
    //         password: '',
    //         errorMessage: ''
    //     };
    //     this.handleSubmit = this.handleSubmit.bind(this);
    //     this.handleChange = this.handleChange.bind(this);
    // }

    /* Set react state for each input when user inputs something on signup form */
    const handleChangeFirstname = event => {
        setFirstname({ firstname: event.target.value });
    }
    const handleChangeLastname = event => {
        setLastname({ lastname: event.target.value });
    }
    const handleChangeEmail = event => {
        setEmail({ email: event.target.value });
    }
    const handleChangePassword = event => {
        setPassword({ password: event.target.value });
    }

    const handleSubmit = event => {
        event.preventDefault();
        /* create new user object */
        let newUser = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email,
            password: password,
            usertype: "customer"
        };
        // input validation
        if (firstname === '') {
            return setFirstname({ errorMessage: "First name can't be empty!" });
        }
        if (lastname === '') {
            return setLastname({ errorMessage: "Last name can't be empty!" });
        }
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(email).toLowerCase())) {
            return setErrorMessage({ errorMessage: "Please enter a valid email!" });
        }
        // publish new user to backend
        UserServiceApi.createNewUser(newUser).then(() => {
            // login user on success
            UserServiceApi.loginUser({ email: email, password: password }).then(res => {
                UserServiceApi.registerSuccessfulLoginForJwt(res.data.token);
                window.location.href = `/`;
            })
        }).catch((error) => {
            setErrorMessage({ errorMessage: error.response.data.message });
        });
    }

    // render() {
        return (
            <html>
            <body id = "login">
            {/* <div className="container">
                {errorMessage && <Alert variant="danger">
                    <Alert.Heading>Sign up failed!</Alert.Heading>
                    <p>
                        {errorMessage}
                    </p>
                </Alert>}
                <Form onSubmit={handleSubmit} id="signup_form" >
                    <Form.Group as={Row} controlId="formHorizontalFirstName">
                        <Form.Label column sm={2}>
                            First Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="firstname" type="firstname" placeholder="First Name" onChange={handleChangeFirstname} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalLastName">
                        <Form.Label column sm={2}>
                            Last Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="lastname" type="lastname" placeholder="Last Name" onChange={handleChangeLastname} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="email" type="email" placeholder="Email" onChange={handleChangeEmail} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>
                            Password
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="password" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters" placeholder="Password" onChange={handleChangePassword} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Create Account</Button>
                        </Col>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <a href="/login">Have an account?</a>
                        </Col>
                    </Form.Group>
                </Form>
                </div> */}
                <MDBContainer>
      <MDBRow>
        <MDBCol md='6'>
          <MDBCard
            className='card-image'
            style={{
              backgroundImage:
                'url(https://mdbcdn.b-cdn.net/img/Photos/Others/pricing-table7.jpg)',
              width: '28rem'
            }}
          >
            <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4'>
              <div className='text-center'>
                <h3 className='white-text mb-5 mt-4 font-weight-bold'>
                  <strong>SIGN</strong>
                  <a href='#!' className='green-text font-weight-bold'>
                    <strong> UP</strong>
                  </a>
                </h3>
              </div>
              <MDBInput
                label='Your email'
                group
                type='text'
                validate
                labelClass='white-text'
              />
              <MDBInput
                label='Your password'
                group
                type='password'
                validate
                labelClass='white-text'
              />
              <div className='md-form pb-3'>
                <MDBInput
                  label={
                    <>
                      Accept the&nbsp;
                      <a href='#!' className='green-text font-weight-bold'>
                        Terms and Conditions
                      </a>
                    </>
                  }
                  type='checkbox'
                  id='checkbox1'
                  labelClass='white-text'
                />
              </div>
              <MDBRow className='d-flex align-items-center mb-4'>
                <div className='text-center mb-3 col-md-12'>
                  <MDBBtn
                    color='success'
                    rounded
                    type='button'
                    className='btn-block z-depth-1'
                  >
                    Sign in
                  </MDBBtn>
                </div>
              </MDBRow>
              <MDBCol md='12'>
                <p className='font-small white-text d-flex justify-content-end'>
                  Have an account?
                  <a href='#!' className='green-text ml-1 font-weight-bold'>
                    Log in
                  </a>
                </p>
              </MDBCol>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>

           
            </body>
            </html>
        );
    // }
}

export default SignUpPage;
