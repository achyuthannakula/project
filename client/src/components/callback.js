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
    await auth.handleAuthentication();
    this.setState({ update: true });
  }

  render() {
    console.log("callback in render", this.props);
    if (this.state.update) {
      console.log("callback in if", this.props);
      return (
        <div>
          <Spinner />
          <Query
            query={gql`
              {
                userUpdate {
                  username
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;
              console.log("in caller", data.user);
              console.log("props", this.props);
              this.props.onChangeUserData(data.user);
              return (
                  <Spinner />
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
