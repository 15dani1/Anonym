import React, { Component } from 'react';
import Profile from './Components/Profile.js';
import Signin from './Signin.js';
import { UserSession, AppConfig } from 'blockstack';
import { Connect } from '@blockstack/connect';
import { Switch, Link, Route, withRouter } from 'react-router-dom'
import {User, configure } from 'radiks'
import Post from "./Components/Posts/Post";
import CreatePost from "./Components/CreatePost/CreatePost";
import Home from "./Components/Home"
import PostPage from "./Components/PostPage/PostPage";
import { Modal, Button, Tooltip } from 'antd';
import { WalletOutlined } from '@ant-design/icons'
import SimpleWallet from "simple-bitcoin-wallet";
import Wallet from './Components/Wallet/Wallet'
import PostObj from "./models/Post";
import Constentation from "./models/Contestation";

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

configure({ apiServer: "http://localhost:1260", userSession})

export default class App extends Component {
  state = {
    userData: null,
    visible: false,
    wallet: null,
  }

  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.setWallet = this.setWallet.bind(this);
  }

  runModeration = async () => {
    // Check Authored Posts
    const _posts = await PostObj.fetchOwnList({state: PostObj.STATE_CONTESTED});
    _posts.forEach((post) => {
      if (Date.now() - post.attrs.updatedAt >= 86400000) {
        var total = 0;
        var against = 0;

        post.contestations.forEach((c) => {
          if (c.status === Constentation.STATUS_PENDING) {
            total += c.amount;
            if (c.direction === Constentation.DIRECTION_TAKE_DOWN) {
              against += c.amount;
            }
          }
        });

        if (against < .66 * total) {
          post.update({state: PostObj.STATE_UNCONTESTED});
          post.save();
        } else {
          post.update({state: PostObj.STATE_REMOVED});
          post.save()
        }
      }
    });

    // Check Constentations
    const _constentations = await Constentation.fetchOwnList({ status: Constentation.STATUS_PENDING});
    var receivers = [];
    _constentations.forEach((c) => {
      if (c.status === Constentation.STATUS_PENDING && c.post.state === PostObj.STATE_UNCONTESTED) {
        receivers.push({address: c.post.author_wallet, amountSat: c.amount});
        c.update({status: Constentation.STATUS_COMPLETED});
        c.save();
      }
    });

    const tx = await this.state.wallet.send(receivers);
    console.log(tx.txid);
  };

  handleSignOut(e) {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
    localStorage.clear();
  }

  setWallet(w) {
    console.log("foobar");
    this.setState({wallet: w, visible: false});
    localStorage.setItem("BCH_MNEMONIC", w.mnemonic);

    this.runModeration();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

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
        console.log("Creating Radiks User");
        User.createWithCurrentUser();
      }
    }

    return (
      
      <Connect authOptions={authOptions}>
        <div className="site-wrapper">
          <div className="site-wrapper-inner">
          
            <Modal
                title="Wallet"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
            >
              <Wallet setWallet={this.setWallet} wallet={this.state.wallet}/>
            </Modal>
            <Switch>
              {/*<Route path='/firstPost'>*/}
              {/*  <PostPage title="This is The Post Title" tagline="Here is where the tagline appears" text='### This is a header\n\nAnd this is a paragraph' />*/}
              {/*</Route>*/}
              <Route path='/create' render={
                routeProps => !userData ? <Signin /> : <CreatePost
                                userData={userData}
                                wallet={this.state.wallet}
                                handleSignOut={this.handleSignOut}
                                showModal={this.showModal}
                                isVisible={this.state.visible}
                                {...routeProps} />
              }/>
              <Route path='/profile' render={
                routeProps => !userData ? <Signin /> : <Profile
                                showModal={this.showModal}
                                userData={this.state.userData}
                                handleSignOut={this.handleSignOut}
                                {...routeProps} />
              }/>
              <Route path="/:postId" render={
                props => !userData ? <Signin /> : <PostPage wallet={this.state.wallet}
                                  showModal={this.showModal}
                                  userData={this.state.userData} 
                                  {...props} />
              }/>
              <Route path="/" render={
                routeProps => !userData ? <Signin /> : <Home userData={userData} showModal={this.showModal}/>
              }>
              </Route>
            </Switch>
          </div>
        </div>
      </Connect>
    );
  }

  componentDidMount() {
    console.log("Component Mounted");
    const mnemonic = localStorage.getItem("BCH_MNEMONIC")
    if (mnemonic !== null) {
      console.log("Took wallet mnemonic from local storage!");
      this.setWallet(new SimpleWallet(mnemonic));
      console.log(mnemonic)
    }

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
