import React, {Component} from "react";
import Divider from "@material-ui/core/Divider";
import {withRouter} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import Comment from "@material-ui/icons/Comment";
import Save from "@material-ui/icons/Save";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";
import ReactQuill from "react-quill";
import formatDate from "./Date";
import Vote from "./vote";
import CommentBlock from "../util/comment";
import SocialShare from "./socialShare";
import ReactQuillUtil from "../util/reactQuillUtil";

class SingleAnswer extends Component {
    constructor(props) {
        super(props);
        const voteObj = this.props.answer.votes;
        this.state = {
            commentOpen: false,
            voteId: voteObj ? (voteObj.length > 0 ? voteObj[0].id : null) : null,
            userVoteValue: voteObj ? (voteObj.length > 0 ? voteObj[0].value : 0) : 0,
            edit: false
        };

        this.answerRef = React.createRef();
    }

    handelCommentClick = () => {
        this.setState(oldState => ({
            commentOpen: !oldState.commentOpen
        }));
    };

    onVoteCompleted = ({createOrUpdateVote}) => {
        console.log("the end", createOrUpdateVote);
        this.setState({
            voteId: createOrUpdateVote.id,
            userVoteValue: createOrUpdateVote.value
        });
    };

    onEditSubmit = (updateAnswer, answerId) => event => {
        const answerVal = this.answerRef.current.state.value;
        const emptyAns = "<p><br></p>";
        if (
            answerVal &&
            !answerVal.startsWith(emptyAns) &&
            answerVal.length !== emptyAns.length
        )
            updateAnswer({
                variables: {
                    email: this.props.userInfo.email,
                    answerId: answerId,
                    answer: answerVal
                }
            });
        else alert("Answer can't be empty");
    };

    onEditCompleted = data => {
        console.log("new Data", data);
        this.setState({edit: false});
    };

    render() {
        const {classes, answer, userInfo, postHeading, postId} = this.props;
        const {edit} = this.state;
        return (
            <>
                <div className={classes.author}>
                    <Avatar src={answer.userId.profilePicture || "/nopic.jpg"}/>
                    <div className={classes.avatarDiv}>
                        <Typography
                            onClick={() =>
                                this.props.history.push({
                                    pathname: "/profile",
                                    state: {userId: answer.userId.id}
                                })
                            }
                            className={classes.anchor}
                        >
                            {answer.userId.name}
                        </Typography>
                        {answer.userId.department && (
                            <Typography className={classes.time}>
                                {answer.userId.department +
                                ", " +
                                answer.userId.job +
                                ", " +
                                answer.userId.location}
                            </Typography>
                        )}
                        <Typography className={classes.time}>
                            {formatDate(answer.createdDate)}
                        </Typography>
                    </div>
                </div>
                <Typography varient={"body1"} className={classes.answer}>
                    {!edit && (
                        <div className={"ql-snow"}>
                            <div
                                className={"ql-editor"}
                                dangerouslySetInnerHTML={{__html: answer.answer}}
                            />
                        </div>
                    )}
                    {edit && (
                        <ReactQuill
                            className={classes.editor}
                            ref={this.answerRef}
                            theme={"snow"}
                            defaultValue={answer.answer}
                            modules={ReactQuillUtil.modules}
                            formats={ReactQuillUtil.formats}
                            placeholder={"Enter the text here..."}
                        />
                    )}
                </Typography>
                <div className={classes.flex}>
                    <div className={classes.left}>
                        {userInfo && userInfo.id === answer.userId.id && !edit && (
                            <IconButton onClick={() => this.setState({edit: true})}>
                                <SvgIcon id="editIcon" opacity="0.58">
                                    <path
                                        fill="#000000"
                                        d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"
                                    />
                                </SvgIcon>
                            </IconButton>
                        )}
                        {edit && (
                            <>
                                <Mutation
                                    mutation={gql`
                                        mutation UpdateAnswer(
                                            $email: String!
                                            $answerId: ID!
                                            $answer: String!
                                        ) {
                                            updateAnswer(
                                                email: $email
                                                answerId: $answerId
                                                answer: $answer
                                            ) {
                                                id
                                                answer
                                            }
                                        }
                                    `}
                                    onCompleted={this.onEditCompleted}
                                >
                                    {(updateAnswer, {loading, data, error}) => {
                                        if (error) return <p>Error :(</p>;
                                        return (
                                            <IconButton
                                                onClick={this.onEditSubmit(updateAnswer, answer.id)}
                                            >
                                                <Save/>
                                            </IconButton>
                                        );
                                    }}
                                </Mutation>
                                <IconButton onClick={() => this.setState({edit: false})}>
                                    <SvgIcon id="cancelIcon" opacity="0.58">
                                        <path
                                            fill="#000000"
                                            d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z"
                                        />
                                    </SvgIcon>
                                </IconButton>
                            </>
                        )}
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
                                <Comment/>
                            </Tooltip>
                        </IconButton>
                        <SocialShare
                            title={postHeading}
                            url={window.location.origin + "/q/" + postId + "/" + answer.id}
                        />
                    </div>
                </div>
                {this.state.commentOpen && (
                    <CommentBlock
                        comments={answer.comments}
                        userInfo={userInfo}
                        to={"answer"}
                        toId={answer.id}
                        fetchMore={this.props.fetchMore}
                        networkStatus={this.props.networkStatus}
                        commentsCount={answer.commentsCount}
                    />
                )}
                <Divider/>
            </>
        );
    }
}

export default withRouter(SingleAnswer);
