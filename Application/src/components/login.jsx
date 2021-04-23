/* login page */
import React, { Component } from "react";
import { Form, Col, Button, Row, Alert } from "react-bootstrap";
import UserServiceApi from "../api/UserServiceApi.js";
import "../styles/login.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Checkbox from "material-ui/Checkbox";
import { grey500, white } from "material-ui/styles/colors";
import PersonAdd from "material-ui/svg-icons/social/person-add";
import Help from "material-ui/svg-icons/action/help";
import TextField from "material-ui/TextField";
import { Link } from "react-router-dom";
import ThemeDefault from "./theme-default";
import Login from '../assets/login.gif';

const loginContainer = {
  minWidth: "320px",
  maxWidth: 400,
  height: "auto",
  position: "absolute",
  top: "20%",
  left: 0,
  right: 0,
  margin: "auto",
};
const paper = {
  padding: 20,
  overflow: "auto",
};
const buttonsDiv = {
  textAlign: "center",
  padding: 5,
};
const flatButton = {
  color: "grey",
};
const checkRemember = {
  style: {
    float: "left",
    maxWidth: 180,
    paddingTop: 5,
  },
  labelStyle: {
    color: "grey",
  },
  iconStyle: {
    color: "grey",
    borderColor: "grey",
    fill: "grey",
  },
};
const loginBtn = {
  float: "right",
};
const btn = {
  background: "#4f81e9",
  color: "white",
  padding: 7,
  borderRadius: 2,
  margin: 2,
  fontSize: 13,
};
const btnFacebook = {
  background: "#4f81e9",
};
const btnGoogle = {
  background: "#e14441",
};
const btnSpan = {
  marginLeft: 5,
};
const font = {
    fontWeight: 'bold',
}
const image = {
  maxWidth: 350,
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /* Set react state for each input when user inputs something on login form */
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    // login button handler
    event.preventDefault();
    let creds = {
      email: this.state.email,
      password: this.state.password,
    };
    // email validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(this.state.email).toLowerCase())) {
      return this.setState({ errorMessage: "Please enter a valid email!" });
    }
    // publish login details to backend
    UserServiceApi.loginUser(creds)
      .then((res) => {
        UserServiceApi.registerSuccessfulLoginForJwt(res.data.token);
        window.location.href = `/`;
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });
  };

  render() {
    return (
      <html>
        <body id="login">
          <MuiThemeProvider muiTheme={ThemeDefault}>
            <div>
              <div style={loginContainer}>
                <Paper style={paper}>
                <img style={image} src={Login}/>
                  <div className="container">
                    {this.state.errorMessage && (
                      <Alert variant="danger">
                        <Alert.Heading>Login failed!</Alert.Heading>
                        <p>{this.state.errorMessage}</p>
                      </Alert>
                    )}
                    <Form
                      onSubmit={this.handleSubmit}
                      id="login_form"
                      className="center"
                    >
                        <h4 className={font}>Sign in</h4>
                      <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>
                          Email
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={this.handleChange}
                            required
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>
                          Password
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            name="password"
                            type="password"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters"
                            placeholder="Password"
                            onChange={this.handleChange}
                            required
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                          <Button type="submit">Login</Button>
                        </Col>
                      </Form.Group>
                    </Form>
                  </div>
                  <div style={buttonsDiv}>
                    Don't have an account?
                    <FlatButton
                      label="Register"
                      href="/signup"
                      style={flatButton}
                      icon={<PersonAdd />}
                    />
                    {/* <FlatButton
                    label="Forgot Password?"
                    href="/"
                    style={flatButton}
                    icon={<Help />}
                  /> */}
                  </div>
                </Paper>
              </div>
            </div>
          </MuiThemeProvider>
        </body>
      </html>
    );
  }
}

export default LoginPage;
