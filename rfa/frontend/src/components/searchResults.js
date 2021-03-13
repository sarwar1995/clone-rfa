import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toSearch: false,
            searchResults: [],
            isFetching: false,
            query: '',
        };
        this.toSearch = this.toSearch.bind(this);
    }


    toSearch(query) {
        this.setState({ toSearch: true, query: query });
    }

    async search(query) {
        this.setState({ isFetching: true });
        try {
            let response = await axiosInstance.get('search/', {
                params: {
                    search_term: query,
                    max_results: 10,
                }
            });
            this.setState({ searchResults: response.data, isFetching: false })
        }
        catch (error) {
            console.log(error);
        }
    }

    //when the page loads...
    componentDidMount() {
        //get search results
        this.search(this.props.match.params.term);
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
                Search Results
                {this.state.isFetching ? "Gathering papers..." : ""}
                {
                    //for each paper in the results, create an list item
                    this.state.searchResults.map(article => {
                        return (
                            <p>{article.title}</p>
                        );
                    }
                    )
                }
            </div>
        )
    }
}
export default SearchResults;