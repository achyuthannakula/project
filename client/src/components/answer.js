import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Create from "@material-ui/icons/Create";
import Comment from "@material-ui/icons/Comment";
import Button from "@material-ui/core/Button";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import SingleAnswer from "../util/singleAnswer";
import AnswerEditor from "../util/answerEditor";
import Spinner from "../util/spinner";
import Vote from "../util/vote";
import CommentBlock from "../util/comment";
import SocialShare from "../util/socialShare";

const answerStyles = {
  grid: {
    justifyContent: "center"
  },
  bold: {
    fontWeight: "bold"
  },
  left: {
    alignItems: "center",
    flexGrow: 1,
    display: "flex"
  },
  right: {
    display: "flex"
  },
  flex: {
    display: "flex",
    flexWrap: "wrap"
  },
  time: {
    color: "rgb(120, 120, 120)"
  },
  author: {
    display: "flex",
    margin: "10px 0px",
    alignItems: "center"
  },
  avatarDiv: {
    display: "flex",
    alignItems: "flex-initial",
    margin: "10px",
    flexDirection: "column"
  },
  answer: {
    letterSpacing: "1px"
  },
  center: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "1em"
  },
  icon: {
    fontSize: 20,
    marginLeft: "5px"
  }
};

class Answer extends Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.state = {
      commentOpen: false,
      userInfo: userInfo,
      showEditor: false
    };
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.showEditor)
      this.handleAddAnswer();
  }

  handelCommentClick = () => {
    this.setState(oldState => ({
      commentOpen: !oldState.commentOpen
    }));
  };

  handleAddAnswer = () => {
    if (!this.state.userInfo) {
      alert("You need to Login to Answer");
      return;
    }
    this.setState(oldState => ({
      showEditor: !oldState.showEditor
    }));
  };

  handleForceCloseEditor = () => this.setState({ showEditor: false });

  render() {
    const { classes } = this.props;
    console.log(this.state.userInfo);
    console.log("answer props-", this.props);
    return (
      <Query
        query={gql`
          query AnswerData($postId: ID!, $userId: ID, $answerId: ID) {
            post(postId: $postId, userId: $userId, answerId: $answerId) {
              id
              heading
              description
              voteValue
              votes {
                id
                value
              }
              createdDate
              comments {
                id
                comment
                date
                userId {
                  name
                }
              }
              answers {
                id
                answer
                createdDate
                userId {
                  name
                  profilePicture
                }
                voteValue
                votes {
                  id
                  value
                }
                comments {
                  id
                  comment
                  date
                  userId {
                    name
                  }
                }
              }
            }
          }
        `}
        variables={{
          postId: this.props.match.params.postId,
          userId: this.state.userInfo ? this.state.userInfo.id : null,
          answerId: this.props.match.params.answerId
            ? this.props.match.params.answerId
            : null
        }}
        fetchPolicy={"cache-and-network"}
      >
        {({ loading, error, data, refetch }) => {
          if (loading) console.log("loading");
          if (loading) return <Spinner />;
          if (error) return <p>Error :(</p>;
          if (data) {
            console.log("data--", data);
          }

          const post = data.post;
          const answerCount = post.answers.length;
          console.log("--", post);
          return (
            <Grid container className={classes.grid}>
              <Grid item xs={11} md={8}>
                <div id={"Question"}>
                  <Typography className={classes.bold} variant="headline">
                    {post.heading}
                  </Typography>
                  {post.description && (
                    <div
                      dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                  )}
                  <div className={classes.flex}>
                    <div className={classes.left}>
                      <Tooltip title="Answer">
                        <IconButton onClick={this.handleAddAnswer}>
                          <Create />
                        </IconButton>
                      </Tooltip>
                      <Vote
                        userInfo={this.state.userInfo}
                        votes={post.votes}
                        voteValue={post.voteValue}
                        id={post.id}
                        to={"post"}
                      />
                    </div>
                    <div className={classes.right}>
                      <IconButton
                        color={this.state.commentOpen ? "primary" : "default"}
                        onClick={this.handelCommentClick}
                      >
                        <Tooltip title="Comment">
                          <Comment />
                        </Tooltip>
                      </IconButton>
                      <SocialShare
                        title={post.heading}
                        url={window.location.origin + "/" + post.id}
                      />
                    </div>
                  </div>
                  {this.state.commentOpen && (
                    <CommentBlock
                      comments={post.comments}
                      userInfo={this.state.userInfo}
                      to={"post"}
                      toId={post.id}
                    />
                  )}
                  {!this.props.match.params.answerId && (
                    <Typography variant="h6" gutterBottom>
                      {answerCount} Answers
                    </Typography>
                  )}
                </div>
                <Divider />
                {this.state.showEditor && (
                  <AnswerEditor
                    userInfo={this.state.userInfo}
                    postId={post.id}
                    handleClose={this.handleForceCloseEditor}
                  />
                )}
                {answerCount === 0 && (
                  <div>
                    <div className={classes.center}>
                      <Typography variant="body1">
                        Be the first to answer this question
                      </Typography>
                    </div>
                    <div className={classes.center}>
                      <Button
                        color={"primary"}
                        variant={"contained"}
                        children={"Add Answer"}
                        onClick={() => this.handleAddAnswer()}
                      />
                    </div>
                  </div>
                )}
                {post.answers.map(x => (
                  <SingleAnswer
                    classes={classes}
                    userInfo={this.state.userInfo}
                    postHeading={post.heading}
                    postId={post.id}
                    key={x.id}
                    answer={x}
                  />
                ))}
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

Answer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(answerStyles)(Answer);
