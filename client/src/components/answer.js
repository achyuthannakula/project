import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link, withRouter } from "react-router-dom";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import TextField from "@material-ui/core/TextField";
import Create from "@material-ui/icons/Create";
import Comment from "@material-ui/icons/Comment";
import Save from "@material-ui/icons/Save";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import SingleAnswer from "../util/singleAnswer";
import AnswerEditor from "../util/answerEditor";
import Spinner from "../util/spinner";
import Vote from "../util/vote";
import CommentBlock from "../util/comment";
import PongSpinner from "../util/pongSpinner";
import SocialShare from "../util/socialShare";
import ErrorPage from "./error";
import ReactQuillUtil from "../util/reactQuillUtil";
import ReactQuill from "react-quill";

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
  centerFlex: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
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
  },
  anchor: {
    color: "inherit",
    "&:link": {
      textDecoration: "none"
    },
    "&:hover": {
      color: "inherit",
      textDecoration: "underline"
    },
    "&:visited": {},
    cursor: "pointer"
  }
};

class Answer extends Component {
  constructor(props) {
    super(props);
    console.log(localStorage.getItem("userInfo"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.state = {
      commentOpen: false,
      userInfo: userInfo,
      showEditor: false,
      edit: false
    };
    this.descriptionRef = React.createRef();

    this.noPostsInPage = 5;
    this.paginationIndex = 1;
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

  handleOnClickEdit = (question, description) => () => {
    this.setState(oldState => ({
      question,
      description,
      edit: !oldState.edit
    }));
  };

  handleOnSaveComplete = ({ updatePost }) => {
    console.log("on completed", updatePost);
    this.setState({ edit: false });

    /*console.log(
      this.questionRef.value,
      this.descriptionRef.current.state.value
    );*/
  };

  onEditSubmit = (updatePost, postId) => event => {
    const descValue = this.descriptionRef.current
      ? this.descriptionRef.current.state.value
      : null;
    console.log(
      "desc",
      this.descriptionRef,
      descValue,
      descValue && descValue.length > 0 ? descValue : null
    );
    return updatePost({
      variables: {
        email: this.state.userInfo.email,
        postId: postId,
        question: this.questionRef.value,
        description: this.getDescValue(descValue)
      }
    });
  };

  getDescValue = desc => {
    const x = "<p><br></p>";
    const y =
      "<div class='ql-snow'><div class='ql-editor'><p><br></p></div></div>";
    if (
      !desc ||
      (desc.startsWith(x) && desc.length === x.length) ||
      desc.indexOf(y) === 0
    )
      return null;
    if (desc.startsWith("<div class='ql-snow'><div class='ql-editor'>"))
      return desc;
    return (
      "<div class='ql-snow'><div class='ql-editor'>" + desc + "</div></div>"
    );
  };

  fetchMore = (fetchMore, postData) => () => {
    const query = gql`
      query MoreAnswers(
        $postId: ID!
        $userId: ID
        $paginationIndex: Int!
        $noPostsInPage: Int!
      ) {
        moreAnswers(
          postId: $postId
          userId: $userId
          paginationIndex: $paginationIndex
          noPostsInPage: $noPostsInPage
        ) {
          id
          answer
          createdDate
          userId {
            id
            name
            profilePicture
            department
            job
            location
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
              id
              name
            }
          }
          commentsCount
        }
      }
    `;
    this.paginationIndex++;
    const variables = {
      postId: this.props.match.params.postId,
      userId: this.state.userInfo ? this.state.userInfo.id : null,
      paginationIndex: this.paginationIndex,
      noPostsInPage: this.noPostsInPage
    };
    fetchMore({
      query,
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log(prev, fetchMoreResult);
        prev = JSON.parse(JSON.stringify(prev));
        prev.post.answers = [
          ...prev.post.answers,
          ...fetchMoreResult.moreAnswers
        ];
        return prev;
      }
    });
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.userInfo);
    console.log("answer props-", this.props);
    console.log("answer states-", this.state);
    const { edit, userInfo } = this.state;
    return (
      <Query
        query={gql`
          query AnswerData(
            $postId: ID!
            $userId: ID
            $answerId: ID
            $noPostsInPage: Int
          ) {
            postAnswersCount(postId: $postId)
            post(
              postId: $postId
              userId: $userId
              answerId: $answerId
              noPostsInPage: $noPostsInPage
            ) {
              id
              heading
              description
              voteValue
              votes {
                id
                value
              }
              userId {
                id
              }
              createdDate
              comments {
                id
                comment
                date
                userId {
                  id
                  name
                }
              }
              commentsCount
              answers {
                id
                answer
                createdDate
                userId {
                  id
                  name
                  profilePicture
                  department
                  job
                  location
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
                    id
                    name
                  }
                }
                commentsCount
              }
            }
          }
        `}
        variables={{
          postId: this.props.match.params.postId,
          userId: userInfo ? userInfo.id : null,
          answerId: this.props.match.params.answerId
            ? this.props.match.params.answerId
            : null,
          noPostsInPage: this.noPostsInPage
        }}
        notifyOnNetworkStatusChange
        fetchPolicy={"cache-and-network"}
      >
        {({ loading, error, data, fetchMore, networkStatus }) => {
          //https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
          console.log("networkStatus", networkStatus);
          if (networkStatus === 1) {
            console.log("in first loadingf");
            return <Spinner />;
          }
          if (error) return <ErrorPage />;
          if (data) {
            console.log("data--", data);
          }

          const post = data.post;
          const totalAnswersCount = data.postAnswersCount;
          const answersCount = post.answers.length;
          const pageType = this.props.match.params.answerId
            ? "answer"
            : "question";
          console.log("--", post);
          return (
            <Grid container className={classes.grid}>
              <Grid item xs={11} md={8}>
                <Breadcrumbs separator="›" arial-label="Breadcrumb">
                  <Link to="/" className={classes.anchor}>
                    Home
                  </Link>
                  {pageType === "question" ? (
                    <Typography color="textPrimary">
                      <b>Question</b>
                    </Typography>
                  ) : (
                    [
                      <Link to={"/q/" + post.id} className={classes.anchor}>
                        Question
                      </Link>,
                      <Typography color="textPrimary">
                        <b>Answer</b>
                      </Typography>
                    ]
                  )}
                </Breadcrumbs>
                <div id={"Question"}>
                  {!edit && (
                    <>
                      <Typography className={classes.bold} variant="headline">
                        {post.heading}
                      </Typography>
                      {post.description && (
                        <div
                          dangerouslySetInnerHTML={{ __html: post.description }}
                        />
                      )}
                    </>
                  )}
                  {edit && (
                    <>
                      <Typography className={classes.bold} variant="headline">
                        <TextField
                          id="question"
                          inputRef={x => (this.questionRef = x)}
                          label="Question"
                          defaultValue={this.state.question}
                          margin="normal"
                          fullWidth={true}
                          autoFocus={true}
                          autoComplete={"off"}
                          placeholder={"Enter Your Question"}
                        />
                      </Typography>
                      <ReactQuill
                        className={classes.editor}
                        ref={this.descriptionRef}
                        theme={"snow"}
                        defaultValue={this.state.description}
                        modules={ReactQuillUtil.modules}
                        formats={ReactQuillUtil.formats}
                        placeholder={"Enter the text here..."}
                      />
                    </>
                  )}

                  <div className={classes.flex}>
                    <div className={classes.left}>
                      <Tooltip title="Answer">
                        <IconButton onClick={this.handleAddAnswer}>
                          <Create />
                        </IconButton>
                      </Tooltip>
                      {userInfo &&
                        userInfo.id === post.userId.id &&
                        (!edit ? (
                          <IconButton
                            onClick={this.handleOnClickEdit(
                              post.heading,
                              post.description
                            )}
                          >
                            <SvgIcon id="EditIcon" opacity="0.58">
                              <path
                                fill="#000000"
                                d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"
                              />
                            </SvgIcon>
                          </IconButton>
                        ) : (
                          <>
                            <Mutation
                              mutation={gql`
                                mutation UpdatePost(
                                  $email: String!
                                  $postId: ID!
                                  $question: String!
                                  $description: String
                                ) {
                                  updatePost(
                                    email: $email
                                    postId: $postId
                                    question: $question
                                    description: $description
                                  ) {
                                    id
                                    heading
                                    description
                                  }
                                }
                              `}
                              onCompleted={this.handleOnSaveComplete}
                            >
                              {(updatePost, { data, error, loading }) => {
                                if (error) return <p>Error :(</p>;

                                return (
                                  <IconButton
                                    onClick={this.onEditSubmit(
                                      updatePost,
                                      post.id
                                    )}
                                  >
                                    <Save />
                                  </IconButton>
                                );
                              }}
                            </Mutation>
                            <IconButton
                              onClick={() => this.setState({ edit: false })}
                            >
                              <SvgIcon id="cancelIcon" opacity="0.58">
                                <path
                                  fill="#000000"
                                  d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z"
                                />
                              </SvgIcon>
                            </IconButton>
                          </>
                        ))}
                      <Vote
                        userInfo={userInfo}
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
                        url={window.location.origin + "/q/" + post.id}
                      />
                    </div>
                  </div>
                  {this.state.commentOpen && (
                    <CommentBlock
                      comments={post.comments}
                      userInfo={userInfo}
                      to={"post"}
                      toId={post.id}
                      fetchMore={fetchMore}
                      networkStatus={networkStatus}
                      commentsCount={post.commentsCount}
                    />
                  )}
                  {!this.props.match.params.answerId && (
                    <Typography variant="h6" gutterBottom>
                      {totalAnswersCount} Answers
                    </Typography>
                  )}
                </div>
                <Divider />
                {this.state.showEditor && (
                  <AnswerEditor
                    userInfo={userInfo}
                    postId={post.id}
                    handleClose={this.handleForceCloseEditor}
                  />
                )}
                {answersCount === 0 && (
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
                    userInfo={userInfo}
                    postHeading={post.heading}
                    postId={post.id}
                    key={x.id}
                    answer={x}
                    fetchMore={fetchMore}
                  />
                ))}
                <div
                  className={classes.centerFlex}
                  style={{ marginTop: "1em" }}
                >
                  {pageType === "question" &&
                  answersCount < totalAnswersCount ? (
                    loading ? (
                      <PongSpinner color={"#3f51b5"} />
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.fetchMore(fetchMore, data)}
                      >
                        loadmore
                      </Button>
                    )
                  ) : (
                    <Typography variant="caption" align={"center"} gutterBottom>
                      ---<span style={{ verticalAlign: "sub" }}>*</span>---
                    </Typography>
                  )}
                </div>
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
