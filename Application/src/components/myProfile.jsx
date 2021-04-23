/* My profile page for customers */
import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
// import '../styles/myProfile.css'
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

import "../styles/userProfile.css";
import userAvatar from "../assets/userAvatar.png";

const { default: UserServiceApi } = require("../api/UserServiceApi");
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

class MyProfilePage extends Component {
  uppercase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  render() {
    const userData = UserServiceApi.getLoggedInUserDetails();
    return (
      <html>
        <body>
          <MuiThemeProvider muiTheme={ThemeDefault}>
            <div>
              <div style={loginContainer}>
                <Paper style={paper}>
                  <div className="card">
                    <div className="card-body">
                      <div className="avatar">
                        <img src={userAvatar} className="card-img-top" alt="" />
                      </div>
                      <h4 className="card-title">
                        {this.uppercase(userData.firstname) +
                          " " +
                          this.uppercase(userData.lastname)}
                      </h4>
                      {/* <p className="card-text">
                    {data.location.city +
                      ", " +
                      this.uppercase(data.location.state)}
                    <br />
                    <span className="phone">{data.phone}</span>
                  </p> */}

                      <p className="card-text">{userData.email}</p>

                      <p className="text1">Customer ID - {userData.id}</p>
                      <p>
                        <Button href="/mybookings">View My Bookings</Button>
                      </p>
                    </div>
                  </div>

                  {/* <div class="entire">
            <div class="in-entire">
              <div class="left-cov">
                <div class="profile">
                  <div class="human"></div>
                </div>
                <div class="basic">
                  {userData.firstname}
                  <span>{userData.lastname}</span>
                  <span class="ball"></span>
                </div>
              </div>

              <div class="right-cov">
                <div class="detail">
                  <h3>My Profile</h3>
                </div>
                <div class="full-detail">
                  <h4>Email</h4>
                  <p>{userData.email}</p>
                  <h4>Customer ID</h4>
                  <p>{userData.id}</p>
                  <p>
                    <Button href="/mybookings">View My Bookings</Button>
                  </p>
                </div>
              </div>
            </div>
          </div> */}
                </Paper>
              </div>
            </div>
          </MuiThemeProvider>
        </body>
      </html>
    );
  }
}

export default MyProfilePage;
