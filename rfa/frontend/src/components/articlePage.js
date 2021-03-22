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
            article: null,
            isFetchingArticle: false,
        };
        this.toSearch = this.toSearch.bind(this);
    }

    toSearch(query) {
        this.setState({ toSearch: true, query: query });
    }

    //given an article DOI, get it from the backend
    async getArticle(DOI){
        this.setState({isFetchingArticle: true});
        try{
            let response = await axiosInstance.get('papers/getByDOI/', {
                params: {
                    DOI: decodeURI(DOI)
                }
            });
            console.log(response);
            this.setState({ article: response.data, isFetchingArticle: false })
        }
        catch{
            console.log(error);
            alert("Article Not Found!");
        }
    }

    //when the page loads...
    componentDidMount() {
        //get article data
        this.getArticle(this.props.match.params.DOI);
    }

    render() {
        console.log(decodeURI(this.props.match.params.DOI));
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
                {this.state.isFetchingArticle ? "Fetching data..." : ""}
                {this.state.article ? this.state.article.title : ""}
            </div>
        )
    }
}
export default ArticlePage;