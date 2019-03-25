import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonBase from "@material-ui/core/ButtonBase";
import Modal from "@material-ui/core/Modal";
import QuestionModel from "../util/questionModal";

import Auth from "../Auth";

const styles = {
  root: {
    flexGrow: 1
  },
  main: {
    position: "absolute",
    marginTop: "80px"
  },
  avatar: {
    margin: "10px"
  }
};

class SimpleAppBar extends Component {
  state = {
    modelOpen: false,
    anchorEl: null
  };

  handleAvatarClick = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleModelOpen = () => {
    this.setState(state => (state.modelOpen = true));
  };

  handleModelClose = () => {
    this.setState(state => (state.modelOpen = false));
  };

  handleLogin = () => {
    console.log("beforelogin", this.props);
    //Auth.login();
    const win = window.open(
        window.location.origin + "/login",
        "popup",
        "width=600,height=600,scrollbars=no,resizable=no"
    );

    const timer = setInterval(function() {
      if(Auth.isAuthenticated()) {
        clearInterval(timer);
        win.close();
        window.location.reload();
      }
    }, 1000);
  };

  render() {
    const { classes } = this.props;
    const anchorEl = this.state.anchorEl;
    const open = Boolean(anchorEl);
    const userInfo = this.props.userInfo;
    console.log("in nav", this.props);
    return (
      <div>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.root} variant="h6" color="inherit">
              Project
            </Typography>
            {Auth.isAuthenticated() && (
              <Button color="inherit" onClick={this.handleModelOpen}>
                Add Question
              </Button>
            )}
            <Modal
              open={this.state.modelOpen}
              onClose={this.handleModelClose}
              children={
                <QuestionModel
                  handleClose={this.handleModelClose}
                  userInfo={this.props.userInfo}
                />
              }
              root={{ verticalAlign: "middle" }}
            />

            {!Auth.isAuthenticated() ? (
              <Button
                color="inherit"
                onClick={this.handleLogin}
              >
                Login
              </Button>
            ) : (
              <div>
                <ButtonBase className={classes.avatar} centerRipple={true}>
                  {(userInfo && userInfo.profilePicture && (
                    <Avatar
                      onClick={this.handleAvatarClick}
                      src={userInfo.profilePicture}
                    />
                  )) || (
                    <Avatar onClick={this.handleAvatarClick} children="T" />
                  )}
                </ButtonBase>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={open}
                  onClose={this.handleMenuClose}
                >
                  <MenuItem>Profile</MenuItem>
                  <MenuItem onClick={() => Auth.logout(window.location.href)}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SimpleAppBar));
