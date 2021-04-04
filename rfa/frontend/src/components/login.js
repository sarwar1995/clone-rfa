import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", toUserPage: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toUserPage() {
    this.setState({ toUserPage: true });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/token/obtain/", {
        username: this.state.username,
        password: this.state.password,
      });
      axiosInstance.defaults.headers["Authorization"] =
        "JWT " + response.data.access;
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      this.toUserPage();
      return response;
    } catch (error) {
      throw error;
    }
  }

  render() {
    const redirectToUserPage = this.state.toUserPage;
    if (redirectToUserPage) {
      return (
        <Redirect
          to={{
            pathname: "/user/" + this.state.username + "/",
          }}
        />
      );
    } else {
      return (
        <div className = 'purpleBox'>
          Login
          <form onSubmit={this.handleSubmit}>
            <label>
              Username:
              <input
                name="username"
                type="text"
                value={this.state.username}
                onChange={this.handleChange}
              />
            </label>
            <label>
              Password:
              <input
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <Link to={"/signup/"}>
            <button>Create Account</button>
          </Link>
        </div>
      );
    }
  }
}

export class LoginEmailVerified extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailVerified: false,
      message: "",
    };
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  async verifyEmail() {
    this.setState({ ...this.state, isFetching: true });
    const token = this.props.match.params.token;
    const uidb64 = this.props.match.params.uidb64;
    const base_url = "/user/email-verify/?token=";
    const fetch_url = base_url.concat(token, "&uidb64=", uidb64);
    console.log(fetch_url);

    await axiosInstance
      .get(fetch_url)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.setState({
            emailVerified: true,
            message: response.data.message,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if (error.response.status === 400) {
            this.setState({
              emailVerified: false,
              message: error.response.data.message,
            });
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }

  componentDidMount() {
    //get email verification
    this.verifyEmail();
  }

  render() {
    if (this.state.emailVerified === true) {
      return (
        <div class = "purpleBox">
          <h3>{this.state.message}</h3>
          <Login />
        </div>
      );
    } else {
      return (
        <div>
          <h3>{this.state.message}</h3>
        </div>
      );
    }
  }
}

export default Login;
