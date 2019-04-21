import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Link, withRouter} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Create from "@material-ui/icons/Create";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import SocialShare from "./socialShare";
import formatDate from "./Date";
import Vote from "./vote";
import Auth from "../Auth";

const styles = {
    card: {
        marginBottom: "1em"
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
    time: {
        color: "rgb(120, 120, 120)"
    },
    bullet: {
        display: "inline-block",
        margin: "0 5px",
        transform: "scale(0.8)"
    },
    title: {
        fontSize: 14
    },
    span: {
        float: "right"
    },
    noans: {
        display: "flex",
        color: "rgb(120, 120, 120)"
    },
    ans: {
        display: "-webkit-box",
        "-webkit-line-clamp": 3,
        "-webkit-box-orient": "vertical",
        overflow: "hidden"
    },
    anchor: {
        "&:link": {
            textDecoration: "none"
        },
        "&:hover": {
            color: "inherit",
            textDecoration: "underline"
        },
        "&:visited": {},
        curser: "pointer"
    },
    actionButton: {
        alignItems: "center",
        flexGrow: 1,
        flexWrap: "wrap",
        display: "flex"
    }
};

class SimpleAnswerCard extends Component {
    constructor(props) {
        super(props);
        const voteObj = this.props.data.votes;
        this.state = {
            voteId: voteObj ? (voteObj.length > 0 ? voteObj[0].id : null) : null,
            userVoteValue: voteObj ? (voteObj.length > 0 ? voteObj[0].value : 0) : 0
        };
    }

    handleOnClickMutation = (fun, val) => {
        const {userInfo, to} = this.props;
        const {voteId, userVoteValue} = this.state;
        console.log("enter");
        if (userInfo === null) {
            alert("you need to login");
            return;
        }
        fun({
            variables: {
                data: {
                    value:
                        userVoteValue !== null ? (userVoteValue === val ? 0 : val) : val,
                    userId: userInfo.id,
                    to: to,
                    toId: this.props.data.id
                }
            }
        });
    };

    render() {
        const {data, classes, userInfo, to} = this.props;
        const {id, answer, postId, voteValue, createdDate, userId, votes} = data;
        const {voteId, userVoteValue} = this.state;
        const voteShowValue =
            -(votes ? (votes.length > 0 ? votes[0].value : 0) : 0) +
            voteValue +
            userVoteValue;
        //const description = data.description.replace(/<\/?[^>]+>/ig, " ").trim();

        //const bull = <span className={classes.bullet}>â¢</span>;

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                    >
                        Answer
                    </Typography>

                    <Link to={`/q/${postId.id}`} className={classes.anchor}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {postId.heading}
                        </Typography>
                    </Link>

                    <div>
                        <div className={classes.author}>
                            <Avatar
                                src={
                                    userId.profilePicture ? userId.profilePicture : "/nopic.jpg"
                                }
                            />
                            <div className={classes.avatarDiv}>
                                <Typography>{userId.name}</Typography>
                                {userId.department && (
                                    <Typography className={classes.time}>
                                        {userId.department +
                                        ", " +
                                        userId.job +
                                        ", " +
                                        userId.location}
                                    </Typography>
                                )}
                                <Typography className={classes.time}>
                                    {formatDate(createdDate)}
                                </Typography>
                            </div>
                        </div>
                        <Typography className={classes.ans}>
                            {answer.replace(/<\/?[^>]+>/gi, " ").trim()}
                        </Typography>
                    </div>
                </CardContent>
                <CardActions>
                    <div className={classes.actionButton}>
                        <Vote
                            userInfo={userInfo}
                            votes={votes}
                            voteValue={voteValue}
                            id={id}
                            to={to}
                        />
                    </div>
                    <SocialShare
                        title={postId.heading}
                        url={window.location.origin + "/q/" + postId.id + "/" + id}
                    />
                </CardActions>
            </Card>
        );
    }
}

SimpleAnswerCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SimpleAnswerCard));
