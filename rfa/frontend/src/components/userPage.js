import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";
import RnD from "../research-and-development.png";

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSearch: false,
      query: "",
      user: null,
      isFetchingUser: false,
    };
    this.toSearch = this.toSearch.bind(this);
  }

  toSearch(query) {
    this.setState({ toSearch: true, query: query });
  }

  //given a username, get user info from the backend
  async getUser(username) {
    this.setState({ isFetchingUser: true });
    try {
      let response = await axiosInstance.get("user/getByUsername/", {
        params: {
          username: decodeURI(username),
          isSelf: decodeURI("false"),
        },
      });
      console.log(response);
      this.setState({ user: response.data, isFetchingUser: false });
    } catch {
      console.log(error);
      alert("User Not Found!");
    }
  }

  // Create list of components
  generateListOfReadingLists(reading_lists) {
    let readingListItems = reading_lists.map((rl) => (
      <ReadingListPreview key={rl.name} data={rl} />
    ));
    return readingListItems;
  }

  //when the page loads...
  componentDidMount() {
    //get user data
    this.getUser(this.props.match.params.username);
  }

  render() {
    //check if user has an auth token...
    if (axiosInstance.defaults.headers["Authorization"] === null) {
      return <Redirect to="/" />;
    }
    //redirect to search if necessary
    if (this.state.toSearch === true) {
      return (
        <Redirect
          to={{
            pathname: "/search/" + this.state.query + "/",
          }}
        />
      );
    }

    return (
      <div>
        <Navbar toSearch={(query) => this.toSearch(query)} />
        <div className="purpleBox">
          {this.state.isFetchingUser ? <p>Fetching data...</p> : ""}
          {this.state.user ? (
            <div>
              <p> User ID: {this.state.user.id}</p>
              <p>Username: {this.state.user.username}</p>
              <p>
                Name:{" "}
                {this.state.user.first_name + " " + this.state.user.last_name}{" "}
              </p>
              <p>Email: {this.state.user.email} </p>
              <p>Affiliation: {this.state.user.affiliation} </p>
              <p>Position: {this.state.user.position} </p>
            </div>
          ) : (
            ""
          )}
        </div>
        {this.state.user ? (
          <div>
            {this.generateListOfReadingLists(this.state.user.reading_lists)}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

class ReadingListPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toList: false,
      listID: "",
    };
  }

  toList(id) {
    this.setState({ toList: true, listID: id });
  }

  render() {
    if (this.state.toList === true) {
      return (
        <Redirect
          to={{
            pathname: "/readinglist/" + this.state.listID + "/",
          }}
        />
      );
    }

    return (
      <div className="purpleBox">
        <div className="row">
          <div className="column left">
            {/* TODO: Add a small icon before every reading list block. The icon is the RnD image file.*/}
            <img src={RnD} /> 
          </div>
          <div
            className="column middle colorOnHover"
            onClick={() => this.toList(this.props.data.id)}
          >
            <p>{this.props.data.name}</p>
            {/* Put button here to go to ReadingList page */}
            {/* this.props.data has same fields as ReadingList model */}
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
