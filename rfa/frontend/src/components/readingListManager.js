import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import { Switch, Route, Link, useHistory } from "react-router-dom";

// Formatting for requests to backend
// 
// CREATE READING LIST
// axiosInstance.post('user/reading-list/create/', {
//     username: this.props.match.params.username,
//     listname: 'list1'
//     isSelf: true/false
// });
// 
// DELETE READING LIST
// axiosInstance.post('user/reading-list/delete/', {
//     listID: 1
// });
// 
// ADD/REMOVE PAPER IN LIST
// axiosInstance.post('user/reading-list/edit/', {
//    listID: decodeURI(1),
//    DOI: decodeURI(12345),
//    action: decodeURI('add') OR decodeURI('remove')
// });

class readingListManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            readingLists: null,
            isFetchingLists: false,
            isEditingLists: false,
            isDeletingList: false,
            isCreatingList: false,
            currentList: 0,
            paperInList: {0: false}
        };
        this.updateSelectedList = this.updateSelectedList.bind(this)
    }

    async updateSelectedList(event) {
        this.setState({currentList: event.target.value});
    }

    // Given a DOI and a list of DOI lists,
    // update an array of whether that DOI is in each list
    // 
    // Ex with simpler data structures:
    // Current DOI = 123
    // Lists = [[123, 456], [321, 654]]
    // Output = [true, false]
    async updatePaperInList() {
        let i, rl;
        this.state.paperInList = {}
        for (i = 0; i < this.state.readingLists.length; i++) {
            rl = this.state.readingLists[i];
            this.state.paperInList[rl['id']] = JSON.parse(rl['DOIs'])['DOIs'].includes(this.props.DOI);
        }
    }

    // Get current user's reading lists from the backend
    async getReadingLists() {
        this.setState({isFetchingLists: true});
        try{
            let response = await axiosInstance.get('user/getByUsername/', {
                params: {
                    username: decodeURI(''),
                    isSelf: decodeURI('true')
                }
            });
            this.setState({ 
                readingLists: response.data.reading_lists, 
                isFetchingLists: false,
            });
        }
        catch{
            console.log(error);
            alert("User Not Found!");
        }
    }

    // Get current user's reading lists from the backend
    async createList() {
        let response = window.prompt("Name your new reading list: ")
        if (!response || response == '') {
            return;
        }
        this.setState({isCreatingList: true});
        try{
            await axiosInstance.post('user/reading-list/create/', {
                username: decodeURI(''),
                listname: decodeURI(response),
                isSelf: decodeURI('true')
            });
            await this.getReadingLists()
            await this.updatePaperInList()
            this.setState({ isCreatingList: false });
        }
        catch{
            console.log(error);
            alert("User Not Found!");
        }
    }

    // Get current user's reading lists from the backend
    async deleteList(listID) {
        let response = window.confirm("Are you sure you want to delete this reading list?")
        if (!response) {
            return;
        }
        this.setState({isDeletingList: true});
        try{
            await axiosInstance.post('user/reading-list/delete/', {
                listID: decodeURI(listID),
            });
            await this.getReadingLists()
            await this.updatePaperInList()
            this.setState({ isDeletingList: false });
        }
        catch{
            console.log(error);
            alert("User Not Found!");
        }
    }

    // Add or delete DOI in the given list ID
    async editList(listID, DOI, action) {
        this.setState({isEditingLists: true});
        try{
            await axiosInstance.post('user/reading-list/edit/', {
                listID: decodeURI(listID),
                DOI: decodeURI(DOI),
                action: decodeURI(action)
            });
            await this.getReadingLists()
            await this.updatePaperInList()
            this.setState({ isEditingLists: false });
        }
        catch{
            console.log(error);
            alert("User Not Found!");
        }
    }

    //when the page loads...
    componentDidMount() {
        //get reading list data
        this.getReadingLists();
    }

    render() {
        return (
            <div id="header">
                <div className="row">
                    <div className="column md">
                        {this.state.isFetchingLists ? "Fetching lists..." : ""}
                        {this.state.readingLists ?
                            <div>
                                <label for="listnames">
                                    <h5>Choose a list:</h5>
                                </label>
                                <select id="listnames" name="listnames" onChange={this.updateSelectedList}>
                                    <option value='0' key='0'>
                                            --------
                                    </option>
                                    {this.state.readingLists.map((rl) =>
                                        <option value={rl['id']} key={rl['id']}>
                                            {rl['name']}
                                        </option>
                                    )}
                                </select>
                                {this.state.isEditingLists ?
                                    "Editing lists..."
                                    :
                                    this.state.paperInList[this.state.currentList] ?
                                        <button onClick={() => this.editList(this.state.currentList, this.props.DOI, 'remove')}>
                                            Remove Paper
                                        </button>
                                        : 
                                        <button onClick={() => this.editList(this.state.currentList, this.props.DOI, 'add')}>
                                            Add Paper
                                        </button>
                                    }
                                {this.state.isCreatingList ?
                                    "Creating list..."
                                    :
                                    <button onClick={() => this.createList()}>
                                        Create Reading List
                                    </button>
                                    }
                                {this.state.isDeletingList ?
                                    "Deleting list..."
                                    :
                                    <button onClick={() => this.deleteList(this.state.currentList)}>
                                        Delete Reading List
                                    </button>
                                    }
                            </div>
                            : ""}
                        
                    </div>
                </div>
            </div>
        )
    }
}
export default readingListManager;
