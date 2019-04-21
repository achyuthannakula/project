import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import formatDate from "./Date";
import Spinner from "./spinner";
import PongSpinner from "./pongSpinner";

const styles = {
  commentBox: {
    borderColor: "#9199a1",
    border: "1px solid",
    borderRadius: "5px",
    padding: "10px",
    margin: "1em",
    color: "#303336"
  },
  commentFlex: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "start"
  },
  commentLeft: {
    flexGrow: 1,
    width: "auto"
  },
  commentAuthor: {
    fontStyle: "italic",
    color: "#9199a1"
  },
  icon: {
    fontSize: 20,
    marginLeft: "5px"
  },
  anchor: {
    color: "inherit",
    "&:link": {
      textDecoration: "none"
    },
    "&:hover": {
      textDecoration: "underline"
    },
    "&:visited": {}
  },
  centerFlex: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  inlineSpinner: {
    posotion: "relative"
  }
};

class CommentBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentValue: ""
    };
    this.limit = 5;
    this.commentsCount = this.props.commentsCount;
  }

  handleCommentValue = e => {
    this.setState({
      commentValue: e.target.value
    });
  };

  handleSubmit = createComment => {
    createComment({
      variables: {
        commentInput: {
          comment: this.state.commentValue,
          userId: this.props.userInfo.id,
          to: this.props.to,
          toId: this.props.toId
        }
      }
    });
  };

  handleOnComplete = ({ createComment }) => {
    console.log(createComment);
    this.commentsCount++;
    this.props.comments.unshift(createComment);
    this.setState({ commentValue: "" });
  };

  fetchMore = cursor => () => {
    console.log(this);
    const fetchMore = this.props.fetchMore;
    const query = gql`
      query getMoreComments(
        $type: String!
        $id: ID!
        $cursor: String!
        $limit: Int
      ) {
        getMoreComments(type: $type, id: $id, cursor: $cursor, limit: $limit) {
          id
          comment
          date
          userId {
            id
            name
          }
        }
      }
    `;
    const variables = {
      type: this.props.to,
      id: this.props.toId,
      cursor: cursor,
      limit: this.limit
    };

    fetchMore({
      query,
      variables,
      updateQuery: (previousResult, { fetchMoreResult }) => {
        console.log("++", previousResult, fetchMoreResult);
        console.log("--", previousResult, fetchMoreResult);

        if (this.props.to === "post") {
          console.log("inside");
          return {
            ...previousResult,
            post: {
              ...previousResult.post,
              comments: [
                ...previousResult.post.comments,
                ...fetchMoreResult.getMoreComments
              ]
            }
          };
        } else {
          console.log("answers indside");
          previousResult = JSON.parse(JSON.stringify(previousResult));
          const index = previousResult.post.answers.findIndex(val => {
            if (val.id === this.props.toId) return true;
            else return false;
          });
          console.log(index);
          let prevComments = previousResult.post.answers[index].comments;
          prevComments.push(...fetchMoreResult.getMoreComments);
          return previousResult;
        }
      }
    });
  };

  render() {
    const {
      classes,
      comments,
      userInfo,
      networkStatus,
      commentsCount
    } = this.props;
    console.log(this.props, this.commentsCount);
    return (
      <div className={classes.commentBox}>
        <div className={classes.commentFlex}>
          <Mutation
            mutation={gql`
              mutation CreateComment($commentInput: CommentInput!) {
                createComment(data: $commentInput) {
                  id
                  comment
                  date
                  userId {
                    id
                    name
                  }
                }
              }
            `}
            onCompleted={this.handleOnComplete}
          >
            {(createComment, { loading, error, data }) => {
              let cursor = "123";
              if (networkStatus === 3) {
                this.showLoadMore = false;
              }
              if (error) console.log("error---", error);
              if (data) {
                console.log("data-", data);
              }
              return (
                <>
                  <TextField
                    className={classes.commentLeft}
                    id="outlined-bare"
                    value={this.state.commentValue}
                    autoFocus={true}
                    placeholder={
                      userInfo ? "Enter your comment here" : "Login to comment"
                    }
                    disabled={userInfo ? false : true}
                    margin="normal"
                    required={true}
                    fullWidth={true}
                    variant="outlined"
                    multiline={true}
                    onChange={this.handleCommentValue}
                  />
                  <Button
                    disabled={userInfo ? false : true}
                    color={"primary"}
                    variant={"contained"}
                    style={{ margin: "15px" }}
                    onClick={() => this.handleSubmit(createComment)}
                  >
                    <SendIcon className={classes.icon} />
                  </Button>
                </>
              );
            }}
          </Mutation>
        </div>
        {comments.length === 0 ? (
          <Typography variant="body2" align="center">
            No comments yet
          </Typography>
        ) : (
          <>
            {comments.map(x => (
              <div key={x.id}>
                <Divider />
                <Typography variant="body2">
                  {x.comment}
                  <span className={classes.commentAuthor}>
                    &nbsp;-{" "}
                    <Link
                      className={classes.anchor}
                      to={{
                        pathname: "/profile",
                        state: { userId: x.userId.id }
                      }}
                    >
                      {x.userId.name}
                    </Link>
                    &nbsp;&nbsp;{formatDate(x.date)}
                  </span>
                </Typography>
              </div>
            ))}
            <div className={classes.centerFlex}>
              {comments.length < this.commentsCount ? (
                this.props.networkStatus === 3 ? (
                  <PongSpinner color={"#3f51b5"} />
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.fetchMore(comments[comments.length - 1].date)}
                  >
                    load more
                  </Button>
                )
              ) : (
                <Typography variant="caption" align={"center"} gutterBottom>
                  ---<span style={{ verticalAlign: "sub" }}>*</span>---
                </Typography>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

CommentBlock.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CommentBlock);
