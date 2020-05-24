import React from 'react';
import './Home.css'
import Post from "./Posts/Post";
import {SearchInput} from "evergreen-ui";
import PostObj from "../models/Post"
import Wallet from "./Wallet/Wallet";
import {Route} from "react-router";
import { Link } from 'react-router-dom';
import { BackTop, PageHeader, Button, Tooltip, Affix } from 'antd';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isLoading: true, posts: [] }

        this.fetchData = async () => {
            const _posts = await PostObj.fetchList({objType: PostObj.TYPE_POST});
            this.setState({
                isLoading: false,
                posts: _posts,
                searchInput: "",
            })
        }
    };

    render() {
        return (
            <div className="homepage">
                <Affix offsetTop={5}><PageHeader title={<Link to="/"><div className="websiteNameSmall"> &nbsp;&nbsp; Anonym</div></Link>}
                extra={[
                    <Link to="/create" ><Button shape="round">Create New Post</Button></Link>,
                    <Button shape="round" onClick={this.props.showModal}>Wallet</Button>,
                    <Tooltip title={!this.props.userData ? "Not currently logged in" : this.props.userData.username}><Link to="/profile" ><Button shape="round">Profile</Button></Link></Tooltip>,
                ]}/>
                </Affix>
                <div className="websiteName">Anonym</div>
                <div style={{marginTop: '60px'}}>
                    <SearchInput value={this.state.searchInput} height={40} placeholder="Search posts..." width="876px" style={{borderRadius: "50px"}}
                        onChange={e => this.setState({searchInput: e.target.value})}/>
                </div>
                <div className="feed">
                    <div className="hottest">HOTTEST POSTS</div>
                    {this.state.isLoading && <span>Loading...</span>}
                    {this.state.posts.map((post) => (new RegExp(this.state.searchInput, 'i')).test(post.attrs.title) || (new RegExp(this.state.searchInput, 'i')).test(post.attrs.tagline) || (new RegExp(this.state.searchInput, 'i')).test(post.attrs.excerpt) ? (
                        <Post postId={'/' + post._id} createdAt={post.attrs.createdAt} postTitle={post.attrs.title} tagline={post.attrs.tagline} text={post.attrs.excerpt}/>
                    ) : null)}
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