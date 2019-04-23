import React, {Component} from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TUp from "@material-ui/icons/ThumbUp";
import TDn from "@material-ui/icons/ThumbDown";
import Tooltip from "@material-ui/core/Tooltip";
import {Mutation} from "react-apollo";
import {gql} from "apollo-boost";

class Vote extends Component {
    constructor(props) {
        super(props);
        const voteObj = this.props.votes;
        this.state = {
            voteId: voteObj && voteObj.length > 0 ? voteObj[0].id : null,
            userVoteValue: voteObj && voteObj.length > 0 ? voteObj[0].value : 0,
            voteShowValue: this.props.voteValue
        };
    }

    onVoteCompleted = ({createOrUpdateVote}) => {
        console.log("the end", createOrUpdateVote);
        this.setState(oldState => ({
            voteId: createOrUpdateVote.id,
            userVoteValue: createOrUpdateVote.value,
            voteShowValue:
                oldState.voteShowValue -
                oldState.userVoteValue +
                createOrUpdateVote.value
        }));
    };

    handleOnClickMutation = (fun, val) => {
        const {userInfo, to, id} = this.props;
        console.log("enter& userInfo-", userInfo, typeof userInfo);
        if (!userInfo) {
            alert("you need to login");
            return;
        }
        const {userVoteValue} = this.state;
        fun({
            variables: {
                data: {
                    value: userVoteValue === val ? 0 : val,
                    userId: userInfo.id,
                    to: to,
                    toId: id
                }
            }
        });
    };

    render() {
        const {userVoteValue, voteShowValue} = this.state;
        return (
            <>
                <Tooltip title="Thubms Up">
                    <Mutation
                        mutation={gql`
                            mutation CreateOrUpdateVote($data: VoteInput!) {
                                createOrUpdateVote(data: $data) {
                                    id
                                    value
                                }
                            }
                        `}
                        onCompleted={this.onVoteCompleted}
                    >
                        {(createOrUpdateVote, {error, data}) => {
                            if (error) console.log("error-", error);
                            return (
                                <IconButton
                                    color={userVoteValue > 0 ? "primary" : "default"}
                                    onClick={() =>
                                        this.handleOnClickMutation(createOrUpdateVote, 1)
                                    }
                                >
                                    <TUp/>
                                </IconButton>
                            );
                        }}
                    </Mutation>
                </Tooltip>

                <Typography>{voteShowValue}</Typography>
                <Tooltip title="Thumbs Down">
                    <Mutation
                        mutation={gql`
                            mutation CreateOrUpdateVote($data: VoteInput!) {
                                createOrUpdateVote(data: $data) {
                                    id
                                    value
                                }
                            }
                        `}
                        onCompleted={this.onVoteCompleted}
                    >
                        {(createOrUpdateVote, {loading, error, data}) => {
                            if (error) console.log("error-", error);

                            return (
                                <IconButton
                                    color={userVoteValue < 0 ? "primary" : "default"}
                                    onClick={() =>
                                        this.handleOnClickMutation(createOrUpdateVote, -1)
                                    }
                                >
                                    <TDn/>
                                </IconButton>
                            );
                        }}
                    </Mutation>
                </Tooltip>
            </>
        );
    }
}

export default Vote;
