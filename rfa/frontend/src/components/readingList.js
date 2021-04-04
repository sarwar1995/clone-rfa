import React, { Component } from "react";
import PaperReference from "./searchResults";

import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";

// Formatting for requests to backend
// 
// CREATE READING LIST
// axiosInstance.post('user/reading-list/create/', {
//     username: this.props.match.params.username,
//     listname: 'list1'
// });
// 
// DELETE READING LIST
// axiosInstance.post('user/reading-list/delete/', {
//     listID: 1
// });
// 
// ADD/REMOVE PAPER IN LIST
// axiosInstance.get('user/reading-list/edit/', {
//     params: {
//         listID: decodeURI(1),
//         DOI: decodeURI(12345),
//         action: decodeURI('add') OR decodeURI('remove')
//     }
// });

class ReadingList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toSearch: false,
            toPaper: false,
            toUser: false,
            paperID: '',
            userID: '',
            DOIs: [],
            Papers: [],
            isFetching: false,
            isFetchingRL: false,
            isFecthingPapers: false,
            isFetchingArticle: false,
            name: '',
            user: '',
        };
        this.toSearch = this.toSearch.bind(this);
    }

    toSearch(query) {
        this.setState({ toSearch: true, query: query });
    }

    toPaper(id) {
        this.setState({ toPaper: true, paperID: id });
    }

    toUser() {
        this.setState({ toUser: true });
    }

    //given a listid, get reading list info from the backend
    async getReadingList(listid){
        console.log("getReadingList => " + listid);
        this.setState({isFetchingUser: true, isFetching: true});
        try{
            let response = await axiosInstance.get('user/reading-list/get/', {
                params: {
                    listid: listid
                }
            });
            console.log("test1234");
            console.log(response);
            this.setState({ DOIs: response.data.dois, name: response.data.name, user: response.data.user, isFetchingRL: false , isFecthingPapers: true})
        }
        catch{
            console.log(error);
            alert("Reading List Not Found!");
        }

        this.setState({isFecthingPapers: true});
        let papers = (this.state.DOIs).map( async (DOI) =>
        {
            try{
                let response = await axiosInstance.get("papers/getByDOI/", {
                    params: {
                        DOI: decodeURI(DOI),
                    },
                });
                console.log(response.data);
                this.setState({ Papers: [...this.state.Papers, response.data]});
                this.forceUpdate();
                return response.data;
            }
            catch{
                console.log(error);
                alert("Paper Not Found!");
            }
        }); 
    }

    //when the page loads...
    componentDidMount() {
        //display the articles in the reading list
        this.getReadingList(this.props.match.params.listid);
    }

    render() {
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
        if (this.state.toUser=== true) {
            return <Redirect to={{
                pathname: "/user/" + encodeURIComponent(this.state.user) + "/",
            }} />
        }

        return (
            <div>
                <Navbar toSearch={(query) => this.toSearch(query)} />
                <div className="purpleBox">
                    <div className="row 4">
                        <div className="column middle">
                            <div className="colorOnHover" onClick={() => this.toUser()}>
                                <h4>Reading List: {this.state.name}</h4>
                                <h5>User: {this.state.user}</h5>
                            </div>
                            {this.state.isFetchingRL ? "Gathering reading lists..." : ""}
                            {
                                this.state.Papers.map(article => {
                                    return (
                                        <div className="paperReference" onClick={() => this.toPaper(article.DOI)}>
                                            <h4>{article.title}</h4>
                                            <h5>{article.authors.slice(1, -1)}</h5>
                                            <p>{(article.journal || "") + " " + (article.date_published || "")}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ReadingList;