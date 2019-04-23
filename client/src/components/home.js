import React, {Component} from "react";
import queryString from 'query-string';
import {withStyles} from "@material-ui/core/es/styles";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Spinner from "../util/spinner";
import PongSpinner from "../util/pongSpinner";
import Card from "../util/card";

import {Query} from "react-apollo";
import gql from "graphql-tag";

const BootstrapInput = withStyles(theme => ({
    root: {
        "label + &": {
            marginTop: theme.spacing.unit * 3
        }
    },
    input: {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #ced4da",
        fontSize: 16,
        width: "auto",
        padding: "10px 26px 10px 12px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(","),
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
        }
    }
}))(InputBase);

const styles = theme => ({
    flex: {
        display: "flex",
        flexWrap: "wrap"
    },
    centerFlex: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    left: {
        alignItems: "center",
        flexGrow: 1,
        display: "flex"
    },
    right: {
        display: "flex"
    },
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    bootstrapFormLabel: {
        fontSize: 18
    },
    anchor: {
        color: "inherit",
        "&:link": {
            textDecoration: "none"
        },
        "&:hover": {
            color: "inherit",
            textDecoration: "underline"
        },
        "&:visited": {}
    }
});

class Home extends Component {
    constructor(props) {
        super(props);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        this.state = {
            sort: "new",
            userInfo: userInfo
        };
        this.limit = 10;
        this.paginationIndex = 1;
        this.loadMore = true;
        const search = this.props.location.search;
        if (search && search.length > 0) {
            const parsed = queryString.parse(this.props.location.search);
            console.log("==++", this.props);
            if (parsed.redirect)
                this.props.history.push(parsed.redirect);
        }
    }

    handleSortChange = event => {
        this.setState({sort: event.target.value});
    };

    fetchMore = (fetchMore, cursorDate) => () => {
        const {userInfo, sort} = this.state;
        console.log(this.paginationIndex);
        this.paginationIndex =
            this.paginationIndex < 1 ? 1 : this.paginationIndex++;

        console.log(this.paginationIndex);
        this.paginationIndex++;
        fetchMore({
            variables: {
                userId: userInfo ? userInfo.id : null,
                sort: sort,
                paginationIndex: this.paginationIndex,
                limit: this.limit,
                cursorDate: cursorDate.createdDate
            },
            updateQuery: (previousResult, {fetchMoreResult}) => {
                console.log(previousResult, fetchMoreResult);
                const prevPosts = previousResult.posts;
                if (fetchMoreResult.posts.length === 0) {
                    this.loadMore = false;
                    return {
                        ...previousResult,
                        posts: [...prevPosts, prevPosts[prevPosts.length - 1]]
                    };
                }
                return {
                    ...previousResult,
                    posts: [...prevPosts, ...fetchMoreResult.posts]
                };
            }
        });
    };

    render() {
        const {classes} = this.props;
        const {userInfo, sort} = this.state;
        //let limit = this.limit;

        this.limit = 10;
        this.paginationIndex = 1;
        this.loadMore = true;
        return (
            <Grid container justify={"center"}>
                <Grid item xs={11} md={8}>
                    <div className={classes.flex}>
                        <div className={classes.left}>
                            <Typography variant={"h5"}>Top Questions</Typography>
                        </div>
                        <div className={classes.right}>
                            <FormControl>
                                <InputLabel
                                    htmlFor="age-customized-select"
                                    className={classes.bootstrapFormLabel}
                                >
                                    Sort
                                </InputLabel>
                                <Select
                                    value={this.state.sort}
                                    onChange={this.handleSortChange}
                                    input={
                                        <BootstrapInput name="age" id="age-customized-select"/>
                                    }
                                >
                                    <MenuItem value={"new"}>newer</MenuItem>
                                    <MenuItem value={"votes"}>votes</MenuItem>
                                    <MenuItem value={"hot"} disabled>
                                        hot
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{marginTop: "1em"}}>
                        <Query
                            query={gql`
                                query Posts(
                                    $userId: ID
                                    $sort: String!
                                    $paginationIndex: Int
                                    $limit: Int
                                    $cursorDate: String
                                ) {
                                    posts(
                                        sort: $sort
                                        paginationIndex: $paginationIndex
                                        limit: $limit
                                        cursorDate: $cursorDate
                                    ) {
                                    id
                                    heading
                                    description
                                    answers(limit: 1) {
                                        answer
                                        userId {
                                            id
                                            name
                                            profilePicture
                                            department
                                            job
                                            location
                                        }
                                        createdDate
                                    }
                                    userId {
                                        id
                                        name
                                        profilePicture
                                        department
                                        job
                                        location
                                    }
                                    votes(userId: $userId) {
                                        id
                                        value
                                    }
                                        createdDate
                                        voteValue
                                    }
                                 }
                             `}
                            variables={{
                                userId: userInfo ? userInfo.id : null,
                                sort: sort,
                                paginationIndex: this.paginationIndex,
                                limit: this.limit
                            }}
                            notifyOnNetworkStatusChange={true}
                            fetchPolicy={"cache-and-network"}
                        >
                            {({
                                  loading,
                                  error,
                                  data,
                                  fetchMore,
                                  networkStatus
                              }) => {
                                console.log(networkStatus);
                                if (networkStatus === 1) return <Spinner/>;
                                if (error) return <p>Error :(</p>;
                                if (data) {
                                    console.log("-", data, data.posts.length);
                                }
                                if (this.loadMore === false) data.posts.pop();

                                return (
                                    <>
                                        {data.posts.map(data => (
                                            <Card
                                                key={data.id}
                                                data={data}
                                                userInfo={userInfo}
                                                to={"post"}
                                            />
                                        ))}
                                        <div className={classes.centerFlex}>
                                            {this.loadMore ? (
                                                loading ? (
                                                    <PongSpinner color={"#3f51b5"}/>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={this.fetchMore(
                                                            fetchMore,
                                                            data.posts[data.posts.length - 1]
                                                        )}
                                                    >
                                                        loadmore
                                                    </Button>
                                                )
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    align={"center"}
                                                    gutterBottom
                                                >
                                                    ---<span style={{verticalAlign: "sub"}}>*</span>---
                                                </Typography>
                                            )}
                                        </div>
                                    </>
                                );
                            }}
                        </Query>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(withRouter(Home));
