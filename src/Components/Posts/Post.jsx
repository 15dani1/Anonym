import React from 'react';
import './Post.css'

export default class Post extends React.Component {
    // TODO: Route to the post by clicking on this component
    render() {
        return(
            <div className={"postPreview"}>
                <div className="postTitle">{this.props.postTitle}</div>
                <div className="tagline">{this.props.tagline}</div>
                <div className="previewContainer">
                    <div className="text">{this.props.text}</div>
                    <div className="previewText"/>
                </div>
            </div>
        )
    }
}
