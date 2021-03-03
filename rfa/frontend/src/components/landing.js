import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import axiosInstance from "../axiosApi";

class Landing extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="landing">
                <h1 id="logo">Research For All</h1>
                <div>
                    <Link to={"/login/"}>
                        <button>Login</button>
                    </Link>
                    <Link to={"/signup/"}>
                        <button>Create Account</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Landing;