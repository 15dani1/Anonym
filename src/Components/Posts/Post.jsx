import React from 'react';
import { Link } from 'react-router-dom';

import './Post.css'

export default class Post extends React.Component {
    // TODO: Route to the post by clicking on this component
    render() {
        return(
            <div className={"postPreview"}>
                <Link to={this.props.postId}>
                    <div className="postTitle">{this.props.postTitle}</div>
                </Link>
                <div className="tagline">{this.props.tagline}</div>
                <div className="previewContainer">
                    <div className="date">{this.props.createdAt}</div>
                    <div className="text">{this.props.text}</div>
                    <div className="previewText"/>
                </div>
            </div>
        )
    }
}
