import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Hello from "./hello";
import Landing from "./landing"
import axiosInstance from "../axiosApi";

class App extends Component {

    constructor() {
        super();
        this.state = { searchTerm: "" };
        this.handleLogout = this.handleLogout.bind(this);
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

    render() {
        return (
            <div className="site">
                <div id="header">
                    <div className="row">
                        <div className="column left">
                            <h2 className="navbarLogo">RFA</h2>
                        </div>
                        <div className="column middle">
                            <form onSubmit={this.handleSubmit} className="searchForm">
                                <div className="input-icons">
                                    <i class="fa fa-search icon navbarIcon"></i>
                                    <input name="search" type="text" value={this.state.searchText} onChange={this.handleChange} className="searchBar" />
                                </div>
                            </form>
                        </div>
                        <div className="column right">
                            <button onClick={this.handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
                <main>
                    <Switch>
                        <Route exact path={"/login/"} component={Login} />
                        <Route exact path={"/signup/"} component={Signup} />
                        <Route exact path={"/hello/"} component={Hello} />
                        <Route path={"/"} component={Landing} />
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;