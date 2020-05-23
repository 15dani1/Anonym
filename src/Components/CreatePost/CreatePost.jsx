import React, { useState } from 'react';
import { Radio, Input, Layout, Space, Button } from 'antd'
import ReactMarkdown from 'react-markdown';
import { FormOutlined, EditOutlined } from '@ant-design/icons'
import { useConnect } from '@blockstack/connect';

import 'antd/dist/antd.css'
import { makeUUID4 } from 'blockstack';
import PostObj from "../../models/Post"

const CreatePost = (props) => {
    const [previewMd, setPreviewMd] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [isPosted, setIsPosted] = useState(false);

    const { Header, Content, Footer } = Layout;
    const { TextArea } = Input;
    const tabs = ['Markdown', 'Render'];

    const { authOptions } = useConnect();
    const { userSession } = authOptions;

    const submitPost = async () => {
        const fileId = makeUUID4().split("-").slice(-1)[0] +".md"
        console.log("Saving Post Titled " + fileId);
        let post = new PostObj({
            username: props.userData.username,
            title: postTitle,
            tagline: "THIS IS A TAGLINE",
            excerpt: "Lorum Ipsum Facto",
            fileId: fileId
          })
      
          await post.save();
          await userSession.putFile(fileId, postDescription, {encrypt:false})

          setIsPosted(true);
    }

    return (
        <div style={{width: '100%', height: '100%', paddingTop: "60px"}}>
            <Layout className="feed" hasSider={false} style={{
                'margin': 'auto',
                'background-color': "white"}}>
                <Header style={{'background-color': "white"}}>
                <div className="postTitle">Create New Post</div>
                </Header>
            <Content style={{'margin': 'auto'}}>
                <Space direction="vertical" size="large">
                    <Input size="large" placeholder="Post Title" prefix={<FormOutlined/>} style={{width: 400}} onChange={e => setPostTitle(e.target.value)}/>
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
                    {isPosted && <span style={{'color': 'green'}}>Successfully posted!</span>}
                </Space>
            </Content>
            </Layout>
        </div>
    )
}

export default CreatePost