import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toSearch: false,
            toPaper: false,
            paperID: '',
            searchResults: [],
            isFetching: false,
            query: '',
        };
        this.toSearch = this.toSearch.bind(this);
    }


    toSearch(query) {
        this.setState({ toSearch: true, query: query });
    }

    toPaper(id) {
        this.setState({ toPaper: true, paperID: id });
    }

    async search(query) {
        this.setState({ isFetching: true });
        try {
            let response = await axiosInstance.get('search/', {
                params: {
                    search_term: query,
                }
            });
            console.log(response);
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
        //redirect to a paper page if necessary
        if (this.state.toPaper=== true) {
            return <Redirect to={{
                pathname: "/article/" + encodeURIComponent(this.state.paperID) + "/",
            }} />
        }

        return (
            <div>
                <Navbar toSearch={(query) => this.toSearch(query)} />
                <div className="row">
                    <div className="column left-body">
                    </div>
                    <div className="column middle-body">
                        {this.state.isFetching ? "Gathering papers..." : ""}
                        {
                            //for each paper in the results, create an list item
                            this.state.searchResults.map(article => {
                                return (
                                   <PaperReference paper={article} key={article.DOI} toPaper={() => this.toPaper(article.DOI)}/>
                                );
                            }
                            )
                        }
                    </div>
                    <div className="column right-body">
                    </div>
                </div>
            </div>
        )
    }
}

class PaperReference extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    getAuthors(){
        return this.props.paper.authors.join();
    }

    render(){
        return(
            <div className="paperReference" onClick={this.props.toPaper}>
                <h4>{this.props.paper.title}</h4>
                <h5>{this.props.paper.authors.join(", ")}</h5>
                <p>{this.props.paper.journal + " " + this.props.paper.date_published}</p>
            </div>
        );
    }
}

export default SearchResults;