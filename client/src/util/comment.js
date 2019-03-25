import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import formatDate from "../util/Date";

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
  }
};

class CommentBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentValue: ""
    };
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
    this.props.comments.unshift(createComment);
    this.setState({ commentValue: "" });
  };

  render() {
    const { classes, comments, userInfo } = this.props;
    console.log(comments);
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
                    name
                  }
                }
              }
            `}
            onCompleted={this.handleOnComplete}
          >
            {(createComment, { loading, error, data }) => {
              if (error) console.log("error---", error);
              if (data) console.log("data-", data);
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
          comments.map(x => (
            <div key={x.id}>
              <Divider />
              <Typography variant="body2">
                {x.comment}
                <span className={classes.commentAuthor}>
                  &nbsp;- {x.userId.name}&nbsp;&nbsp;{formatDate(x.date)}
                </span>
              </Typography>
            </div>
          ))
        )}
      </div>
    );
  }
}

CommentBlock.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CommentBlock);
