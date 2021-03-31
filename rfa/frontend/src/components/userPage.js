import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toSearch: false,
            query: '',
            user: null,
            isFetchingUser: false,
        };
        this.toSearch = this.toSearch.bind(this);
    }


    toSearch(query) {
        this.setState({ toSearch: true, query: query });
    }

    //given a username, get user info from the backend
    async getUser(username){
        this.setState({isFetchingUser: true});
        try{
            let response = await axiosInstance.get('user/getByUsername/', {
                params: {
                    username: decodeURI(username)
                }
            });
            console.log(response);
            this.setState({ user: response.data, isFetchingUser: false })
        }
        catch{
            console.log(error);
            alert("User Not Found!");
        }
    }

    //when the page loads...
    componentDidMount() {
        //get user data
        this.getUser(this.props.match.params.username);
    }

    render() {
        //check if user has an auth token...
        if (axiosInstance.defaults.headers['Authorization'] === null) {
            return <Redirect to='/' />
        }
        //redirect to search if necessary
        if (this.state.toSearch === true) {
            return <Redirect to={{
                pathname: "/search/" + this.state.query + "/",
            }} />
        }

        return (
            <div>
                <Navbar toSearch={(query) => this.toSearch(query)} />
                <div className="purpleBox">
                    {this.state.isFetchingUser ? <p>Fetching data...</p> : ""}
                    {this.state.user ? <div>
                        <p> User ID: {this.state.user.id}</p> 
                        <p>Username: {this.state.user.username}</p> 
                        <p>Name: {this.state.user.first_name + " " + this.state.user.last_name} </p>
                        <p>Email: {this.state.user.email} </p> 
                        <p>Affiliation: {this.state.user.affiliation} </p>
                        <p>Position: {this.state.user.position} </p>
                        </div> : ""}
                </div>
                <div className="purpleBox">Currently Reading List...</div>
                <div className="purpleBox">Currently Wish List...</div>
            </div>
        )
    }
}
export default UserPage;