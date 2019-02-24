import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import auth from './Auth';
import Callback from './components/callback';
import Nav from './components/nav';
import Home from './components/home'
import './App.css';

class App extends Component {

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') return;
    try {
      await auth.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error === 'login_required') return;
      console.log(err.error);
    }
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <div style={{marginTop: "80px"}}>
            <h1>Welcome to my app</h1>
            {/*<Route exact path='/' component={Home}/>*/}
            <Route exact path='/callback' component={Callback}/>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
