import React from 'react';
import './Home.css'
import Post from "./Posts/Post";

export default class Home extends React.Component {
    render() {
        return (
            <div className="homepage">
                <div className="websiteName">Website Name</div>
                <div className="feed">
                    <Post postTitle="Post Title Here" tagline="Here, you can write your tagline" text="here is a bunch of random sample texts haha yup yessir is this long enough yet. Nope I don't think so. we'll just keep typing then in this box haha. We'll get a third line on here as well. Is this good?"/>
                </div>
            </div>
        )
    }
}