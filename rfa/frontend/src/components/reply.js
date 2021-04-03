import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import profileIcon from "../profile_icon.png";
import upvote from "../plus.png";
import upvoteClicked from "../plus_clicked.png";
import downvote from "../minus.png";
import downvoteClicked from "../minus_clicked.png";
import time_ago from '../timeAgo';

class Reply extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
  
      //vote on a reply
      async vote(polarity){
          try {
              const response = await axiosInstance.post("/comments/reply/vote/", {
                reply_id: this.props.reply.id,
                polarity: polarity
              });
              if(polarity){
                  this.props.reply.votes = this.props.reply.votes + 1;
              }
              else{
                  this.props.reply.votes = this.props.reply.votes - 1;
              }
              this.setState({});
            } catch (error) {
              console.log(error);
              throw error;
            }
      }
  
      render() {
          return (
              <div className="replyDiv">
                  <div className="commentTitleDiv">
                      <img className="profileIcon" src={profileIcon} />
                      <div className="commentUsernameDiv">
                          <p className="commentUsername">{this.props.reply.user.username}</p>
                          <p className="commentDate">{time_ago(this.props.reply.created_at)}</p>
                      </div>
                  </div>
                  <div className="commentText" dangerouslySetInnerHTML={{ __html: this.props.reply.reply_text }} />
                  <div className="commentInteractions">
                      <div className="voteBox">
                          <img className="upvote lineItem" onClick={() => this.vote(true)} src={upvote} />
                          <p className="voteCount lineItem">{this.props.reply.votes}</p>
                          <img className="downvote lineItem" onClick={() => this.vote(false)} src={downvote} />
                      </div>
                  </div>
        </div>
      );
    }
  }

  export default Reply;