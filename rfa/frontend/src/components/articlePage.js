import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";

class ArticlePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toSearch: false,
            query: '',
        };
        this.toSearch = this.toSearch.bind(this);
    }


    toSearch(query) {
        this.setState({ toSearch: true, query: query });
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
                Article
            </div>
        )
    }
}
export default ArticlePage;