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
        open: false
    };

    handleAvatarClick = () => {
        this.setState(state => state.open = !state.open);
    };

    handleMenuClose = () => {
        this.setState(state => state.open = !state.open);
    };

    render() {
         const { classes } = this.props;
         const { open } =this.state;

         return (
             <React.Fragment>
                 <CssBaseline/>
                 <AppBar position="fixed">
                     <Toolbar>
                         <Typography className={classes.root} variant="h6" color="inherit">
                             Project
                         </Typography>
                         { (!auth.isAuthenticated() && <Button color="inherit" onClick={ () => auth.login() }>Login</Button>) ||
                         <ButtonBase
                             className={classes.avatar}
                             centerRipple={true}>
                             <Avatar
                                 onClick={this.handleAvatarClick}
                                 children="Letter"
                             />
                         </ButtonBase>}
                         <Menu
                             id="menu-appbar"
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
                         </Menu>
                     </Toolbar>
                 </AppBar>
             </React.Fragment>
         );
     }
}

SimpleAppBar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleAppBar);
