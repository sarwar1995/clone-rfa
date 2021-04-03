import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";
import CommentForm from "./commentForm";
import profileIcon from "../profile_icon.png";
import upvote from "../plus.png";
import upvoteClicked from "../plus_clicked.png";
import downvote from "../minus.png";
import downvoteClicked from "../minus_clicked.png";


class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSearch: false,
      query: "",
      article: null,
      article_comments: [],
      isFetchingArticle: false,
      isFetchingComments: false,
      currentFilter: "all",
    };
    this.toSearch = this.toSearch.bind(this);
  }

  toSearch(query) {
    this.setState({ toSearch: true, query: query });
  }


    //given an article DOI, get it from the backend
    async getArticle(DOI) {
        this.setState({ isFetchingArticle: true });
        try {
            let response = await axiosInstance.get("papers/getByDOI/", {
                params: {
                    DOI: decodeURI(DOI),
                },
            });
            console.log(response);
            this.setState({ article: response.data, isFetchingArticle: false });
        } catch {
            console.log(error);
            alert("Article Not Found!");
        }
    }

    async getComments(DOI) {
        this.setState({ isFetchingComments: true });
        try {
            let response = await axiosInstance.get("papers/getComments/", {
                params: {
                    DOI: decodeURI(DOI),
                },
            });
            console.log(response);
            this.setState({
                article_comments: response.data,
                isFetchingComments: false,
            });
        } catch (error) {
            console.log(error);
            alert("Error loading comments!");
        }
    }

    //when the page loads...
    componentDidMount() {
        //get article data
        this.getArticle(this.props.match.params.DOI);
        this.getComments(this.props.match.params.DOI);
    }

  //return a div containing components that display details about the appropriate article
  displayArticleDetail() {
    return (
      <div>
        <h2>{this.state.article.title}</h2>
        <h4>{this.state.article.authors}</h4>
        <h4>
          {this.state.article.journal + " " + this.state.article.date_published}
        </h4>
      </div>
    );
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
                <div className="col-body">
                    <div className="column left-body">
                    </div>
                    <div className="column middle-body">
                        <div className="articleDetail">
                            {this.state.isFetchingArticle ? "Fetching data..." : ""}
                            {this.state.article ? this.displayArticleDetail() : ""}
                        </div>
                        <div className="commentForm">
                            <h4>What are your thoughts?</h4>
                            <CommentForm DOI={this.props.match.params.DOI} />
                        </div>
                        <div className="commentsList">
                            <div className="commentsHeader">
                                <button onClick={() => this.setState({ currentFilter: "all" })} className={this.state.currentFilter === "all" ? "commentCategoryButton clickedFilter" : "commentCategoryButton secondaryButton"}>All</button>
                                <button onClick={() => this.setState({ currentFilter: "questions" })} className={this.state.currentFilter === "questions" ? "commentCategoryButton clickedFilter" : "commentCategoryButton secondaryButton"}>Questions</button>
                                <button onClick={() => this.setState({ currentFilter: "reviews" })} className={this.state.currentFilter === "reviews" ? "commentCategoryButton clickedFilter" : "commentCategoryButton secondaryButton"}>Reviews</button>
                                <button onClick={() => this.setState({ currentFilter: "summaries" })} className={this.state.currentFilter === "summaries" ? "commentCategoryButton clickedFilter" : "commentCategoryButton secondaryButton"}>Summaries</button>
                            </div>
                            <div>
                                {this.state.isFetchingComments ? "Fetching comments..." : ""}
                                {this.state.article_comments.length
                                    ? this.state.article_comments.map((comment) => {
                                        return (
                                            <Comment key={comment} comment={comment} />
                                        );
                                    }
                                    )
                                    : "No Comments!"
                                }
                            </div>
                        </div>
                    </div>
                    <div className="column right-body">
                    </div>
                </div>
            </div>
        );
  }
}


class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    //vote on an article
    async vote(polarity){
        try {
            const response = await axiosInstance.post("/comments/voteComment/", {
              comment_id: this.props.comment.id,
              polarity: polarity
            });
            if(polarity){
                this.props.comment.votes = this.props.comment.votes + 1;
            }
            else{
                this.props.comment.votes = this.props.comment.votes - 1;
            }
            this.setState({});
          } catch (error) {
            console.log(error);
            throw error;
          }
    }

    render() {
        return (
            <div className="commentDiv">
                <div className="commentTitleDiv">
                    <img className="profileIcon" src={profileIcon} />
                    <div className="commentUsernameDiv">
                        <p className="commentUsername">{this.props.comment.user.username}</p>
                        <div className="commentExpertise">{this.props.comment.user_expertise}</div>
                        <div className="commentType">{this.props.comment.comment_type}</div>
                        <p className="commentDate">{this.props.comment.created_date}</p>
                    </div>
                </div>
                <div className="commentText" dangerouslySetInnerHTML={{ __html: this.props.comment.comment_text }} />
                <div className="commentInteractions">
                    <div className="voteBox">
                        <img className="upvote lineItem" onClick={() => this.vote(true)} src={upvote} />
                        <p className="voteCount lineItem">{this.props.comment.votes}</p>
                        <img className="downvote lineItem" onClick={() => this.vote(false)} src={downvote} />
                    </div>
                    <button className="lineItem">
                        Reply
                    </button>
                </div>
            </div>
        );
    }
}
export default ArticlePage;

