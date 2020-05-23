import React from 'react';
import './Home.css'
import Post from "./Posts/Post";
import {SearchInput} from "evergreen-ui";
import PostObj from "../models/Post"

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
                <div className="websiteName">Website Name</div>
                <div style={{marginTop: '60px'}}>
                    <SearchInput height={40} placeholder="Search posts..." width="876px" style={{borderRadius: "50px"}}/>
                </div>
                <div className="feed">
                    <div className="hottest">HOTTEST POSTS</div>
                    {this.state.isLoading && <span>Loading...</span>}
                    {this.state.posts.map((post) => (
                        <Post postTitle={post.attrs.text} tagline="Here, you can write your tagline" text="here is a bunch of random sample texts haha yup yessir is this long enough yet. Nope I don't think so. we'll just keep typing then in this box haha. We'll get a third line on here as well. Is this good?"/>
                    ))}
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.fetchData();
    }
}