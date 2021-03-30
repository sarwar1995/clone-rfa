import React, { Component } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Login, { LoginEmailVerified } from "./login";
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
            <Route
              path={"/user/:username"}
              render={(props) => (
                <UserPage key={props.match.params.username} {...props} />
              )}
            />
            <Route
              path={"/article/:DOI"}
              render={(props) => (
                <ArticlePage key={props.match.params.DOI} {...props} />
              )}
            />
            <Route
              path={"/search/:term"}
              render={(props) => (
                <SearchResults key={props.match.params.term} {...props} />
              )}
            />
            <Route exact path={"/signup/"} component={Signup} />
            {/* <Route
              path={"/:token"}
              component={LoginEmailVerified}
            /> */}
            <Route path={"/"} component={Login} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
