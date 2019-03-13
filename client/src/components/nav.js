import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonBase from '@material-ui/core/ButtonBase';
import Modal from '@material-ui/core/Modal';
import QuestionModel from '../util/questionModal'

import auth from '../Auth'

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

    handleAvatarClick = (e) => {
        this.setState({anchorEl : e.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorEl : null});
    };

    handleModelOpen = () => {
        this.setState(state => state.modelOpen = true);
    };

    handleModelClose = () => {
        this.setState(state => state.modelOpen = false);
    };


     render() {
         const { classes } = this.props;
         const anchorEl = this.state.anchorEl;
         const  open  = Boolean(anchorEl);
         const userInfo = this.props.userInfo;
         console.log("in nav");
         return (
             <div>
                 <CssBaseline/>
                 <AppBar position="fixed">
                     <Toolbar>
                         <Typography className={classes.root} variant="h6" color="inherit">
                             Project
                         </Typography>
                         {auth.isAuthenticated() &&
                            <Button color="inherit" onClick={this.handleModelOpen}>Add Question</Button>
                         }
                         <Modal
                            open={this.state.modelOpen}
                            onClose={this.handleModelClose}
                            children={<QuestionModel/>}
                            root={{verticalAlign:"middle"}}
                            />

                         { !auth.isAuthenticated() ?
                             <Button color="inherit" onClick={ () => auth.login() }>Login</Button> :
                             <div><ButtonBase
                                 className={classes.avatar}
                                 centerRipple={true}>
                                 {userInfo &&
                                 userInfo.profilePicture &&
                                 <Avatar onClick={this.handleAvatarClick} src = {userInfo.profilePicture}/> ||
                                 <Avatar onClick={this.handleAvatarClick} children="T"/>}
                             </ButtonBase>
                             <Menu
                                 id="menu-appbar"
                                 anchorEl={anchorEl}
                                 anchorOrigin={{
                                     vertical: 'top',
                                     horizontal: 'right',
                                 }}
                                 transformOrigin={{
                                     vertical: 'top',
                                     horizontal: 'right',
                                 }}
                                 open={open}
                                 onClose={this.handleMenuClose}
                                 >
                                 <MenuItem>Profile</MenuItem>
                                 <MenuItem onClick={() => auth.logout()}>Logout</MenuItem>
                             </Menu></div>
                         }

                     </Toolbar>
                 </AppBar>
             </div>
         );
     }
}

SimpleAppBar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleAppBar);
