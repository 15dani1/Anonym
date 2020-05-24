import React from 'react';
import { Button, Input, message } from 'antd'
import { FormOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'
import Contestation from '../models/Contestation';

export default class ContestationModal extends React.Component {
    state = {
        hasContested: true,
    }

    constructor(props) {
        super(props);
        this.createContestation = this.createContestation.bind(this);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        This Post is being contested
                    </div>
                </div>
                { !this.state.hasContested 
                    ? <div>
                        <div className="row">
                            <div className="col-md-12">
                                <Input size="large" placeholder="Amount" prefix={<FormOutlined/>} onChange={e => this.setState({contestationAmount: e.target.value})} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Button size="large" className="btn-success" onClick={() => this.createContestation(Contestation.DIRECTION_KEEP)}>Keep Up</Button>
                            </div>
                            <div className="col-md-6">
                                <Button size="large" className="btn-danger" onClick={() => this.createContestation(Contestation.DIRECTION_TAKE_DOWN)}>Take Down</Button>
                            </div>
                        </div>
                        </div>
                    : <div className="row">
                        <div className="col-md-12">
                            You have already contested this post
                        </div>
                    </div>
                }
            </div>
        )
    }

    async setHasContested() {
        const contestations = await Contestation.fetchOwnList({post_id: this.props.post._id});
        this.setState({hasContested: contestations.length !== 0})
    }

    async createContestation(direction) {
        const _contestation = new Contestation({
            post_id: this.props.post._id,
            amount: parseFloat(this.state.contestationAmount), //TODO: ERROR HANDLING
            direction: direction,
            wallet_address: this.props.wallet
        })

        await _contestation.save()

        const _post = this.props.post;
        const lastContestation = Math.max.apply(Math, _post.contestations.map(function(o) { return o.attrs.updatedAt; }));
        const delay = Date.now() - lastContestation;
        _post.update({ betDelta: delay });

        // TODO: Trigger the end contestation event?
        await _post.save();

        this.setState({hasContested: true});
        message.success("Thank you for your opinion");
    }

    componentDidMount() {
        this.setHasContested()
    }
}