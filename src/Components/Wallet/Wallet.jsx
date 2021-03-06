import React from 'react';
import SimpleWallet from "simple-bitcoin-wallet";
import { Button, Input, Form } from 'antd';
import './Wallet.css'

export default class Wallet extends React.Component {

    state = {
        wallet: null,
        newWallet: false,
        balance: "loading..."
    }

    constructor(props) {
        super(props);
        this.state.wallet = props.wallet;
        if (props.wallet !== null) {
            this.getBalance();
        }

        this.createWallet = this.createWallet.bind(this);
        this.loadWallet = this.loadWallet.bind(this);
    }

    createWallet() {
        const simpleWallet = new SimpleWallet();

        this.setState({wallet: simpleWallet, newWallet: true});
        console.log(simpleWallet.mnemonic);

        this.props.setWallet(simpleWallet);
    }

    loadWallet(values) {
        console.log(values);

        const simpleWallet = new SimpleWallet(values.mnemonic);
        this.setState({wallet: simpleWallet});
        this.getBalance();

        this.props.setWallet(simpleWallet);
    }

    async getBalance() {
        this.setState({balance: await this.state.wallet.getBalance()});
    }

    render() {
        const wallet = this.state.wallet;
        const newWallet = this.state.newWallet;
        return (
            <div>
                {newWallet ? <div>
                        <div className="warning">This is your 12 word mnemonic. Save it somewhere and don't share it!</div>
                        <div className="mnemonic">{this.state.wallet.mnemonic}</div>
                    </div> :
                    !wallet ? <div>
                            <p><Button type="primary" onClick={this.createWallet}>Create A New BCH Wallet</Button></p>
                            <p> or </p>
                            <Form name="basic" onFinish={this.loadWallet} onFinishFailed={this.onFinishFailed}>
                                <Form.Item name="mnemonic" rules={[
                                    {
                                        pattern: /^([A-Za-z]+\ ){11}([A-Za-z]+)$/,
                                        required: true,
                                        message: 'Please input a 12 word mnemonic!',
                                    },
                                ]}>
                                    <Input placeholder="Enter your 12 word mnemonic"/>
                                </Form.Item>
                                <Form.Item>
                                    <p><Button type="primary" htmlType="submit">Use my Existing BCH Wallet</Button></p>
                                </Form.Item>
                            </Form>
                        </div> :
                        <div>Current wallet balance: {this.state.balance}</div>
                }
            </div>
        )
    }
}