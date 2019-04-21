import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ShareIcon from "@material-ui/icons/Share";
import MenuItem from "@material-ui/core/MenuItem";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon
} from "react-share";

class SocialShare extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <>
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Tooltip title="Share">
            <ShareIcon />
          </Tooltip>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem>
            <FacebookShareButton quote={this.props.title} url={this.props.url}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
          </MenuItem>
          <MenuItem>
            <LinkedinShareButton title={this.props.title} url={this.props.url}>
              <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
          </MenuItem>
          <MenuItem>
            <WhatsappShareButton title={this.props.title} url={this.props.url}>
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
          </MenuItem>
          <MenuItem>
            <TwitterShareButton title={this.props.title} url={this.props.url}>
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
          </MenuItem>
          <MenuItem>
            <EmailShareButton
              subject={this.props.title}
              body={this.props.url}
              url={this.props.url}
            >
              <EmailIcon size={32} round={true} />
            </EmailShareButton>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default SocialShare;
