import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Auth from "./Auth";
import Callback from "./components/callback";
import Nav from "./components/nav";
import Home from "./components/home";
import Spinner from "./util/spinner";
import { gql } from "apollo-boost";
import { ApolloConsumer, withApollo } from "react-apollo";
import Answer from "./components/answer";
import Profile from "./components/profile";
import ErrorPage from "./components/error";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tryingSilent: true,
      userInfo: null
    };
  }

  async componentDidMount() {
    console.log(this.props);
    if (this.props.match.path === "/callback") {
      console.log("change in if callback");
      this.setState({ tryingSilent: false });
      return;
    }
    try {
      await Auth.silentAuth();
      console.log("change in try");
      this.setState({ tryingSilent: false });
      //this.forceUpdate();
    } catch (err) {
      console.log("change in catch");
      localStorage.setItem("userInfo", null);
      this.setState({ tryingSilent: false });
      if (err.error === "login_required") return;
      console.log(err);
    }
  }

  onChangeUserData = data => {
    console.log("in onChangeUserData", data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    this.setState({ userInfo: data });
  };

  updateUser = async () => {
    const query = gql`
      {
        user {
          id
          username
          name
          email
          profilePicture
          department
          job
          location
        }
      }
    `;
    const client = this.props.client;
    const { data } = await client.query({ query: query });
    console.log("new data", data);
    this.onChangeUserData(data.user);
  };

  render() {
    console.log(this, this.props.client);
    if (!this.state.tryingSilent && this.props.match.path !== "/callback") {
      Auth.isAuthenticated() &&
        this.state.userInfo == null &&
        this.updateUser();
      !Auth.isAuthenticated() && localStorage.setItem("userInfo", null);
    }

    console.log("in render" + this.state.tryingSilent);
    const userInfo = this.state.userInfo;
    /*Auth.isAuthenticated() && this.updateUser();*/

    if (!this.state.tryingSilent)
      return (
        <div>
          <Nav userInfo={userInfo} />
          <div style={{ margin: "80px 20px 20px 20px" }}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/callback"
                render={props => (
                  <Callback
                    {...props}
                    onChangeUserData={this.onChangeUserData}
                  />
                )}
              />
              <Route path="/profile" component={Profile} />
              <Route path="/login" render={() => Auth.login()} />
              <Route exact path="/q/:postId" component={Answer} />
              <Route exact path="/q/:postId/:answerId" component={Answer} />
              <Route component={ErrorPage} />
            </Switch>
          </div>
        </div>
      );
    return <Spinner />;
  }
}

export default withRouter(withApollo(App));
