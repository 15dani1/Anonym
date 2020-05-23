import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import {
  UserSession,
  AppConfig
} from 'blockstack';
import { Connect } from '@blockstack/connect';
import { SearchInput } from 'evergreen-ui'
import { Switch, Route } from 'react-router-dom'
import Post from "./Components/Posts/Post";
import CreatePost from "./Components/CreatePost/CreatePost";
import Home from "./Components/Home"

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

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
      }
    }
    return (
      
      <Connect authOptions={authOptions}>
        <div className="site-wrapper">
          <div className="site-wrapper-inner">
            <Switch>
              <Route path='/create' render={
                routeProps => !userData ? <Signin /> : <CreatePost
                                userData={userData}
                                handleSignOut={this.handleSignOut}
                                {...routeProps} />
              }/>
              <Route path='/profile' render={
                routeProps => !userData ? <Signin /> : <Profile
                                userData={userData}
                                handleSignOut={this.handleSignOut}
                                {...routeProps} />
              }/>
              <Route path="/:postId">
                <div>Testing</div>
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
            {/* { !userData ? <Signin /> : <Switch>
                                        <Route path='/:username?' render={
                                          routeProps => <Profile
                                                          userData={userData}
                                                          handleSignOut={this.handleSignOut}
                                                          {...routeProps} />
                                          }/>
                                      </Switch> } */}
          </div>
        </div>
      </Connect>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    } else if (userSession.isUserSignedIn()) {
      this.setState({ userData: userSession.loadUserData() });
    }
  }
}
