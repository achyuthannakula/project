import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth from "../Auth";
import Spinner from "../util/spinner";
import { gql } from "apollo-boost";
import Query from "react-apollo/Query";
import { Redirect } from "react-router-dom";

class Callback extends Component {
  state = {
    update: false
  };
  async componentDidMount() {
    console.log("going Inside");
    await auth.handleAuthentication()/*.catch(error => {
      console.log(error);
    });*/
    console.log("success");
    this.setState({ update: true });
  }

  render() {
    console.log("callback in render", this.state.update, this.props);
    if (this.state.update) {
      console.log("callback in if", this.props);
      return (
        <div>
          <Spinner />
          <Query
            query={gql`
              {
                userCreateOrUpdate {
                  username
                }
              }
            `}
          >
            {({ loading, error, data, networkStatus }) => {
              if (loading) {console.log("loading")}
              if (error) return `Error!: ${error}`;
              data && console.log("in caller", data.user);
              console.log("props", this.props);
              data && localStorage.setItem("userInfo", JSON.stringify(data.user));
              if(networkStatus === 1)
              return (
                <div>
                  Done
                </div> /*<Spinner />*/
              );
            }}
          </Query>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

export default withRouter(Callback);
