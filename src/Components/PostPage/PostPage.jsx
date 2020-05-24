import React from 'react';
import ReactMarkdown from 'react-markdown';
import './PostPage.css'
import PostObj from "../../models/Post"
import { getConfig } from 'radiks'
import { PageHeader, Divider, Comment, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

export default class PostPage extends React.Component {
    constructor(props) {
        super(props);
        
        const postId = props.match.params.postId;

        this.state = {
            isLoading: true,
            title: null,
            tagline: null,
            text: null,
            date: null,
            animals: ["alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat", "bear", "beaver", "blobfish", "buffalo", "camel", "chameleon", "cheetah", "chipmunk", "chinchilla", "chupacabra", "cormorant", "coyote", "crow", "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "octopus", "elephant", "ferret", "fox", "frog", "giraffe", "goose", "gopher", "grizzly", "hamster", "hedgehog", "hippo", "hyena", "jackal", "jackalope", "ibex", "ifrit", "iguana", "kangaroo", "kiwi", "koala", "kraken", "lemur", "leopard", "liger", "lion", "llama", "manatee", "mink", "monkey", "moose", "narwhal", "nyan cat", "orangutan", "otter", "panda", "penguin", "platypus", "python", "pumpkin", "quagga", "quokka", "rabbit", "raccoon", "rhino", "sheep", "shrew", "skunk", "squirrel", "tiger", "turtle", "unicorn", "walrus", "wolf", "wolverine", "wombat"]
        }

        this.fetchPost = async () => {
            const post = await PostObj.findById(postId);
            //TODO: Null check post
            console.log(post);
            const { userSession } = getConfig()
            const postFile = await userSession.getFile(post.attrs.fileId, { decrypt: false});

            this.setState({
                isLoading: true,
                title: post.attrs.title,
                tagline: post.attrs.tagline,
                text: post.attrs.excerpt,
                date: (new Date(post.attrs.createdAt)).toLocaleString(),
            })
        }
    }

    render() {
        return (
            <div className="wrapper">
                <PageHeader onBack={() => {this.props.history.goBack()}} title={<div className="websiteNameSmall"> &nbsp;&nbsp; Anonym</div>}/>
                
                <div className="title">{this.state.title}</div>
                <div className="tagline">{this.state.tagline}</div>
                <div className="date">{this.state.date}</div>
                <div className="postText">
                    <ReactMarkdown source={this.state.text} />
                </div>
                <Divider orientation="left">Comments</Divider>
                <Comment 
                    avatar={<Avatar style={{backgroundColor: "#"+((1<<24)*Math.random()|0).toString(16), verticalAlign: 'middle'}} icon={<UserOutlined/>}/>}
                    author={"Anonymous " + this.state.animals[Math.floor(Math.random() * this.state.animals.length)]}
                    content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}                        
                    datetime={(new Date()).toUTCString()}/>
                <Comment 
                    avatar={<Avatar style={{backgroundColor: "#"+((1<<24)*Math.random()|0).toString(16), verticalAlign: 'middle'}} icon={<UserOutlined/>}/>}
                    author={"Anonymous " + this.state.animals[Math.floor(Math.random() * this.state.animals.length)]}
                    content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}                        
                    datetime={(new Date()).toUTCString()}/>
                <Comment 
                    avatar={<Avatar style={{backgroundColor: "#"+((1<<24)*Math.random()|0).toString(16), verticalAlign: 'middle'}} icon={<UserOutlined/>}/>}
                    author={"Anonymous " + this.state.animals[Math.floor(Math.random() * this.state.animals.length)]}
                    content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}                        
                    datetime={(new Date()).toUTCString()}/>
                <Comment 
                    avatar={<Avatar style={{backgroundColor: "#"+((1<<24)*Math.random()|0).toString(16), verticalAlign: 'middle'}} icon={<UserOutlined/>}/>}
                    author={"Anonymous " + this.state.animals[Math.floor(Math.random() * this.state.animals.length)]}
                    content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}                        
                    datetime={(new Date()).toUTCString()}/>
            </div>
        )
    }
    

    componentDidMount() {
        this.fetchPost();
    }
}