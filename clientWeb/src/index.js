import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// import { Route, BrowserRouter, Switch } from 'react-router-dom';
// import Login from './User/login';
// import ProjectPage from "./Project/ProjectPage";
// import Home from "./Home/Home";
// import ProtectedRoute from './ProtectedRoute';

ReactDOM.render(<App />, document.getElementById("root"));

//  ReactDOM.render((
//          <BrowserRouter>
//              <Switch>
//                  <Route path="/" component={App} />
//                  <ProtectedRoute path="/home" component={App} />
//                  <ProtectedRoute path="/project" component={App} />
//                  <ProtectedRoute exact={true} path="/" component={App} />
//                  <ProtectedRoute component={ProjectPage} />
//              </Switch>
//          </BrowserRouter>
//      ), document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
