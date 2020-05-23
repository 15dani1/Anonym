import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { useConnect } from '@blockstack/connect';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export const Profile = ({ userData, handleSignOut }) => {
  const [newStatus, setNewStatus] = React.useState('');
  const [statuses, setStatuses] = React.useState([]);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState(userData.username);
  const [person, setPerson] = React.useState(new Person(userData.profile));
  const { authOptions } = useConnect();
  const { userSession } = authOptions;
  return (
    <div className="panel-welcome" id="section-2">
      <div className="avatar-section">
        <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
      </div>
      <h1>Hello, <span id="heading-name">{ person.name() || username || 'Nameless Person' }</span>!</h1>
      <p className="lead">
        <button
          className="btn btn-primary btn-lg"
          id="signout-button"
          onClick={ handleSignOut.bind(this) }
        >
          Logout
        </button>
      </p>
    </div>
  );
}

export default Profile
