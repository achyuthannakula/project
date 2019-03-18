import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import TUp from "@material-ui/icons/ThumbUp";
import TDn from "@material-ui/icons/ThumbDown";
import Create from "@material-ui/icons/Create";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";

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
        "&:visited": {}
    },
    actionButton: {
        alignItems: "center",
        flexGrow: 1,
        flexWrap: "wrap",
        display: "flex"
    }
};

class SimpleCard extends Component{

    constructor(props){
        super(props);
        const voteObj = this.props.data.votes;
        this.state = {
            voteId: voteObj.length > 0 ? voteObj[0].id : null,
            userVoteValue: voteObj.length > 0 ? voteObj[0].value : 0
        }
    }

    format = (date) => {
        const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        date = new Date(parseInt(date));
        const ourDate = new Date();
        const dateObject = {
            M: date.getMonth(),
            d: date.getDate(),
            h: date.getHours(),
            m: date.getMinutes(),
            y: date.getFullYear()
        };
        const ourDateObject = {
            M: ourDate.getMonth(),
            d: ourDate.getDate(),
            h: ourDate.getHours(),
            m: ourDate.getMinutes(),
            y: ourDate.getFullYear()
        };
        console.log(date,"-",ourDate,dateObject,ourDateObject);
        if (dateObject.y !== ourDateObject.y)
            return monthNames[dateObject.M] +" "+ dateObject.y;
        else if (dateObject.M !== ourDateObject.M)
            return monthNames[dateObject.M] +" "+ dateObject.d;
        else {
            let diff = 0;
            if (dateObject.d !== ourDateObject.d) {
                diff = (ourDateObject.d - dateObject.d) * 24 - dateObject.h + ourDateObject.h;
                if (diff >= 24)
                    return dateObject.d +", "+ monthNames[dateObject.M];
                else if(diff !== 0)
                    return diff + " hr's ago";
            }
            diff = (ourDateObject.h - dateObject.h) * 60 - dateObject.m + ourDateObject.m;
            return diff + " min's ago";
        }
    };


    render(){
        console.log(this.state);
        const { data, classes } = this.props;
        const { heading, voteValue, createdDate, userId , answers} = data;

        const { voteId, userVoteValue } = this.state;
        //const description = data.description.replace(/<\/?[^>]+>/ig, " ").trim();
        const ansCount = answers.length;
        //const bull = <span className={classes.bullet}>•</span>;


        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                    >
                        Question
                    </Typography>

                    <Link to="./" className={classes.anchor}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {heading}
                        </Typography>
                    </Link>

                    {ansCount === 0 ?
                        <Typography className={classes.noans}>
                            No answer yet<span className={classes.bullet}>·</span>
                            <Typography className={classes.time}>{this.format(createdDate)}</Typography>
                        </Typography> :
                        (<div>
                            <div className={classes.author}>
                                <Avatar onClick={this.handleAvatarClick} src = {answers[0].userId.profilePicture ? answers[0].userId.profilePicture : '/nopic.jpg'}/>
                                <div className={classes.avatarDiv}>
                                    <Typography>{answers[0].userId.name}</Typography>
                                    <Typography className={classes.time}>{this.format(answers[0].createdDate)}</Typography>
                                </div>
                            </div>
                            <Typography className={classes.ans}>{answers[0].answer.replace(/<\/?[^>]+>/ig, " ").trim()}</Typography>
                        </div>)
                    }
                </CardContent>
                <CardActions>
                    <div className={classes.actionButton}>
                        <Tooltip title="Answer">
                            <IconButton>
                                <Create />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Thubms Up">
                            <IconButton color={userVoteValue > 0 ? "primary" : "default"}>
                                <TUp/>
                            </IconButton>
                        </Tooltip>
                        <Typography>{voteValue}</Typography>
                        <Tooltip title="Thumbs Down" color={userVoteValue < 0 ? "primary" : "default"}>
                            <IconButton>
                                <TDn/>
                            </IconButton>
                        </Tooltip>
                    </div>

                    <IconButton>
                        <Tooltip title="Share">
                            <ShareIcon />
                        </Tooltip>
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}

SimpleCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
