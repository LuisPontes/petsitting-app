import React, { Component } from 'react';

import Row from 'react-bootstrap/Row';

import './Content.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


//Components Pages
import Home from './home/Home';
import Login from '../auth/Login';
import About from './about/About';
import Register from '../auth/Register';
import Profile from '../auth/user/Profile';
import BoardModerator from "../auth/moderator/ModeratorBoard";
import BoardAdmin from "../auth/admin/AdminBoard";


import AuthService from "../../services/auth.service";

export default class Content extends Component {

  constructor(props) {
    super(props);


    this.state = {
      // showModeratorBoard: false,
      // showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        // showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        // showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }


  render() {
    const { currentUser } = this.state;
    return (
      <Row md={4} style={{top:'200px'}}>

        <Router>

          {currentUser ? (
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/mod" component={BoardModerator} />
              <Route path="/admin" component={BoardAdmin} />
              {/* <Route exact path="/*" component={Home} /> */}
            </Switch>
          ) : (

              <Switch>
                <Route exact path={["/", "/home","/logout"]} component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                {/* <Route exact path="/*" component={Home} /> */}
              </Switch>

            )}

        </Router>

      </Row>

    )
  }
}