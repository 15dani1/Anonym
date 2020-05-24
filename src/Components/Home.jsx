import React from 'react';
import './Home.css'
import Post from "./Posts/Post";
import {SearchInput} from "evergreen-ui";
import PostObj from "../models/Post"
import Wallet from "./Wallet/Wallet";
import {Route} from "react-router";
import { BackTop } from 'antd';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isLoading: true, posts: [] }

        this.fetchData = async () => {
            const _posts = await PostObj.fetchList();
            this.setState({
                isLoading: false,
                posts: _posts
            })
        }
    };

    render() {
        return (
            <div className="homepage">
                <div className="websiteName">Anonym</div>
                <div style={{marginTop: '60px'}}>
                    <SearchInput height={40} placeholder="Search posts..." width="876px" style={{borderRadius: "50px"}}/>
                </div>
                <div className="feed">
                    <div className="hottest">HOTTEST POSTS</div>
                    {this.state.isLoading && <span>Loading...</span>}
                    {this.state.posts.map((post) => (
                        <Post postId={'/' + post._id} createdAt={post.attrs.createdAt} postTitle={post.attrs.title} tagline={post.attrs.tagline} text={post.attrs.excerpt}/>
                    ))}
                </div>
                <BackTop />
                    <strong className="site-back-top-basic"></strong>
            </div>
        )
    }
// Wallet 'icon'
    componentDidMount() {
        this.fetchData();
    }
}