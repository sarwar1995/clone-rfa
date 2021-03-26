import React, { Component } from "react";
import axiosInstance from "../axiosApi";

//There has to be a parent component that fetches comment data related to the paper.

// class Comment extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             comment: null,
//         };
//     }

//     async getComment(){
//         try {
//             let response = await axiosInstance.get('/comment/show');
//             const message = response.data.hello;
//             this.setState({
//                 message: message,
//             });
//             return message;
//         }catch(error){
//             console.log("Error: ", JSON.stringify(error, null, 4));
//             throw error;
//         }
//     }

//     async componentDidMount(){
//         // It's not the most straightforward thing to run an async method in componentDidMount

//         // Version 1 - no async: Console.log will output something undefined.
//         const messageData1 = this.getMessage();
//         console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
//     }

//     render(){
//         return (
//             <div>
//                 <p>{this.state.message}</p>
//             </div>
//         )
//     }
// }
//export default Comment;

class Comment extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {props.comment_text}
        <div>{props.user.first_name + props.user.last_name}</div>
      </div>
    );
  }
}

export default Comment;
