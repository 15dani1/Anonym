import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import { UserSession, AppConfig } from 'blockstack';
import { Connect } from '@blockstack/connect';
import { Switch, Route } from 'react-router-dom'
import {User, configure } from 'radiks'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

configure({ apiServer: "http://localhost:1260", userSession})

export default class App extends Component {
  state = {
    userData: null,
  }

  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut(e) {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }

  render() {
    const { userData } = this.state;
    const authOptions = {
      appDetails: {
        name: 'Blockstack App',
        icon: window.location.origin + '/favicon.ico'
      },
      userSession,
      finished: ({ userSession }) => {
        this.setState({ userData: userSession.loadUserData() });
        console.log("Creating Radiks User")
        User.createWithCurrentUser();
      }
    }

    return (
      <Connect authOptions={authOptions}>
        <div className="site-wrapper">
          <div className="site-wrapper-inner">
            { !userData ? <Signin /> : <Switch>
                                        <Route path='/:username?' render={
                                          routeProps => <Profile
                                                          userData={userData}
                                                          handleSignOut={this.handleSignOut}
                                                          {...routeProps} />
                                          }/>
                                      </Switch> }
          </div>
        </div>
      </Connect>
    );
  }

  componentDidMount() {
    console.log("Component Mounted");
    if (userSession.isSignInPending()) {
      console.log("Signing pending")
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
        console.log("Hellop")
      });
    } else if (userSession.isUserSignedIn()) {
      this.setState({ userData: userSession.loadUserData() });
    }
  }
}
