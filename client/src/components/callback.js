import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import auth from '../Auth';
import Spinner from '../util/spinner';

class Callback extends Component {

    async componentDidMount() {
        await auth.handleAuthentication();
        this.props.history.replace('/');
    }

    render() {
        return (
            <Spinner />
        );
    }
}

export default withRouter(Callback);