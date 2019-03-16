import React from "react";
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

function SimpleCard(props) {
    const { classes, data } = props;
    const { heading, voteValue, createdDate, userId , answers} = data;
    const description = data.description.replace(/<\/?[^>]+>/ig, " ").trim();
    const ansCount = answers.length;
    const bull = <span className={classes.bullet}>•</span>;
    const out =
        "I got married for the second time 15 years ago and my wife had a 15 year old daughter. Her daughter is 6′ tall and very shapely and pretty. She lost her father at the age of 7 to cancer so she went years without a father until I married her mother. I had told my wife that the day I marry her, her daughter will then be my daughter also and I treated her every bit as good as my own children including financing her college, paying rent, buying her supplies, etc. Her daughter loved having a Dad in her life a";

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const format =(date) => {
        console.log(typeof date,date);
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
        else if (dateObject.d !== ourDateObject.d)
            return dateObject.h+":"+dateObject.m +","+ dateObject.d;
        else {
            const diff = (ourDateObject.h - dateObject.h) * 60 - dateObject.m + ourDateObject.m;
            if ( diff > 60)
                return (ourDateObject.h - dateObject.h) + " hrs ago";
            else
                return diff + " min's ago";
        }
    };

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
                        <Typography className={classes.time}>{format(createdDate)}</Typography>
                    </Typography> :
                    (<div>
                        <div className={classes.author}>
                            <Avatar onClick={this.handleAvatarClick} src = {answers[0].userId.profilePicture ? answers[0].userId.profilePicture : '/nopic.jpg'}/>
                            <div className={classes.avatarDiv}>
                                <Typography>{answers[0].userId.name}</Typography>
                                <Typography className={classes.time}>{format(answers[0].createdDate)}</Typography>
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
                        <IconButton>
                            <TUp />
                        </IconButton>
                    </Tooltip>
                    <Typography>{voteValue}</Typography>
                    <Tooltip title="Thumbs Down">
                        <IconButton>
                            <TDn />
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

SimpleCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
