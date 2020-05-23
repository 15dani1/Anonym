import React from 'react';
import { Link } from 'react-router-dom';

import './Post.css'

export default class Post extends React.Component {
    render() {
        return(
            <div className={"postPreview"}>
                <Link to={this.props.postId}>
                    <div className="postTitle">{this.props.postTitle}</div>
                </Link>
                <div className="tagline">{this.props.tagline}</div>
                <div className="previewContainer">
                    <div className="text">{this.props.text}</div>
                    <div className="previewText"/>
                </div>
            </div>
        )
    }
}
