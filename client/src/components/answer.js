import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from '@material-ui/core/Divider';
import Share from "@material-ui/icons/Share";
import TUp from "@material-ui/icons/ThumbUp";
import TDn from "@material-ui/icons/ThumbDown";
import Create from "@material-ui/icons/Create";
import Comment from "@material-ui/icons/Comment";
import SingleAnswer from "../util/singleAnswer";

const answerStyles = {
    grid:{
        justifyContent: "center"
    },
    bold:{
        fontWeight:  "bold"
    },
    left: {
        alignItems: "center",
        flexGrow: 1,
        display: "flex",
    },
    right:{
        display: "flex"
    },
    flex: {
        display: "flex"
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
    }
};

class Answer extends Component {
    render() {
        const { classes } = this.props;
        const ques =
            "What will be Pakistans response to Indian Air Force raiding the terror camps post Pulwama Attack?";
        return (
            <div>
                <Grid  container className={ classes.grid}>
                    <Grid item xs={11} md={8}>
                        <div id={"Question"}>
                            <Typography className={classes.bold} variant="headline">{ques}</Typography>
                            <div className={classes.flex}>
                                <div className={classes.left}>
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
                                <div className={classes.right}>
                                    <IconButton>
                                        <Tooltip title="Comment">
                                            <Comment />
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton>
                                        <Tooltip title="Share">
                                            <Share />
                                        </Tooltip>
                                    </IconButton>
                                </div>
                            </div>
                            <Typography variant="h6" gutterBottom>100+ Answers</Typography>
                        </div>
                        <Divider/>
                        <Divider/>
                        <SingleAnswer classes={classes}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Answer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(answerStyles)(Answer);
