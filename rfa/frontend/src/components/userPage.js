import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";
import ReadingList from "./readingList";

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toSearch: false,
            query: '',
            user: null,
            isFetchingUser: false,
        };
        this.toSearch = this.toSearch.bind(this);
    }


    toSearch(query) {
        this.setState({ toSearch: true, query: query });
    }

    //given a username, get user info from the backend
    async getUser(username){
        this.setState({isFetchingUser: true});
        try{
            let response = await axiosInstance.get('user/getByUsername/', {
                params: {
                    username: decodeURI(username)
                }
            });
            console.log(response);
            this.setState({ user: response.data, isFetchingUser: false })
        }
        catch{
            console.log(error);
            alert("User Not Found!");
        }
    }

    //given a username, list name, and DOI,
    //add or remove that DOI to the user's given reading list
    // 
    //example usage: this.editReadingList('daniel', 'testList', '123', 'add');
    async editReadingList(username, listname, DOI, action){
        let route;
        if (action == 'add') {
            route = 'user/reading-list/add/'
        } else if (action == 'remove') {
            route = 'user/reading-list/remove/'
        } else {
            alert("Internal error: Incorrect action");
        }
        try{
            let response = await axiosInstance.get(route, {
                params: {
                    username: decodeURI(username),
                    listname: decodeURI(listname),
                    DOI: decodeURI(DOI)
                }
            });
            console.log(response);
        }
        catch{
            console.log(error);
            alert("List Not Found!");
        }
    }

    // Parse reading list to prepare for mapping
    // to ReadingList elements.
    // 
    // This converts from (for Python):
    //      { listnames: ["name1", "name2", ...]
    //        DOIs: [[0, 1, 2], [3, 4, 5], ...] }
    // to the following (for React/JS):
    //      [ {name: "name1", DOIs: [0, 1, 2]},
    //        {name: "name2", DOIs: [3, 4, 5]},
    //         ... ]
    // and then passes those objects to ReadingList
    // Components for individual rendering
    generateListOfReadingLists(reading_lists){
        
        let reading_list_py = JSON.parse(reading_lists)
        let reading_list_js = []
        let i;
        for (i = 0; i < reading_list_py['listnames'].length; i++) {
            reading_list_js.push(
                {
                    'name': reading_list_py['listnames'][i],
                    'DOIs': reading_list_py['DOIs'][i]
                }
            );
        }

        // Create list of components
        let readingListItems;
        if (this.state.user) {
            readingListItems = reading_list_js.map((rl) =>
                <ReadingList key={rl['name']} data={rl}/>
            );
        }
        return readingListItems;
    }

    //when the page loads...
    componentDidMount() {
        //get user data
        this.getUser(this.props.match.params.username);
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
                <div className="purpleBox">
                    {this.state.isFetchingUser ? <p>Fetching data...</p> : ""}
                    {this.state.user ? <div>
                        <p> User ID: {this.state.user.id}</p> 
                        <p>Username: {this.state.user.username}</p> 
                        <p>Name: {this.state.user.first_name + " " + this.state.user.last_name} </p>
                        <p>Email: {this.state.user.email} </p> 
                        <p>Affiliation: {this.state.user.affiliation} </p>
                        <p>Position: {this.state.user.position} </p>
                        </div> : ""}
                </div>
                {this.state.user ? <div>
                    {this.generateListOfReadingLists(this.state.user.reading_lists)}
                    </div> : ""}
            </div>
        )
    }
}
export default UserPage;