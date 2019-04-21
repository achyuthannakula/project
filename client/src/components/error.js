import React, { Component } from "react";
import { withStyles } from "@material-ui/core/es/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import Home from "@material-ui/icons/Home";

const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    marginTop: "1em"
  },
  anchor: {
    "&:link": {
      textDecoration: "none"
    },
    "&:hover": {
      color: "inherit",
      textDecoration: "none"
    },
    "&:visited": {}
  }
};
export default withStyles(styles)(props => {
  const { classes } = props;
  return (
    <Grid container justify={"center"}>
      <Grid item xs={11} md={8}>
        <img src="/error.png" />
        <br />
        <Link to="/" className={classes.anchor}>
          <Button
            className={classes.button}
            variant="outlined"
            color={"primary"}
            size={"medium"}
          >
            <Home />
            &nbsp;&nbsp; Home
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
});
