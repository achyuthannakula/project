import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import auth from "./Auth"

const client = new ApolloClient({
    uri: "http://localhost:5000/",
    request: operation => {
        operation.setContext(context => ({
            headers: {
                ...context.headers,
                authorization: auth.getIdToken(),
            },
        }));
    },
});
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App client={client}/>
        </ApolloProvider>
    </BrowserRouter>
    , document.getElementById('root'));

