import React, { Component } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Login from "./login";
import Signup from "./signup";
import SearchResults from "./searchResults";
import UserPage from "./userPage";
import ArticlePage from "./articlePage";


class App extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="site">
                <main>
                    <Switch>
                        <Route exact path={"/signup/"} component={Signup} />
                        <Route
                            path={"/search/:term"}
                            render={props => <SearchResults key={props.match.params.term} {...props} />}
                        />
                        <Route exact path={"/user/"} component={UserPage} />
                        <Route exact path={"/article/"} component={ArticlePage} />
                        <Route path={"/"} component={Login} />
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;