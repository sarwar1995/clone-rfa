import React, { Component } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosApi";
import profileIcon from "../profile_icon.png";
import upvote from "../plus.png";
import upvoteClicked from "../plus_clicked.png";
import downvote from "../minus.png";
import downvoteClicked from "../minus_clicked.png";
import time_ago from "../timeAgo";
import { Initial } from "react-initial";
import parseMath from "../parseMath";
import Latex from "react-latex";
import JsxParser from "react-jsx-parser";
import ReplyForm, { EditReplyForm } from "./replyForm";

class Reply extends Component {
  constructor(props) {
    super(props);
    const created_date = new Date(this.props.reply.created_at);
    const edited_date = new Date(this.props.reply.edited_at);

    this.state = {
      editing: false,
      isEdited: created_date.valueOf() === edited_date.valueOf() ? false : true,
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.compareDates = this.compareDates.bind(this);
  }

  //vote on a reply
  async vote(polarity) {
    try {
      const response = await axiosInstance.post("/comments/reply/vote/", {
        reply_id: this.props.reply.id,
        polarity: polarity,
      });
      if (polarity) {
        this.props.reply.votes = this.props.reply.votes + 1;
      } else {
        this.props.reply.votes = this.props.reply.votes - 1;
      }
      this.setState({});
    } catch (error) {
      alert(error.response.data);
      console.log(error.response);
      throw error;
    }
  }

  toggleEdit() {
    this.setState({ editing: !this.state.editing });
  }

  compareDates() {
    const created_date = new Date(this.props.reply.created_at);
    const edited_date = new Date(this.props.reply.edited_at);
    if (created_date.valueOf() === edited_date.valueOf()) {
      this.setState({ isEdited: false });
    } else {
      this.setState({ isEdited: true });
    }
  }

  render() {
    return (
      <div>
        {this.state.editing ? (
          <EditReplyForm
            replyId={this.props.reply.id}
            reply_text={this.props.reply.reply_text}
            getComments={() => {
              this.toggleEdit();
              this.props.getComments();
              this.compareDates();
            }}
          />
        ) : (
          <div className="replyDiv">
            <div className="commentTitleDiv">
              <Link to={"/user/" + this.props.reply.user.username + "/"}>
                <Initial
                  name={this.props.reply.user.first_name + " " + this.props.reply.user.last_name}
                  className="userIcon"
                  color="#094DA0"
                  height={35}
                  width={35}
                  radius={10}
                  fontSize={22}
                  useWords={true}
                  charCount={2}
                />
              </Link>
              <div className="commentUsernameDiv">
                <p className="commentUsername">
                  {this.props.reply.user.first_name + " " + this.props.reply.user.last_name}
                </p>
                {this.props.reply.user.position &&
                  this.props.reply.user.affiliation ? (
                  <div className="commentPosition">
                    {this.props.reply.user.position} @{" "}
                    {this.props.reply.user.affiliation}
                  </div>
                ) : (
                  ""
                )}
                <p className="commentDate">
                  {time_ago(this.props.reply.created_at)}
                </p>
              </div>
            </div>
            <JsxParser
              components={{ Latex }}
              jsx={parseMath(this.props.reply.reply_text)}
            />
            {this.state.isEdited ? (
              <p className="commentDate">
                {"Edited: " + time_ago(this.props.reply.edited_at)}
              </p>
            ) : (
              ""
            )}
            <div className="commentInteractions">
              <div className="voteBox">
                <img
                  className="upvote lineItem"
                  onClick={() => this.vote(true)}
                  src={upvote}
                />
                <p className="voteCount lineItem">{this.props.reply.votes}</p>
                <img
                  className="downvote lineItem"
                  onClick={() => this.vote(false)}
                  src={downvote}
                />
              </div>
              {this.props.reply.user.username === localStorage.getItem("username") ?
                <button className="editButton" onClick={() => this.toggleEdit()}>
                  Edit
              </button> : ""}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Reply;
