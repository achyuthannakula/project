import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
    progress: {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
};

function CircularIndeterminate(props) {
    const {classes} = props;
    return (
        <div className={classes.progress}>
            <CircularProgress/>
        </div>
    );
}

CircularIndeterminate.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CircularIndeterminate);
