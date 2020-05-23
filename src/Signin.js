import React, { Component } from 'react';
import { useConnect } from '@blockstack/connect';
import { Button } from 'antd';
import 'antd/dist/antd.css'

export const Signin = () => {
  const { doOpenAuth } = useConnect();

  return (
    <div className="panel-landing" id="section-1">
      <p className="lead">
        {/*<button*/}
        {/*  className="btn btn-primary btn-sm"*/}
        {/*  id="signin-button"*/}
        {/*  onClick={() => doOpenAuth()}*/}
        {/*  style={{borderRadius: "50px"}}*/}
        {/*>*/}
        {/*  Sign In with Blockstack*/}
        {/*</button>*/}
        <Button type="primary" onClick={() => doOpenAuth()}>Sign In with Blockstack</Button>
      </p>
    </div>
  );
}

export default Signin;
