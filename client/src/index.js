import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./quill.snow.css";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";
import auth from "./Auth";

const client = new ApolloClient({
    uri: "https://localhost:5000/",
    request: operation => {
        operation.setContext(context => ({
            headers: {
                ...context.headers,
                authorization: auth.getIdToken()
            }
        }));
    }
});
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
