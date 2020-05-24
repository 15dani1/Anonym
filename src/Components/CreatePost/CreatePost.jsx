import React, { useState } from 'react';
import { Radio, Input, Layout, Space, Button, message, PageHeader, Tooltip, Affix } from 'antd'
import ReactMarkdown from 'react-markdown';
import { FormOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import { Switch, Link, Route, withRouter } from 'react-router-dom'
import { useConnect } from '@blockstack/connect';

import 'antd/dist/antd.css'
import { makeUUID4 } from 'blockstack';
import PostObj from "../../models/Post"
import Wallet from "../Wallet/Wallet"

const CreatePost = (props) => {
    const [previewMd, setPreviewMd] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postTagline, setPostTagline] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postExcerpt, setPostExcerpt] = useState("");

    const { Header, Content, Footer } = Layout;
    const { TextArea } = Input;

    const { authOptions } = useConnect();
    const { userSession } = authOptions;

    const submitPost = async () => {
        const fileId = makeUUID4().split("-").slice(-1)[0] +".md"
        console.log("Saving Post Titled " + fileId);
        let post = new PostObj({
            username: props.userData.username,
            title: postTitle,
            tagline: postTagline,
            excerpt: postExcerpt,
            fileId: fileId,
            author_wallet: props.wallet.cashAddress
          })
      
          await post.save();
          await userSession.putFile(fileId, postDescription, {encrypt:false})

        message.success("Post submitted!")
    }

    if (props.wallet === null && !props.isVisible) {
        props.showModal();
    }

    return (
        <div className="wrapper">
            <Affix offsetTop={5}><PageHeader onBack={() => {props.history.goBack()}} title={<Link to="/"><div className="websiteNameSmall"> &nbsp;&nbsp; Anonym</div></Link>}
                extra={[
                    <Link to="/create" ><Button shape="round">Create New Post</Button></Link>,
                    <Button shape="round" onClick={props.showModal}>Wallet</Button>,
          <Tooltip title={!props.userData ? "Not currently logged in" : props.userData.username}>
          <Link to="/profile" ><Button shape="round">Profile</Button></Link></Tooltip>,
                ]}/>
                </Affix>
        <div style={{width: '100%', height: '100%'}}>
            <Layout className="feed" hasSider={false} style={{
                'margin': 'auto',
                'background-color': "white"}}>
                <Header style={{'background-color': "white"}}>
                <div className="postTitle">Create New Post</div>
                </Header>
            <Content style={{'margin': 'auto'}}>
                <Space direction="vertical" size="large">
                    <Input size="large" placeholder="Title" prefix={<FormOutlined/>} style={{width: 400}} onChange={e => setPostTitle(e.target.value)}/>
                    <Input size="medium" placeholder="Tagline" prefix={<FormOutlined/>} style={{width: 600}} onChange={e => setPostTagline(e.target.value)}/>
                    <Input size="medium" placeholder="Excerpt" prefix={<FormOutlined/>} style={{width: 600}} onChange={e => setPostExcerpt(e.target.value)}/>
                    <Radio.Group defaultValue="Markdown" buttonStyle="solid">
                        <Radio.Button onChange={() => setPreviewMd(false)} value="Markdown">Markdown</Radio.Button>
                        <Radio.Button onChange={() => setPreviewMd(true)} value="Render">Render</Radio.Button>
                    </Radio.Group>
                    {previewMd ? <ReactMarkdown source={postDescription}/>: 
                    <TextArea
                    value={postDescription}
                    onChange={e => setPostDescription(e.target.value)}
                    placeholder="Enter Text Here" style={{width: 800}}
                    autoSize={{ minRows: 10, maxRows: 30 }}
                    />}
                    <Button size="large" onClick={submitPost}>Submit</Button>
                </Space>
            </Content>
            </Layout>
        </div>
        </div>
    )
}

export default CreatePost