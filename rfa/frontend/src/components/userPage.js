import React, { Component } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import axiosInstance from "../axiosApi";
import Navbar from "./navbar";
import ReadingListManager from './readingListManager';
import RnD from "../research-and-development.png";
import { Initial } from "react-initial";
import Comment from "./comment";

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSearch: false,
      query: "",
      user: null,
      comments: [],
      isFetchingUser: false,
      isFetchingComments: false,
    };
    this.toSearch = this.toSearch.bind(this);
  }

  toSearch(query) {
    this.setState({ toSearch: true, query: query });
  }

  //given a username, get user info from the backend
  async getUser(username) {
    this.setState({ isFetchingUser: true });
    try {
      let response = await axiosInstance.get("user/getByUsername/", {
        params: {
          username: decodeURI(username),
          isSelf: decodeURI("false"),
        },
      });
      console.log(response);
      this.setState({ user: response.data, isFetchingUser: false });
    } catch {
      console.log(error);
      alert("User Not Found!");
    }
  }

  //given a username, get that user's top comments
  async getUserComments(username) {
    this.setState({ isFetchingComments: true });
    try {
      let response = await axiosInstance.get("user/top-comments/", {
        params: {
          username: decodeURI(username),
          isSelf: decodeURI("false"),
        },
      });
      console.log(response);
      this.setState({ comments: response.data, isFetchingComments: false });
    } catch {
      console.log(error);
      alert("Error loading user comments!");
    }
  }

  // Create list of components
  generateListOfReadingLists(reading_lists) {
    let readingListItems = reading_lists.map((rl) => (
      <ReadingListPreview key={rl.name} data={rl} />
    ));
    return readingListItems;
  }

  //when the page loads...
  componentDidMount() {
    //get user data
    this.getUser(this.props.match.params.username);
    this.getUserComments(this.props.match.params.username);
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

    console.log(this.state.comments);

    return (
      <div>
        <Navbar toSearch={(query) => this.toSearch(query)} />
        <div className="row">
          <div className="column left-body">
          </div>
          <div className="column middle-body">
            <div className="purpleBox">
              {this.state.isFetchingUser ? <p>Fetching data...</p> : ""}
              {this.state.user ? (
                <div>
                  <Initial
                    name={this.state.user.first_name + " " + this.state.user.last_name}
                    className="userIcon"
                    color="#094DA0"
                    height={100}
                    width={100}
                    radius={500}
                    fontSize={60}
                    charCount={2}
                    useWords={true}
                    className="userpageBigIcon"
                  />
                  <div className="userpageUserDetails">
                    <div className="userpageUsername">{this.state.user.first_name + " " + this.state.user.last_name}</div>
                    {this.state.user.affiliation ? <div className="userpageRole">{this.state.user.position} @ {this.state.user.affiliation}</div> : <div className="userpageRole">Unaffiliated</div>}
                  </div>
                  <div className="userpageUserStats">
                    <div className="userpageStatBox">
                      <div className="userpageStat">{this.state.user.score}</div>
                      <div className="userpageStatLabel">Reputation Score</div>
                    </div>
                    <div className="userpageStatBox">
                      <div className="userpageStat">{this.state.user.comment_count}</div>
                      <div className="userpageStatLabel">Comments</div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="readingListForm">
              <ReadingListManager DOI={0} displayAddRemove={false} displayCreateDelete={true} />
            </div>
            {this.state.user ? (
              <div>
                {this.generateListOfReadingLists(this.state.user.reading_lists)}
              </div>
            ) : (
              ""
            )}
            <div className="commentsList">
              {this.state.isFetchingComments ? "Fetching comments..." :
                this.state.comments.length ? (
                  this.state.comments.map((comment) => {
                    return (
                      <div>
                        <Link to={"/article/" + encodeURIComponent(comment.paper.DOI) + "/"}>
                          <div className="userpagePaperTitle">
                            {comment.paper.title}
                          </div>
                        </Link>
                        <Comment
                          key={comment.id}
                          comment={comment}
                          getComments={() => this.getUserComments(this.props.match.params.username)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="noCommentsDiv">
                    <h5 className="noComments">
                      This user hasn't posted yet!
                    </h5>
                  </div>
                )}
            </div>
          </div>
          <div className="column right-body">
          </div>
        </div>
      </div>
    );
  }
}

class ReadingListPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toList: false,
      listID: "",
    };
  }

  toList(id) {
    this.setState({ toList: true, listID: id });
  }

  render() {
    if (this.state.toList === true) {
      return (
        <Redirect
          to={{
            pathname: "/readinglist/" + this.state.listID + "/",
          }}
        />
      );
    }

    return (
      <div className="purpleBox">
        <div className="row">
          <div className="column left">
            {/* TODO: Add a small icon before every reading list block. The icon is the RnD image file.*/}
            <img src={RnD} className="readingListIcon" />
          </div>
          <div
            className="column middle colorOnHover"
            onClick={() => this.toList(this.props.data.id)}
          >
            <p>{this.props.data.name}</p>
            {/* Put button here to go to ReadingList page */}
            {/* this.props.data has same fields as ReadingList model */}
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
