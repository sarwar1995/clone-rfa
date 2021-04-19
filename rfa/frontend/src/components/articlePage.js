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
import Comment from './comment';
import ReadingListManager from './readingListManager';

class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSearch: false,
      query: "",
      article: null,
      article_comments: [],
      commentsToUsers: null, //map of comments to the associated users
      isFetchingArticle: false,
      isFetchingComments: false,
      currentFilter: "all",
    };
    this.toSearch = this.toSearch.bind(this);
    this.getComments = this.getComments.bind(this);

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
        <h4>{this.state.article.authors.replace(/['"]+/g, '')}</h4>
        <h4>
          {this.state.article.journal + " " + this.state.article.year_published}
        </h4>
      </div>
    );
  }

  render() {
    //check if user has an auth token...
    if (axiosInstance.defaults.headers["Authorization"] === null) {
      return <Redirect to="/" />;
    }
    //redirect to search if necessary
    if (this.state.toSearch === true) {
      return (
        <Redirect
          to={{
            pathname: "/search/" + this.state.query + "/",
          }}
        />
      );
    }

    return (
      <div>
        <Navbar toSearch={(query) => this.toSearch(query)} />
        <div className="col-body">
          <div className="column left-body"></div>
          <div className="column middle-body">
            <div className="articleDetail">
              {this.state.isFetchingArticle ? "Fetching data..." : ""}
              {this.state.article ? this.displayArticleDetail() : ""}
            </div>
            <div className="readingListForm">
              <ReadingListManager DOI={this.props.match.params.DOI} displayAddRemove={true} displayCreateDelete={false}/>
            </div>
            <div className="commentForm">
              <h4>What are your thoughts?</h4>
              <CommentForm DOI={this.props.match.params.DOI} getComments={() => this.getComments(this.props.match.params.DOI)}/>
            </div>
            <div className="commentsList">
              <div className="commentsHeader">
                <button
                  onClick={() => this.setState({ currentFilter: "all" })}
                  className={
                    this.state.currentFilter === "all"
                      ? "commentCategoryButton clickedFilter"
                      : "commentCategoryButton secondaryButton"
                  }
                >
                  All
                </button>
                <button
                  onClick={() => this.setState({ currentFilter: "question" })}
                  className={
                    this.state.currentFilter === "question"
                      ? "commentCategoryButton clickedFilter"
                      : "commentCategoryButton secondaryButton"
                  }
                >
                  Questions
                </button>
                <button
                  onClick={() => this.setState({ currentFilter: "review" })}
                  className={
                    this.state.currentFilter === "review"
                      ? "commentCategoryButton clickedFilter"
                      : "commentCategoryButton secondaryButton"
                  }
                >
                  Reviews
                </button>
                <button
                  onClick={() => this.setState({ currentFilter: "summary" })}
                  className={
                    this.state.currentFilter === "summary"
                      ? "commentCategoryButton clickedFilter"
                      : "commentCategoryButton secondaryButton"
                  }
                >
                  Summaries
                </button>
              </div>
              <div>
                {this.state.isFetchingComments ? "Fetching comments..." : ""}
                {this.state.article_comments.length
                  ? this.state.article_comments.map((comment) => {
                      if(this.state.currentFilter === "all" || this.state.currentFilter === comment.comment_type){
                        return <Comment key={comment.id} comment={comment} getComments={() => this.getComments(this.props.match.params.DOI)}/>
                      }
                    })
                  :
                  <div className="noCommentsDiv">
                    <h5 className="noComments">Be the first to say something!</h5>
                  </div> 
                  }
              </div>
            </div>
          </div>
          <div className="column right-body"></div>
        </div>
      </div>
    );
  }
}

export default ArticlePage;
