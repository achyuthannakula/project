import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Redirect, withRouter } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import ReactQuill from "react-quill";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import Spinner from "./spinner";

const styles = {
  root: {
    margin: "1em 0em",
    height: "auto"
  },
  editor: {
    width: "100%",
    minHeight: "5em",
    height: "auto",
    display: "block"
  },
  button: {
    margin: "1em 0em"
  },
  icon: {
    fontSize: 20,
    margin: "auto",
    marginLeft: "5px"
  },
  flex: {
    display: "flex"
  }
};

class AnswerEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHtml: ""
    };
  }
  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["code-block", "link", "image", "video"]
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    }
  };

  formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "code-block",
    "link",
    "image",
    "video"
  ];

  handleChange = html => {
    this.setState({ editorHtml: html });
  };

  handleSubmit = createAnswer => {
    console.log("on click submit");
    createAnswer({
      variables: {
        answerInput: {
          userId: this.props.userInfo.id,
          postId: this.props.postId,
          answer: this.state.editorHtml
        }
      }
    });
  };

  render() {
    const { classes, userInfo, postId } = this.props;
    console.log(userInfo);

    return (
      <div className={classes.root}>
        <Query
          query={gql`
            query CheckUserHasAnswer($userId: ID!, $postId: ID!) {
              checkUserHasAnswer(userId: $userId, postId: $postId)
            }
          `}
          variables={{ userId: userInfo.id, postId: postId }}
          fetchPolicy={"cache-and-network"}
        >
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :(</p>;
            if (data) {
              console.log("create answer", data);
              if (data.checkUserHasAnswer)
                return (
                  <Typography variant="h6" align={"center"} gutterBottom>
                    You already answered this question before :)
                  </Typography>
                );
              return (
                <>
                  <ReactQuill
                    className={classes.editor}
                    theme={"snow"}
                    onChange={this.handleChange}
                    value={this.state.editorHtml}
                    modules={this.modules}
                    formats={this.formats}
                    placeholder={"Enter the text here..."}
                  />
                  <Mutation
                    mutation={gql`
                      mutation CreateAnswer($answerInput: AnswerInput!) {
                        createAnswer(data: $answerInput) {
                          id
                        }
                      }
                    `}
                  >
                    {(createAnswer, { error, loading, data }) => {
                      if (data) console.log("data-", data);
                      if (error) console.log("error", error);
                      return (
                        <Button
                          className={classes.button}
                          color={"primary"}
                          variant={"contained"}
                          disabled={loading ? true : false}
                          onClick={() => this.handleSubmit(createAnswer)}
                        >
                          {data && (
                            <>
                              <Redirect
                                to={`/q/${postId}/${data.createAnswer.id}`}
                              />
                              {this.props.handleClose()}
                            </>
                          )}
                          {loading ? (
                            "......"
                          ) : (
                            <span className={classes.flex}>
                              Submit
                              <SendIcon className={classes.icon} />
                            </span>
                          )}
                        </Button>
                      );
                    }}
                  </Mutation>
                </>
              );
            }
          }}
        </Query>
        <Divider />
      </div>
    );
  }
}

AnswerEditor.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(AnswerEditor));
