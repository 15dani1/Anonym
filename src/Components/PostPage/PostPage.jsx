import React from 'react';
import ReactMarkdown from 'react-markdown';
import './PostPage.css'

export default class PostPage extends React.Component {
    render() {
        return (
            <div className="wrapper">
                <div className="websiteNameSmall">Website Name</div>
                <div className="title">{this.props.title}</div>
                <div className="tagline">{this.props.tagline}</div>
                <div className="postText">
                    <ReactMarkdown source={this.props.text} />
                </div>
            </div>
        )
    }
}