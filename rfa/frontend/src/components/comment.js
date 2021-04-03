import React, { Component } from "react";
import axiosInstance from "../axiosApi";
import profileIcon from "../profile_icon.png";
import upvote from "../plus.png";
import upvoteClicked from "../plus_clicked.png";
import downvote from "../minus.png";
import downvoteClicked from "../minus_clicked.png";
import Reply from './reply';
import ReplyForm from './replyForm';
import time_ago from '../timeAgo';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            replying: false,
        };
        this.toggleReply = this.toggleReply.bind(this);
    }

    //vote on a comment
    async vote(polarity) {
        try {
            const response = await axiosInstance.post("/comments/vote/", {
                comment_id: this.props.comment.id,
                polarity: polarity
            });
            if (polarity) {
                this.props.comment.votes = this.props.comment.votes + 1;
            }
            else {
                this.props.comment.votes = this.props.comment.votes - 1;
            }
            this.setState({});
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    toggleReply(){
        this.setState({replying: !this.state.replying});
    }

    render() {
        return (
            <div>
                <div className="commentDiv">
                    <div className="commentTitleDiv">
                        <img className="profileIcon" src={profileIcon} />
                        <div className="commentUsernameDiv">
                            <p className="commentUsername">{this.props.comment.user.username}</p>
                            <div className="commentExpertise">{this.props.comment.user_expertise}</div>
                            <div className="commentType">{this.props.comment.comment_type}</div>
                            <p className="commentDate">{time_ago(this.props.comment.created_at)}</p>
                        </div>
                    </div>
                    <div className="commentText" dangerouslySetInnerHTML={{ __html: this.props.comment.comment_text }} />
                    <div className="commentInteractions">
                        <div className="voteBox">
                            <img className="upvote lineItem" onClick={() => this.vote(true)} src={upvote} />
                            <p className="voteCount lineItem">{this.props.comment.votes}</p>
                            <img className="downvote lineItem" onClick={() => this.vote(false)} src={downvote} />
                        </div>
                        <button className="lineItem" onClick={() => this.toggleReply()}>
                            Reply
                      </button>
                    </div>
                </div>
                <div className="editorDiv">
                    {this.state.replying ?
                        <ReplyForm commentId={this.props.comment.id} getComments={() => {
                            this.toggleReply();
                            this.props.getComments();
                        }}/> :
                        ""
                    }
                </div>
                <div className="repliesDiv">
                    {
                        this.props.comment.replies.map((reply) => {
                            return <Reply key={reply.id} reply={reply} />;
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Comment;