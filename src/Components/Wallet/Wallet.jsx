import React from 'react';
import SimpleWallet from "simple-bitcoin-wallet";
import { Button, Input, Form } from 'antd';
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
        this.props.setWallet(simpleWallet);
    }

    loadWallet(values) {
        console.log(values);
        const simpleWallet = new SimpleWallet(values.mnemonic);
        this.props.setWallet(simpleWallet);
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
                            <p><Button type="primary" onClick={this.createWallet}>Create A New BCH Wallet</Button></p>
                            <p> or </p>
                            <Form name="basic" onFinish={this.loadWallet} onFinishFailed={this.onFinishFailed}>
                                <Form.Item name="mnemonic" rules={[
                                    {
                                        pattern: /([A-Za-z]+\ ){11}([A-Za-z]+)/,
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
                        </div>
                }
            </div>
        )
    }
}