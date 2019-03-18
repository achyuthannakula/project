import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/es/styles";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import Spinner from "../util/spinner";
import Card from "../util/card";

import { Query } from "react-apollo";
import gql from "graphql-tag";

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing.unit * 3,
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: 'auto',
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);


const styles = theme => ({
    flex: {
        display: "flex",
        flexWrap: "wrap"
    },
    left: {
        alignItems: "center",
        flexGrow: 1,
        display: "flex",
    },
    right: {
        display: "flex"
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    bootstrapFormLabel: {
        fontSize: 18,
    },

});


class Home extends Component{

    constructor(props) {
        super(props);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.state = {
            sort: "new",
            userInfo: userInfo
        };
    }

    handleSortChange = event => {
        this.setState({ sort: event.target.value });
    };

    render(){
        const { classes } = this.props;
        const { userInfo } = this.state;
        return(
            <Grid  container justify={"center"}>
                <Grid item xs={11} md={8}>
                    <div className={classes.flex}>
                        <div className={classes.left}>
                            <Typography variant={"h5"}>Top Questions</Typography>
                        </div>
                        <div className={classes.right}>
                            <FormControl>
                                <InputLabel htmlFor="age-customized-select" className={classes.bootstrapFormLabel}>
                                    Sort
                                </InputLabel>
                                <Select
                                    value={this.state.sort}
                                    onChange={this.handleSortChange}
                                    input={<BootstrapInput name="age" id="age-customized-select" />}
                                >
                                    <MenuItem value={"new"}>newer</MenuItem>
                                    <MenuItem value={"votes"}>votes</MenuItem>
                                    <MenuItem value={"hot"} disabled>hot</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{marginTop: "1em"}}>
                        <Query
                        query={gql`
                        query Posts($id: ID, $sort: String!){
                            posts(id: $id, sort: $sort){
                                id
                                heading
                                description
                                answers{
                                    answer
                                    userId{
                                        name
                                        profilePicture
                                    }
                                    createdDate
                                }
                                userId{
                                  name
                                  profilePicture
                                }
                                votes{
                                    id
                                    value
                                }
                                createdDate
                                voteValue
                            }
                        }
                        `} variables={{id : userInfo ? userInfo.id : null, sort: this.state.sort}}>
                            {({ loading, error, data }) => {
                                if (loading) return <Spinner />;
                                if (error) return <p>Error :(</p>;
                                {console.log(data);}
                                return data.posts.map((data) => (
                                    <Card key={data.id} data={data} userInfo={userInfo}/>
                                ));
                            }}
                        </Query>
                    </div>
                </Grid>
            </Grid>

        );
    }

}

export default withStyles(styles)(Home);