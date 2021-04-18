import React, { Component } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import axiosInstance from "../axiosApi";
import { Editor } from "@tinymce/tinymce-react";

class ReplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
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
    try {
      let response = await axiosInstance.post("comments/reply/create/", {
        data: {
          comment_id: this.props.commentId,
          reply_text: this.state.content,
          isAnonymous: this.state.privacy,
        },
      });
      console.log(response);
      this.props.getComments();
    } catch {
      console.log(error);
      alert("Comment not created!");
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="replyForm">
        <div className="optionsDiv">
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
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            external_plugins: {
              mathjax:
                "/static/frontend/public/@dimakorotkov/tinymce-mathjax/plugin.min.js",
            },
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help | mathjax",

            mathjax: {
              lib: "/static/frontend/public/mathjax/es5/tex-mml-chtml.js", //required path to mathjax
              symbols: { start: "\\(", end: "\\)" }, //optional: mathjax symbols
              className: "math-tex", //optional: mathjax element class
              configUrl:
                "/static/frontend/public/@dimakorotkov/tinymce-mathjax/config.js", //optional: mathjax config js
            },
          }}
          onEditorChange={this.handleChange}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default ReplyForm;
