import React from 'react';
import ReactMarkdown from 'react-markdown';
import './PostPage.css'
import PostObj from "../../models/Post"
import { getConfig } from 'radiks'

export default class PostPage extends React.Component {
    constructor(props) {
        super(props);

        const postId = props.match.params.postId;

        this.state = {
            isLoading: true,
            title: null,
            tagline: null,
            text: null
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
                date: post.attrs.createdAt,
            })
        }
    }

    render() {
        return (
            <div className="wrapper">
                <div className="websiteNameSmall">Website Name</div>
                <div className="title">{this.state.title}</div>
                <div className="tagline">{this.state.tagline}</div>
                <div className="tagline">{this.state.date}</div>
                <div className="postText">
                    <ReactMarkdown source={this.state.text} />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.fetchPost();
    }
}