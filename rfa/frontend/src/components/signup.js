import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      affiliation: "",
      position: "",
      username: "",
      email: "",
      password: "",
      errors: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayAlert = this.displayAlert.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  //('first_name', 'last_name', 'affiliation', 'position', 'email', 'username', 'password')
  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/user/create/", {
        first_name: this.state.firstname,
        last_name: this.state.lastname,
        affiliation: this.state.affiliation,
        position: this.state.position,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      });
      this.displayAlert();
      return response;
    } catch (error) {
      console.log(error.stack);
      this.setState({
        errors: error.response.data,
      });
    }
  }

  displayAlert() {
    this.render();
    {
      return (
        <h1>
          Hi! {this.state.username}. A verification email is sent to your email
          ({this.state.email}). Follow the link therein to verify and login.
        </h1>
      );
    }
  }

  render() {
    return (
      <div className="whitePage loginPage">
        <form onSubmit={this.handleSubmit} className="login">
          <div className="form-group">
            <label for="firstname">First Name</label>
            <input
              name="firstname"
              id="firstname"
              type="text"
              class="form-control"
              value={this.state.firstname}
              onChange={this.handleChange}
              placeholder="First name"
            />
            {this.state.errors.firstname ? this.state.errors.firstname : null}
          </div>
          <div className="form-group">
            <label for="lastname">Last Name</label>
            <input
              name="lastname"
              id="lastname"
              type="text"
              class="form-control"
              value={this.state.lastname}
              onChange={this.handleChange}
              placeholder="Last name"
            />
            {this.state.errors.lastname ? this.state.errors.lastname : null}
          </div>
          <div className="form-group">
            <label for="affiliation">Affiliation</label>
            <input
              name="affiliation"
              id="affiliation"
              type="text"
              class="form-control"
              value={this.state.affiliation}
              onChange={this.handleChange}
              placeholder="Name of university, national lab, company, etc."
            />
            {this.state.errors.affiliation ? this.state.errors.affiliation : null}
          </div>
          <div className="form-group">
            <label for="username">Username</label>
            <input
              name="username"
              id="username"
              type="text"
              class="form-control"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder="Username"
            />
            {this.state.errors.username ? this.state.errors.username : null}
          </div>
          <div className="form-group">
            <label for="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              class="form-control"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Email address"
            />
            {this.state.errors.email ? this.state.errors.email : null}
          </div>
          <div className="form-group">
            <label for="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              class="form-control"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Password"
            />
            {this.state.errors.password ? this.state.errors.password : null}
          </div>
          <input type="submit" value="Create Account" />
          <Link to={"/login/"}>
            <button>Back to Login</button>
          </Link>
        </form>
      </div>
    );
  }
}
export default Signup;
