import React, { useState } from 'react';
import { Switch, SegmentedControl, Textarea, Tablist, Paragraph, Pane, Label, Tab } from 'evergreen-ui'

const CreatePost = (props) => {
    const [previewMd, setPreviewMd] = useState(false)
    const tabs = ['Markdown', 'Render']
    return (
        <div>
            {/* <SegmentedControl 
                options={[{ label: 'Markdown', value: false }, { label: 'Render', value: true }]}
                width={160}
                height={40}
                value={previewMd}
                onChange={value => setPreviewMd(value)}
            /> */}
            <Switch height={25}/>
            <Pane height={120}>
                <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
            {tabs.map((tab, index) => (
            <Tab
                key={tab}
                id={tab}
                onSelect={() => setPreviewMd(tab == 'Render')}
                isSelected={true}
                aria-controls={`panel-${tab}`}
            >
                {tab}
            </Tab>
            ))}
        </Tablist>
            <Pane padding={16} background="tint1" flex="1">
                {tabs.map((tab, index) => (
                <Pane
                    key={tab}
                    id={`panel-${tab}`}
                    role="tabpanel"
                    aria-labelledby={tab}
                >
                    <Paragraph>Panel {tab}</Paragraph>
                </Pane>
                ))}
            </Pane>
            </Pane>
            {previewMd ? <div>Nothing yet</div> :
            <Pane>
                <Label
                    htmlFor="textarea-2"
                    marginBottom={4}
                    display="block"
                >
                    Label
                </Label>
                <Textarea
                    id="textarea-2"
                    placeholder="Textarea placeholder..."
                />
            </Pane>
            }
        </div>
    )
}

export default CreatePost