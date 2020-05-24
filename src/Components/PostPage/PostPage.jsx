import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Modal, Button, Input, message } from 'antd'
import { FormOutlined } from '@ant-design/icons'

import PostObj from "../../models/Post"
import { getConfig } from 'radiks'
import { PageHeader, Divider, Comment, Avatar, Tooltip, Affix } from 'antd'
import { Switch, Link, Route, withRouter } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'
import Contestation from '../../models/Contestation';
import ContestationModal from '../ContestationModal';

export default class PostPage extends React.Component {
    constructor(props) {
        super(props);
        
        const postId = props.match.params.postId;

        this.beginContestation = this.beginContestation.bind(this);
        this.submitComment = this.submitComment.bind(this);

        const { userSession } = getConfig();
        const userData = userSession.loadUserData();

        this.state = {
            userData: userData,
            isLoading: true,
            comments: [],
            post: null,
            text: null,
            title: null,
            date: null,
            tagline: null,
            animals: ["alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat", "bear", "beaver", "blobfish", "buffalo", "camel", "chameleon", "cheetah", "chipmunk", "chinchilla", "chupacabra", "cormorant", "coyote", "crow", "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "octopus", "elephant", "ferret", "fox", "frog", "giraffe", "goose", "gopher", "grizzly", "hamster", "hedgehog", "hippo", "hyena", "jackal", "jackalope", "ibex", "ifrit", "iguana", "kangaroo", "kiwi", "koala", "kraken", "lemur", "leopard", "liger", "lion", "llama", "manatee", "mink", "monkey", "moose", "narwhal", "nyan cat", "orangutan", "otter", "panda", "penguin", "platypus", "python", "pumpkin", "quagga", "quokka", "rabbit", "raccoon", "rhino", "sheep", "shrew", "skunk", "squirrel", "tiger", "turtle", "unicorn", "walrus", "wolf", "wolverine", "wombat"],
            wallet: props.wallet,
            currentComment: null,
            isModalVisible: false,
            contestedPost: null
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

    handleOk = e => {
        console.log(e);
        this.setState({
            isModalVisible: false,
        });
      };
    
    handleCancel = e => {
        console.log(e);
        this.setState({
            isModalVisible: false,
        });
    };

    render() {
        return (
            <div className="wrapper">
                <Affix offsetTop={5}><PageHeader onBack={() => {this.props.history.goBack()}} title={<Link to="/"><div className="websiteNameSmall"> &nbsp;&nbsp; Anonym</div></Link>}
                extra={[
                    <Link to="/create" ><Button shape="round">Create New Post</Button></Link>,
                    <Button shape="round" onClick={this.props.showModal}>Wallet</Button>,
                    <Tooltip title={!this.props.userData ? "Not currently logged in" : this.props.userData.username}><Link to="/profile" ><Button shape="round">Profile</Button></Link></Tooltip>,
                ]}/></Affix>
                <Modal
                title="Report Post"
                visible={this.state.isModalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                >
                    <ContestationModal wallet={this.state.wallet} post={this.state.contestedPost} />
                </Modal>
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
                            <div className="row">
                                <div className="col-md-12">
                                    <Button size='large' className="btn-danger" onClick={() => this.beginContestation(this.state.post)}>Contest</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <Divider orientation="left">Comments</Divider>
                    {this.state.comments ? this.state.comments.map((comment) => (
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <Comment 
                                        avatar={<Avatar style={{backgroundColor: "#"+((1<<24)*Math.random()|0).toString(16), verticalAlign: 'middle'}} icon={<UserOutlined/>}/>}
                                        author={"Anonymous " + this.state.animals[Math.floor(Math.random() * this.state.animals.length)]}
                                        content={comment.attrs.excerpt}                        
                                        datetime={(new Date(comment.attrs.createdAt)).toLocaleDateString()}/>
                                </div>
                                <div className="col-md-6">
                                    <Button size='large' className="btn-success" onClick={() => this.beginContestation(comment)}>Contest</Button>
                                </div>
                            </div>
                        </div>))
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

    async beginContestation(post) {
        if (this.state.wallet == null) {
            message.error("You need to create register a Bitcoin Cash Wallet to report posts");
            return false;
        }

        const _post = post

        if (_post.attrs.status === PostObj.STATUS_UNCONTESTED) {
            _post.update({state: PostObj.STATE_CONTESTED});
            await _post.save();
        }

        if (post.attrs.objType === PostObj.TYPE_POST) {
            this.setState({ post: _post});
        }
        

        this.setState({ contestedPost: _post, isModalVisible: true});
    }
}