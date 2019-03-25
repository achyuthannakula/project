import React, { Component } from "react";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Share from "@material-ui/icons/Share";
import Comment from "@material-ui/icons/Comment";
import formatDate from "./Date";
import Vote from "./vote";
import CommentBlock from "../util/comment";
import SocialShare from "./socialShare";

class SingleAnswer extends Component {
  constructor(props) {
    super(props);
    const voteObj = this.props.answer.votes;
    this.state = {
      commentOpen: false,
      voteId: voteObj ? (voteObj.length > 0 ? voteObj[0].id : null) : null,
      userVoteValue: voteObj ? (voteObj.length > 0 ? voteObj[0].value : 0) : 0
    };
  }

  handelCommentClick = () => {
    this.setState(oldState => ({
      commentOpen: !oldState.commentOpen
    }));
  };

  onVoteCompleted = ({ createOrUpdateVote }) => {
    console.log("the end", createOrUpdateVote);
    this.setState({
      voteId: createOrUpdateVote.id,
      userVoteValue: createOrUpdateVote.value
    });
  };

  render() {
    const { classes, answer, userInfo, postHeading, postId } = this.props;
    return (
      <>
        <div className={classes.author}>
          <Avatar src={answer.userId.profilePicture || "/nopic.jpg"} />
          <div className={classes.avatarDiv}>
            <Typography>{answer.userId.name}</Typography>
            <Typography className={classes.time}>
              {formatDate(answer.createdDate)}
            </Typography>
          </div>
        </div>
        <Typography varient={"body1"} className={classes.answer}>
          <div className={"ql-snow"}>
            <div
              className={"ql-editor"}
              dangerouslySetInnerHTML={{ __html: answer.answer }}
            />
          </div>
        </Typography>
        <div className={classes.flex}>
          <div className={classes.left}>
            <Vote
              userInfo={userInfo}
              votes={answer.votes}
              voteValue={answer.voteValue}
              id={answer.id}
              to={"answer"}
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
              title={postHeading}
              url={window.location.origin + "/" + postId + "/" + answer.id}
            />
          </div>
        </div>
        {this.state.commentOpen && (
          <CommentBlock
            comments={answer.comments}
            userInfo={userInfo}
            to={"answer"}
            toId={answer.id}
          />
        )}
        <Divider />
      </>
    );
  }
}

export default SingleAnswer;
