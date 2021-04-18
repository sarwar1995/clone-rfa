import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import profileIcon from "../profile_icon.png";
import upvote from "../plus.png";
import upvoteClicked from "../plus_clicked.png";
import downvote from "../minus.png";
import downvoteClicked from "../minus_clicked.png";
import time_ago from '../timeAgo';
import { Initial } from 'react-initial';
import parseMath from "../parseMath";
import Latex from 'react-latex';
import JsxParser from 'react-jsx-parser';


class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //vote on a reply
  async vote(polarity) {
    try {
      const response = await axiosInstance.post("/comments/reply/vote/", {
        reply_id: this.props.reply.id,
        polarity: polarity
      });
      if (polarity) {
        this.props.reply.votes = this.props.reply.votes + 1;
      }
      else {
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
          <Initial name={this.props.reply.user.username} className="userIcon" color="#094DA0" height={35} width={35} radius={10} fontSize={30} />
          <div className="commentUsernameDiv">
            <p className="commentUsername">{this.props.reply.user.username}</p>
            {(this.props.reply.user.position && this.props.reply.user.affiliation) ?
              <div className="commentPosition">{this.props.reply.user.position} @ {this.props.reply.user.affiliation}</div> :
              ""
            }
            <p className="commentDate">{time_ago(this.props.reply.created_at)}</p>
          </div>
        </div>
        <JsxParser
          components={{ Latex }}
          jsx={parseMath(this.props.reply.reply_text)}
        />
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