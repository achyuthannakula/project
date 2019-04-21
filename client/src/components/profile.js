import React, { Component } from "react";
import { withStyles } from "@material-ui/core/es/styles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SvgIcon from "@material-ui/core/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import RootRef from "@material-ui/core/RootRef";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import EmailIcon from "@material-ui/icons/Email";
import WorkIcon from "@material-ui/icons/Work";
import DomainIcon from "@material-ui/icons/Domain";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import Spinner from "../util/spinner";
import formatDate from "../util/Date";
import PongSpinner from "../util/pongSpinner";
import AnswerCard from "../util/answerCard";
import ErrorPage from "./error";

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
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
  profileImage: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    position: "relative"
  },
  profileEditButton: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  profileDescription: {
    flexGrow: 3,
    display: "flex",
    flexDirection: "column"
  },
  rootRight: {
    margin: "1em"
  },
  img: {
    width: "150px",
    height: "150px",
    margin: "20px"
  },
  detail: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      color: "#6a737d"
    },
    marginTop: "5px"
  },
  editButton: {
    marginTop: "1em"
  },
  input: {
    padding: "5px"
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
    "&:visited": {}
  },
  time: {
    display: "inline",
    color: "rgb(120, 120, 120)"
  },
  loadMore: {
    display: "flex",
    position: "relative",
    margin: "auto"
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.state = {
      userInfo: userInfo ? userInfo : null,
      tabValue: "answers",
      userEdit: false,
      editable:
        this.props.location.state &&
        userInfo &&
        this.props.location.state.userId === userInfo.id
          ? true
          : false
    };

    this.noPostsInPage = 10;
    this.paginationIndex = 1;
  }

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleTabChange = (event, value) => {
    this.noPostsInPage = 10;
    this.paginationIndex = 1;

    this.setState({ tabValue: value === 0 ? "answers" : "questions" });
  };

  handleOnEditCancelClick = () => {
    this.setState(oldState => ({
      userEdit: !oldState.userEdit,
      proPic: null
    }));
  };

  handleOnEditClick = (userUpdateFunc, data) => async () => {
    console.log(userUpdateFunc, data);
    const { email, profilePicture, deleteHash } = data;

    if (this.state.userEdit === true) {
      const name = this.nameRef.value;
      const department = this.departmentRef.value;
      const job = this.jobRef.value;
      const location = this.locationRef.value;
      console.log(this.state.proPic ? "yes" : "no");
      if (!(name && department && job && location)) {
        alert("Please fill all the blanks to save your details");
        return;
      }
      await userUpdateFunc({
        variables: {
          userUpdateInput: {
            email,
            name,
            department,
            job,
            location,
            deleteHash,
            profilePicture: this.state.proPic
              ? this.state.proPic
              : profilePicture
          }
        }
      });
    }
    this.setState(oldState => ({ userEdit: !oldState.userEdit }));
  };

  handleSaveCompleted = ({ userUpdate }) => {
    localStorage.setItem("userInfo", JSON.stringify(userUpdate));
    this.forceUpdate();
    window.location.reload();
  };

  handleOnImageUpload = e => {
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file.size);
    if (file.size > 2 * 1024 * 1000)
      return alert("Upload file should be less than 2MB");

    reader.onloadend = () => {
      console.log(reader.result);

      this.setState({ proPic: reader.result });
    };

    reader.readAsDataURL(file);
  };

  onImageUploadClick = () => {
    console.log(this.imageUploadRef);
    this.imageUploadRef.click();
  };

  fetchMore = (fetchMore, type) => () => {
    const { userInfo } = this.state;
    console.log(this.paginationIndex);
    this.paginationIndex < 1 ? 1 : (this.paginationIndex += 1);

    //type === 0 => answers
    //type === 1 => questions

    console.log(this.paginationIndex);
    if (type === 1)
      fetchMore({
        variables: {
          postId: this.props.match.params.postId,
          userId: userInfo ? userInfo.id : null,
          answerId: this.props.match.params.answerId
            ? this.props.match.params.answerId
            : null,
          paginationIndex: this.paginationIndex,
          noPostsInPage: this.noPostsInPage
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log(prev.postsById.length, prev, fetchMoreResult);

          if (!fetchMoreResult || fetchMoreResult.postsById.length === 0) {
            return prev;
          }
          return {
            postsById: [...prev.postsById, ...fetchMoreResult.postsById]
          };
        }
      });
    else
      fetchMore({
        variables: {
          id: this.props.location.state.userId,
          userId: userInfo ? userInfo.id : null,
          paginationIndex: this.paginationIndex,
          noPostsInPage: this.noPostsInPage
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log(prev.answers.length, prev, fetchMoreResult);

          if (!fetchMoreResult || fetchMoreResult.answers.length === 0) {
            return prev;
          }
          return {
            answers: [...prev.answers, ...fetchMoreResult.answers]
          };
        }
      });
  };

  render() {
    console.log("profile props", this.props);
    console.log("profile states", this.state);
    let prevCount = -1;
    console.log("++++prevCount-", prevCount);
    if (!this.props.location.state) return <ErrorPage />;
    const userProfileId = this.props.location.state.userId;
    const { classes } = this.props;
    const { tabValue, userEdit, userInfo, editable } = this.state;
    return (
      <Query
        query={gql`
          query UserDetails($id: ID!) {
            userAnswersCount(id: $id)
            userPostsCount(id: $id)
            userById(id: $id) {
              id
              name
              email
              username
              profilePicture
              job
              department
              location
              deleteHash
            }
          }
        `}
        variables={{ id: userProfileId }}
        fetchPolicy={"cache-and-network"}
      >
        {({ loading, data, error }) => {
          if (loading) return <Spinner />;
          if (error) {
            console.log(error);
            return <p>Error :(</p>;
          }
          const {
            name,
            email,
            department,
            job,
            location,
            profilePicture,
            deleteHash
          } = data.userById;
          const userAnswersCount = data.userAnswerCount;
          const userPostsCount = data.userPostsCount;
          const userData = data.userById;
          console.log(userData);
          return (
            <Grid container justify={"center"}>
              <Grid item xs={11} md={8}>
                <Breadcrumbs separator="›" arial-label="Breadcrumb">
                  <Link to="/" className={classes.anchor}>
                    Home
                  </Link>
                  <Typography color="textPrimary">
                    <b>Profile</b>
                  </Typography>
                </Breadcrumbs>
                <div className={classes.root}>
                  <Grid item xs={12} sm={4}>
                    <div className={classes.flex}>
                      <div className={classes.profileImage}>
                        <Avatar
                          src={
                            !this.state.proPic
                              ? profilePicture
                                ? profilePicture
                                : "/nopic.jpg"
                              : this.state.proPic
                          }
                          className={classes.img}
                        />
                        {userEdit && (
                          <IconButton
                            className={classes.profileEditButton}
                            onClick={this.onImageUploadClick}
                          >
                            <>
                              <SvgIcon id="EditIcon" opacity="0.58">
                                <path
                                  fill="#000000"
                                  d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"
                                />
                              </SvgIcon>
                              <input
                                ref={x => (this.imageUploadRef = x)}
                                type="file"
                                accept="/image.*/"
                                style={{ display: "none" }}
                                onChange={this.handleOnImageUpload}
                              />
                            </>
                          </IconButton>
                        )}
                      </div>
                      <div className={classes.profileDescription}>
                        <Typography
                          variant="overline"
                          align="center"
                          gutterBottom
                        >
                          {userEdit ? (
                            <TextField
                              required
                              inputRef={x => (this.nameRef = x)}
                              className={classes.input}
                              id="user-input"
                              placeholder="name"
                              defaultValue={name}
                              variant="outlined"
                            />
                          ) : (
                            name
                          )}
                        </Typography>
                        <Typography className={classes.detail} variant="body2">
                          <EmailIcon />
                          &nbsp;&nbsp;{email}
                        </Typography>
                        <Typography className={classes.detail} variant="body2">
                          <WorkIcon />
                          &nbsp;&nbsp;
                          {userEdit ? (
                            <TextField
                              required
                              id="user-input"
                              inputRef={x => (this.departmentRef = x)}
                              placeholder="Department"
                              defaultValue={department}
                              variant="outlined"
                            />
                          ) : (
                            department || "unknown"
                          )}
                        </Typography>
                        <Typography className={classes.detail} variant="body2">
                          <DomainIcon />
                          &nbsp;&nbsp;
                          {userEdit ? (
                            <TextField
                              required
                              id="user-input"
                              inputRef={x => (this.jobRef = x)}
                              placeholder="Community/Job"
                              defaultValue={job}
                              variant="outlined"
                            />
                          ) : (
                            job || "unknown"
                          )}
                        </Typography>
                        <Typography className={classes.detail} variant="body2">
                          <LocationCityIcon />
                          &nbsp;&nbsp;
                          {userEdit ? (
                            <TextField
                              required
                              id="user-input"
                              inputRef={x => (this.locationRef = x)}
                              placeholder="Location"
                              defaultValue={location}
                              variant="outlined"
                            />
                          ) : (
                            location || "unknown"
                          )}
                        </Typography>
                        {editable && (
                          <Mutation
                            mutation={gql`
                              mutation UpdateUser(
                                $userUpdateInput: UserUpdateInput
                              ) {
                                userUpdate(data: $userUpdateInput) {
                                  id
                                  name
                                  email
                                  username
                                  profilePicture
                                  job
                                  department
                                  location
                                }
                              }
                            `}
                            onCompleted={this.handleSaveCompleted}
                          >
                            {(userUpdate, { loading, error, data }) => {
                              if (loading) return <Spinner />;
                              if (error) {
                                console.log(error);
                                return <p>error :(</p>;
                              }
                              return (
                                <>
                                  <Button
                                    variant="outlined"
                                    color={userEdit ? "secondary" : "primary"}
                                    className={classes.editButton}
                                    onClick={this.handleOnEditClick(
                                      userUpdate,
                                      userData
                                    )}
                                  >
                                    {(!userEdit && "Edit") || "Save"}
                                  </Button>
                                  {userEdit && (
                                    <Button
                                      variant="outlined"
                                      color={"primary"}
                                      className={classes.editButton}
                                      onClick={this.handleOnEditCancelClick}
                                    >
                                      {"cancel"}
                                    </Button>
                                  )}
                                </>
                              );
                            }}
                          </Mutation>
                        )}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Tabs
                      value={tabValue === "answers" ? 0 : 1}
                      onChange={this.handleTabChange}
                      indicatorColor="secondary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab
                        label={
                          <Typography>
                            Answers&nbsp;
                            <Typography className={classes.time}>
                              {data.userAnswersCount}
                            </Typography>
                          </Typography>
                        }
                      />
                      <Tab
                        label={
                          <Typography>
                            Questions&nbsp;
                            <Typography className={classes.time}>
                              {data.userPostsCount}
                            </Typography>
                          </Typography>
                        }
                      />
                    </Tabs>
                    {tabValue === "answers" && (
                      <div className={classes.rootRight}>
                        <Query
                          query={gql`
                            query UserAnswers(
                              $id: ID!
                              $userId: ID
                              $paginationIndex: Int
                              $noPostsInPage: Int
                            ) {
                              answers(
                                id: $id
                                userId: $userId
                                paginationIndex: $paginationIndex
                                noPostsInPage: $noPostsInPage
                              ) {
                                id
                                answer
                                userId {
                                  id
                                  name
                                  profilePicture
                                  department
                                  job
                                  location
                                }
                                createdDate
                                postId {
                                  id
                                  heading
                                }
                                voteValue
                                votes {
                                  id
                                  value
                                }
                              }
                            }
                          `}
                          variables={{
                            id: userProfileId,
                            userId: userInfo ? userInfo.id : null
                          }}
                          notifyOnNetworkStatusChange
                          fetchPolicy={"no-cache"}
                        >
                          {({
                            loading,
                            data,
                            error,
                            fetchMore,
                            networkStatus
                          }) => {
                            if (networkStatus === 1) {
                              console.log("first loading");
                              prevCount = -1;
                              return <Spinner />;
                            }
                            if (error) {
                              console.log(error);
                              return <p>Error :(</p>;
                            }
                            console.log("after loading");
                            if (data.answers.length === 0)
                              return <p>No Answers</p>;
                            let hasNext = false;

                            if (prevCount !== data.answers.length)
                              hasNext = true;
                            console.log(
                              "///",
                              hasNext,
                              prevCount,
                              data.answers.length
                            );
                            prevCount = data.answers.length;
                            return (
                              <>
                                {data.answers.map(answer => (
                                  <AnswerCard
                                    key={answer.id}
                                    data={answer}
                                    userInfo={userInfo}
                                    to="answer"
                                  />
                                ))}
                                <div className={classes.centerFlex}>
                                  {userAnswersCount > data.answers.length ? (
                                    loading ? (
                                      <div>
                                        <PongSpinner color={"#3f51b5"} />
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.fetchMore(fetchMore, 0)}
                                      >
                                        load more
                                      </Button>
                                    )
                                  ) : (
                                    <Typography
                                      variant="caption"
                                      align={"center"}
                                      gutterBottom
                                    >
                                      ---
                                      <span style={{ verticalAlign: "sub" }}>
                                        *
                                      </span>
                                      ---
                                    </Typography>
                                  )}
                                </div>
                              </>
                            );
                          }}
                        </Query>
                      </div>
                    )}
                    {tabValue === "questions" && (
                      <div className={classes.rootRight}>
                        <Query
                          query={gql`
                            query UserQuestions(
                              $id: ID!
                              $paginationIndex: Int
                              $noPostsInPage: Int
                            ) {
                              postsById(
                                id: $id
                                paginationIndex: $paginationIndex
                                noPostsInPage: $noPostsInPage
                              ) {
                                id
                                heading
                                createdDate
                              }
                            }
                          `}
                          variables={{
                            id: userProfileId,
                            paginationIndex: this.paginationIndex,
                            noPostsInPage: this.noPostsInPage
                          }}
                          notifyOnNetworkStatusChange
                          fetchPolicy={"no-cache"}
                        >
                          {({
                            loading,
                            data,
                            error,
                            fetchMore,
                            networkStatus
                          }) => {
                            console.log("--", networkStatus);
                            if (networkStatus === 1) {
                              prevCount = -1;
                              return <Spinner />;
                            }
                            if (error) {
                              console.log(error);
                              return <p>Error :(</p>;
                            }
                            console.log(data);

                            if (data.postsById.length === 0)
                              return <p>No Questions</p>;
                            let hasNext = false;
                            if (prevCount !== data.postsById.length)
                              hasNext = true;
                            prevCount = data.postsById.length;
                            return (
                              <>
                                {data.postsById.map(post => (
                                  <div
                                    key={post.id}
                                    style={{ marginBottom: "1em" }}
                                  >
                                    <Link
                                      to={`/q/${post.id}`}
                                      className={classes.anchor}
                                    >
                                      <Typography variant="h6" component="h2">
                                        {post.heading}
                                      </Typography>
                                    </Link>
                                    <Typography className={classes.time}>
                                      Asked {formatDate(post.createdDate)}
                                    </Typography>
                                    <Divider />
                                  </div>
                                ))}
                                {console.log("updated")}
                                <div className={classes.centerFlex}>
                                  {userPostsCount > data.postsById.length ? (
                                    loading ? (
                                      <div>
                                        <PongSpinner color={"#3f51b5"} />
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={this.fetchMore(fetchMore, 1)}
                                      >
                                        load more
                                      </Button>
                                    )
                                  ) : (
                                    <Typography
                                      variant="caption"
                                      align={"center"}
                                      gutterBottom
                                    >
                                      ---
                                      <span style={{ verticalAlign: "sub" }}>
                                        *
                                      </span>
                                      ---
                                    </Typography>
                                  )}
                                </div>
                              </>
                            );
                          }}
                        </Query>
                      </div>
                    )}
                  </Grid>
                </div>
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(withStyles(styles)(Profile));
