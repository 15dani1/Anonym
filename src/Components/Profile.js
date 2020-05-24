import React from 'react';
import {
  Person,
} from 'blockstack';
import { useConnect } from '@blockstack/connect';
import Post from "./Posts/Post"
import PostObj from '../models/Post'
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css'
import { Button, Typography, PageHeader, Tooltip, Affix } from 'antd'

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export const Profile = ({ userData, handleSignOut, history, showModal }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState(userData.username);
  const [person, setPerson] = React.useState(new Person(userData.profile));
  const [posts, setPosts] = React.useState([]);

  const { authOptions } = useConnect();
  const { userSession } = authOptions;

  const fetchData = async () => {
    setLoading(true)

    const _posts = await PostObj.fetchOwnList();
    setPosts(_posts);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <div style={{height: '100%'}}>
      <Affix offsetTop={5}>
      <PageHeader onBack={() => {history.goBack()}} title={<Link to="/"><div className="websiteNameSmall"> &nbsp;&nbsp; Anonym</div></Link>}
                extra={[
                    <Link to="/create" ><Button shape="round">Create New Post</Button></Link>,
                    <Button shape="round" onClick={showModal}>Wallet</Button>,
                    <Tooltip title={!userData ? "Not currently logged in" : userData.username}><Link to="/profile" ><Button shape="round">Profile</Button></Link></Tooltip>,
                ]}/></Affix>
    <div className="container-fluid" style={{height: '100%', margin: 'auto', width: '80%'}}>
      <br/>
      <div className="row">
        <div className="col-md-offset-3 col-md-6">
          <div className="col-md-12">
            <div className="avatar-section">
              <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
              <div className="username">
                <h1><span id="heading-name">{ person.name() ? person.name() : 'Anonymous User' }</span></h1>
                <span><Typography>{ username }&nbsp;|&nbsp;
                  <Button size="large" danger onClick={ handleSignOut.bind(this)}>Logout</Button></Typography>
                </span> 
              </div>
            </div>
          </div>
          <div className="col-md-offset-6 col-md-1 float-right">
          {/* <Button size="large" className="btn-danger" ><Link to="/create">Logout</Link></Button> */}
          <Button size="large" className="btn-success"><Link to="/create">Create New Post</Link></Button>
          </div>
          <div className="feed">
              <div className="hottest">YOUR POSTS</div>
              {isLoading && <span>Loading...</span>}
              {posts.map((post) => (
                  <Post postId={'/' + post._id} postTitle={post.attrs.title} tagline={post.attrs.tagline} text={post.attrs.excerpt} createdAt={post.attrs.createdAt}/>
              ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Profile
