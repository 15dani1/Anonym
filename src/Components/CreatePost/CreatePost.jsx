import React, { useState } from 'react';
import { Radio, Input, Layout, Space, Button } from 'antd'
import ReactMarkdown from 'react-markdown';
import { FormOutlined, EditOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

const CreatePost = (props) => {
    const [previewMd, setPreviewMd] = useState(false)
    const [postTitle, setPostTitle] = useState("")
    const [postDescription, setPostDescription] = useState("")
    const { Header, Content, Footer } = Layout;
    const { TextArea } = Input;
    const tabs = ['Markdown', 'Render']
    return (
        <div>
            <Layout className="feed" hasSider={false} style={{
                'margin': 'auto',
                'background-color': "white"}}>
                <Header style={{'background-color': "white"}}>
                <div className="postTitle">Create New Post</div>
                </Header>
            {/* <SegmentedControl 
                options={[{ label: 'Markdown', value: false }, { label: 'Render', value: true }]}
                width={160}
                height={40}
                value={previewMd}
                onChange={value => setPreviewMd(value)}
            /> */}
            <Content style={{'margin': 'auto'}}>
            <Space direction="vertical" size="large">

            <Input size="large" placeholder="Post Title" prefix={<FormOutlined/>} style={{width: 400}}/>
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
            <Button size="large">Submit</Button>
            </Space>
            </Content>
            </Layout>
        </div>
    )
}

export default CreatePost