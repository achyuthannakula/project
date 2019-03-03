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
    card: {},
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
    const { classes } = props;
    const bull = <span className={classes.bullet}>•</span>;
    const out =
        "I got married for the second time 15 years ago and my wife had a 15 year old daughter. Her daughter is 6′ tall and very shapely and pretty. She lost her father at the age of 7 to cancer so she went years without a father until I married her mother. I had told my wife that the day I marry her, her daughter will then be my daughter also and I treated her every bit as good as my own children including financing her college, paying rent, buying her supplies, etc. Her daughter loved having a Dad in her life a";

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

                <Link to="./" className={classes.anchor}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        What is a secret which you would not tell anybody in real life, but
                        would on Quora using anonymity?
                    </Typography>
                </Link>

                <Typography className={classes.noans}>
                    No answer yet<span className={classes.bullet}>·</span>
                    <Typography className={classes.time}>10 mins ago</Typography>
                </Typography>
                <div className={classes.author}>
                    <Avatar>A</Avatar>
                    <div className={classes.avatarDiv}>
                        <Typography>Hanuman</Typography>
                        <Typography className={classes.time}>10 mins ago</Typography>
                    </div>
                </div>

                <Typography className={classes.ans}>{out}</Typography>
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
                    <Typography>12</Typography>
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
