import React, { Component } from 'react';
import {
  Person,
  lookupProfile
} from 'blockstack';
import { useConnect } from '@blockstack/connect';

import { toaster } from 'evergreen-ui'

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export const Profile = ({ userData, handleSignOut, match }) => {
  const isLocal = () => {
    return match.params.username ? false:true
  }

  const [newStatus, setNewStatus] = React.useState('');
  const [statuses, setStatuses] = React.useState([]);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState(userData.username);
  const [person, setPerson] = React.useState(new Person(userData.profile));

  const { authOptions } = useConnect();
  const { userSession } = authOptions;

  const handleNewStatus = (event) => {
    setNewStatus(event.target.value);
  }

  const handleNewStatusSubmit = async (event) => {
    await saveNewStatus(newStatus);
    toaster.notify("New status submitted!")
    setNewStatus("")
  }

  const saveNewStatus = async (statusText) => {
    const _statuses = statuses
    let status = {
      id: statusIndex + 1,
      text: statusText.trim(),
      created_at: Date.now()
    }

    _statuses.unshift(status)
    const options = { encrypt: false };
    await userSession.putFile('statuses.json', JSON.stringify(_statuses), options);
    setStatuses(_statuses);
    setStatusIndex(statusIndex + 1);
  }

  const fetchData = async () => {
    setLoading(true)
    if (isLocal()) {
      const options = {decrypt: false}
      const file = await userSession.getFile('statuses.json', options)
      const _statuses = JSON.parse(file || '[]')
      setStatusIndex(_statuses.length);
      setStatuses(_statuses);
      setLoading(false);
    } else {
      const username = match.params.username
      try {
        const newProfile = await lookupProfile(username);
        setPerson(new Person(newProfile));
        setUsername(username);

        const options = { username: username, decrypt: false }
        const file = await userSession.getFile('statuses.json', options)
        const _statuses = JSON.parse(file || '[]')
        setStatusIndex(_statuses.length);
        setStatuses(_statuses);
        setLoading(false);
      } catch (error) {
        console.log("Could not resolve profile")
      }
    }
  }

  React.useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-offset-3 col-md-6">
          <div className="col-md-12">
            <div className="avatar-section">
              <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
              <div className="username">
                <h1><span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span></h1>
                <span>{ username }</span>
                { isLocal() &&
                <span>&nbsp;|&nbsp;<a onClick={ handleSignOut.bind(this)}>(Logout)</a></span> }
              </div>
            </div>
          </div>
            {isLocal() &&
              <div className="new-status">
                <div className="col-md-12">
                  <textarea className="input-status" value={newStatus} onChange={handleNewStatus} placeholder="Enter a status"/>
                </div>
                <div className="col-md-12">
                  <button className="btn btn-primary btn-lg" onClick={handleNewStatusSubmit}>Submit</button>
                </div>
              </div>
            }
          <div className="col-md-12 statuses">
              {isLoading && <span>Loading...</span>}
              {statuses.map((status) => (
                <div className="status" key="status.id">{status.text}</div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile
