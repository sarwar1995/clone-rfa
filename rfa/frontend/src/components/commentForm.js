import React, { Component } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import axiosInstance from "../axiosApi";
import { Editor } from "@tinymce/tinymce-react";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      type: "question",
      section: "whole",
      expertise: "familiar",
      privacy: "public",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleChange(content, editor) {
    this.setState({ content });
  }

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    // alert("Text being submitted: " + this.state.content);
    try {
      let response = await axiosInstance.post("comments/create/", {
        data: {
          paper_DOI: decodeURI(this.props.DOI),
          comment_text: this.state.content,
          isAnonymous: this.state.privacy,
          paper_section: this.state.section,
          comment_type: this.state.type,
          user_expertise: this.state.expertise,
        },
      });
      console.log(response);
      this.setState({ article: response.data, isFetchingArticle: false });
    } catch {
      console.log(error);
      alert("Comment not created!");
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="optionsDiv">
          <div className="commentOptionDiv">
            <label for="type" className="commentOptionLabel">
              Type:
            </label>
            <select
              name="type"
              id="type"
              value={this.state.type}
              onChange={this.handleFormChange}
            >
              <option value="question">Question</option>
              <option value="summary">Summary</option>
              <option value="review">Review</option>
            </select>
          </div>
          <div className="commentOptionDiv">
            <label for="section" className="commentOptionLabel">
              Commenting On:
            </label>
            <select
              name="section"
              id="section"
              value={this.state.section}
              onChange={this.handleFormChange}
            >
              <option value="whole">Entire Paper</option>
              <option value="intro">Introduction</option>
              <option value="method">Methodology</option>
              <option value="results">Results</option>
              <option value="discussion">Discussion</option>
              <option value="conclusion">Conclusion</option>
            </select>
          </div>
          <div className="commentOptionDiv">
            <label for="expertise" className="commentOptionLabel">
              Expertise Level:
            </label>
            <select
              name="expertise"
              id="expertise"
              value={this.state.expertise}
              onChange={this.handleFormChange}
            >
              <option value="novice">Novice</option>
              <option value="familiar">Familiar</option>
              <option value="expert">Expert</option>
              <option value="leader">Leader</option>
            </select>
          </div>
          <div className="commentOptionDiv">
            <label for="privacy" className="commentOptionLabel">
              Privacy:
            </label>
            <select
              name="privacy"
              id="privacy"
              value={this.state.privacy}
              onChange={this.handleFormChange}
            >
              <option value="public">Public</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </div>
        </div>
        <Editor
          apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
          value={this.state.content}
          init={{
            height: 200,
            menubar: false,
          }}
          onEditorChange={this.handleChange}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default CommentForm;
