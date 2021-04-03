import React, { Component } from "react";
import PaperReference from "./searchResults";

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
    }

    render() {
        return (
            <div className="purpleBox">
                <div className="row 4">
                    <div className="column middle">
                        {this.props.data.name}
                        {this.props.data.id}
                    </div>
                </div>
            </div>
        )
    }
}
export default ReadingList;