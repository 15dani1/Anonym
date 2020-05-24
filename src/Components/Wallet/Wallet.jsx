import React from 'react';
import SimpleWallet from "simple-bitcoin-wallet";
import { Button, Input } from 'antd';
import './Wallet.css'

export default class Wallet extends React.Component {

    state = {
        wallet: null
    }

    constructor(props) {
        super(props);
        this.createWallet = this.createWallet.bind(this);
    }

    createWallet() {
        const simpleWallet = new SimpleWallet();
        this.setState({wallet: simpleWallet});
        console.log(simpleWallet.mnemonic);
        this.props.setWallet();
    }

    loadWallet() {

    }

    render() {
        const wallet = this.state.wallet;
        return (
            <div>
                { wallet ? <div>
                                <div className="warning">This is your 12 word mnemonic. Save it somewhere and don't share it!</div>
                                <div className="mnemonic">{this.state.wallet.mnemonic}</div>
                            </div> :
                        <div>
                            <p><Button type="primary" onClick={this.createWallet}>Create A New Wallet</Button></p>
                            <p> or </p>
                            <Input placeholder="Enter your 12 word mnemonic"/>
                            <p><Button type="primary">Use my Existing Wallet</Button></p>
                        </div>
                }
            </div>
        )
    }
}