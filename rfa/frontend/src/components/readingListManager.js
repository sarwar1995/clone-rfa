import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import { Switch, Route, Link, useHistory } from "react-router-dom";

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
            currentList: 0,
            paperInList: {0: false}
        };
        this.updateSelectedList = this.updateSelectedList.bind(this)
    }

    async updateSelectedList(event) {
        this.setState({currentList: event.target.value});
    }

    async updatePaperInList() {
        // Given a DOI and a list of DOI lists, 
        // update an array of whether that DOI is in each list
        let i, rl;
        this.state.paperInList = {}
        for (i = 0; i < this.state.readingLists.length; i++) {
            rl = this.state.readingLists[i];
            this.state.paperInList[rl['id']] = JSON.parse(rl['DOIs'])['DOIs'].includes(this.props.DOI);
        }
    }

    //get current user's reading lists from the backend
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
        //get article data
        this.getReadingLists();
    }

    render() {
        return (
            <div id="header">
                <div className="row">
                    <div className="column middle">
                        {this.state.isFetchingLists ? "Fetching lists..." : ""}
                        {this.state.readingLists ?
                            <div>
                                <label for="listnames">Choose a list:</label>
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
                            </div>
                            : ""}
                        {this.state.isEditingLists ?
                            "Editing lists..."
                            :
                            this.state.readingLists && this.state.paperInList[this.state.currentList] ?
                                <button onClick={() => this.editList(this.state.currentList, this.props.DOI, 'remove')}>
                                    Remove Paper
                                </button>
                                : 
                                <button onClick={() => this.editList(this.state.currentList, this.props.DOI, 'add')}>
                                    Add Paper
                                </button>
                            }
                    </div>
                </div>
            </div>
        )
    }
}
export default readingListManager;
