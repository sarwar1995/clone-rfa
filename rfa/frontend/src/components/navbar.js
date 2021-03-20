import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import { Switch, Route, Link, useHistory } from "react-router-dom";


class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = { query: "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    async handleLogout() {
        try {
            const response = await axiosInstance.post('/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        }
        catch (e) {
            console.log(e);
        }
    };

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSearch(event) {
        event.preventDefault();
        this.props.toSearch(this.state.query);
    }

    render() {
        return (
            <div id="header">
                <div className="row">
                    <div className="column left">
                        <h2 className="navbarLogo">RFA</h2>
                    </div>
                    <div className="column middle">
                        <form onSubmit={this.handleSearch} className="searchForm">
                            <div className="input-icons">
                                <i className="fa fa-search icon navbarIcon"></i>
                                <input name="query" type="text" value={this.state.query} onChange={this.handleChange} className="searchBar" />
                            </div>
                        </form>
                    </div>
                    <div className="column right">
                        <button onClick={this.handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Navbar;