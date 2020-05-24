import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, Input, message } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import './PostPage.css'
import PostObj from "../../models/Post"
import { getConfig } from 'radiks'
import { PageHeader, Divider, Comment, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'
import Contestation from '../../models/Contestation';

export default class PostPage extends React.Component {
    constructor(props) {
        super(props);
        
        const postId = props.match.params.postId;

        this.beginContestation = this.beginContestation.bind(this);
        this.createContestation = this.createContestation.bind(this);
        this.submitComment = this.submitComment.bind(this);

        console.log(props.userData);
        const { userSession } = getConfig();
        const userData = userSession.loadUserData();

        this.state = {
            userData: userData,
            isLoading: true,
            hasContested: false,
            comments: [],
            post: null,
            text: null,
            title: null,
            date: null,
            tagline: null,
            animals: ["alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat", "bear", "beaver", "blobfish", "buffalo", "camel", "chameleon", "cheetah", "chipmunk", "chinchilla", "chupacabra", "cormorant", "coyote", "crow", "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "octopus", "elephant", "ferret", "fox", "frog", "giraffe", "goose", "gopher", "grizzly", "hamster", "hedgehog", "hippo", "hyena", "jackal", "jackalope", "ibex", "ifrit", "iguana", "kangaroo", "kiwi", "koala", "kraken", "lemur", "leopard", "liger", "lion", "llama", "manatee", "mink", "monkey", "moose", "narwhal", "nyan cat", "orangutan", "otter", "panda", "penguin", "platypus", "python", "pumpkin", "quagga", "quokka", "rabbit", "raccoon", "rhino", "sheep", "shrew", "skunk", "squirrel", "tiger", "turtle", "unicorn", "walrus", "wolf", "wolverine", "wombat"],
            wallet: props.wallet,
            currentComment: null
        }

        this.fetchPost = async () => {
            const post = await PostObj.findById(postId);
            console.log(post.attrs.state);
            //TODO: Null check post
            const postFile = await userSession.getFile(post.attrs.fileId, { decrypt: false});

            this.setState({
                isLoading: true,
                title: post.attrs.title,
                tagline: post.attrs.tagline,
                date: (new Date(post.attrs.createdAt)).toLocaleString(),
                text: postFile,
                post: post
            })

            const contestations = await Contestation.fetchOwnList({post_id: post._id});
            this.setState({hasContested: contestations.length !== 0})

            this.fetchComments();
        }

        this.fetchComments = async () => {
            if (this.state.post === null) return;

            const _comments = await PostObj.fetchList({
                objType: PostObj.TYPE_COMMENT, 
                post_id: this.state.post._id
            })

            this.setState({
                comments: _comments
            })
        }
    }

    render() {
        return (
            <div className="wrapper">
                <PageHeader onBack={() => {this.props.history.goBack()}} title={<div className="websiteNameSmall"> &nbsp;&nbsp; Anonym</div>}/>
                
                {this.state.post === PostObj.STATE_REMOVED ?
                    <div className="title">This Post Has Been Removed</div>
                  : <div>
                        <div className="title">{this.state.title}</div>
                        <div className="tagline">{this.state.tagline}</div>
                        <div className="date">{this.state.date}</div>
                        <div className="postText">
                            <ReactMarkdown source={this.state.text} />
                        </div>
                        <div className="container">
                            {this.state.post != null && this.state.post.attrs.state === PostObj.STATE_UNCONTESTED &&
                                <div className="row">
                                    <div className="col-md-12">
                                        <Button size='large' className="btn-danger" onClick={this.beginContestation}>Contest</Button>
                                    </div>
                                </div>
                            }
                            {this.state.post != null && this.state.post.attrs.state === PostObj.STATE_CONTESTED &&
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
                            }
                        </div>
                    </div>
                }
                <Divider orientation="left">Comments</Divider>
                    {this.state.comments ? this.state.comments.map((comment) => (
                        <Comment 
                        avatar={<Avatar style={{backgroundColor: "#"+((1<<24)*Math.random()|0).toString(16), verticalAlign: 'middle'}} icon={<UserOutlined/>}/>}
                        author={"Anonymous " + this.state.animals[Math.floor(Math.random() * this.state.animals.length)]}
                        content={comment.attrs.excerpt}                        
                        datetime={(new Date(comment.attrs.createdAt)).toLocaleDateString()}/>
                        ))
                        : <div>No comments</div>
                    }
                    {this.state.userData &&
                    <div>
                        <Input
                        value={this.state.currentComment}
                        onChange={e => this.setState({currentComment: e.target.value})}
                        placeholder="Enter Comment Here" style={{width: 800}}
                        autoSize={{ minRows: 10, maxRows: 30 }}
                        />
                        <Button size="large" onClick={this.submitComment}>Comment</Button>
                    </div>
                    }
                
            </div>
        )
    }

    componentDidMount() {
        this.fetchPost();
    }

    async submitComment() {
        console.log("Saving Comment");
        let post = new PostObj({
            username: this.state.userData.username,
            title: "",
            tagline: "",
            excerpt: this.state.currentComment,
            fileId: "",
            author_wallet: this.state.wallet.cashAddress,
            objType: PostObj.TYPE_COMMENT,
            post_id: this.state.post._id
          })
      
          await post.save();

        const _comments = this.state.comments;
        _comments.unshift(post);
        this.setState({comments: _comments});

        message.success("Post submitted!")
    }

    async beginContestation() {
        if (this.state.wallet == null) {
            message.error("You need to create register a Bitcoin Cash Wallet to report posts");
            return false;
        }

        const _post = this.state.post;
        _post.update({state: PostObj.STATE_CONTESTED});
        await _post.save();
        this.setState(
            { post: _post }
        )
    }

    async createContestation(direction) {
        const _contestation = new Contestation({
            post_id: this.state.post._id,
            amount: parseFloat(this.state.contestationAmount), //TODO: ERROR HANDLING
            direction: direction,
            wallet_address: this.state.wallet
        })

        await _contestation.save()

        const _post = this.state.post;
        const lastContestation = Math.max.apply(Math, _post.contestations.map(function(o) { return o.attrs.updatedAt; }));
        const delay = Date.now() - lastContestation;
        _post.update({ betDelta: delay });

        // TODO: Trigger the end contestation event?
        await _post.save();

        this.setState({hasContested: true});
        message.success("Thank you for your opinion");
    }
}