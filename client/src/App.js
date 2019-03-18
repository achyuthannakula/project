import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import auth from './Auth';
import Callback from './components/callback';
import Nav from './components/nav';
import Home from './components/home'
import Spinner from './util/spinner'
import { gql } from "apollo-boost";
import ApolloConsumer from "react-apollo/ApolloConsumer";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            tryingSilent: true,
            userInfo: null
        };
    }


    async componentDidMount() {
        console.log(this.props);
        if (this.props.match.path === '/callback') {
            console.log("change in if callback");
            this.setState({tryingSilent: false});
            return;
        }
        try {
            await auth.silentAuth();
            console.log("change in try");
            this.setState({tryingSilent: false});
            //this.forceUpdate();

        } catch (err) {
            console.log("change in catch");
            this.setState({tryingSilent: false});
            if (err.error === 'login_required') return;
            console.log(err);
        }
    }

    onChangeUserData = (data) => {
        localStorage.setItem('userInfo', JSON.stringify(data));
        this.setState({userInfo: data});
    };

    updateUser = async () => {
        const query = gql`{
                        user{
                            id
                            username
                            name
                            email
                            profilePicture
                        }
                    }`;
        const client = this.props.client;
        const { data } = await client.query({query: query});
        console.log("new data", data);
        this.onChangeUserData(data.user);
    };

    render() {
        if(!this.state.tryingSilent && this.props.match.path !== '/callback')
            auth.isAuthenticated() && this.state.userInfo == null &&  this.updateUser();

        console.log("in render"+this.state.tryingSilent);
        const userInfo = this.state.userInfo;
        /*auth.isAuthenticated() && this.updateUser();*/

        if(!this.state.tryingSilent)
            return (
                <div>
                    <Nav userInfo={userInfo}/>
                    <div style={{ margin: "80px 20px 20px 20px" }}>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/callback' render={(props) => <Callback {...props} onChangeUserData={this.onChangeUserData} />} />
                    </div>
                </div>
            );
        return <Spinner />;
    }
}

export default withRouter(App);
