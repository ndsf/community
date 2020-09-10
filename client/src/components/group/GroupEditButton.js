import React, {useRef, useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {EditOutlined, UploadOutlined} from '@ant-design/icons';
import {Form} from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {Button, Input, message, Modal, Upload} from "antd";
import {slugify} from "transliteration";

const {TextArea} = Input;
const GroupEditButton = ({groupId, group, callback}) => {
    const bodyInputRef = useRef(null);
    const bioInputRef = useRef(null);
    const avatarInputRef = useRef(null);
    const [body, setBody] = useState(group.body);
    const [bio, setBio] = useState(group.bio);
    const [avatar, setAvatar] = useState(group.avatar);
    const [visible, setVisible] = useState(false);

    const props = {
        name: "file",
        accept: ".png, .jpg, .jpeg",
        action: "http://localhost:5000/upload",
        onChange(info) {
            console.log(info);
            if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === "done") {
                message.success(
                    `${slugify(info.file.name, {
                        ignore: ["."]
                    })} file uploaded successfully`
                );
                setAvatar(`/uploads/${slugify(info.file.name, {ignore: ["."]})}`);
            } else if (info.file.status === "error") {
                //message.error(`${slugify(info.file.name, { ignore: ['.'] })} file upload failed.`);
                setAvatar(`/uploads/${slugify(info.file.name, {ignore: ["."]})}`);
            }
        }
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = e => {
        if (body.trim() !== "") editGroup();
        setVisible(false);
    };

    const handleCancel = e => {
        setVisible(false);
    };

    const [editGroup] = useMutation(
        EDIT_GROUP,
        {
            variables: {groupId, body, bio, avatar},
            update(proxy) {
                if (callback) callback();
                bodyInputRef.current.blur();
                bioInputRef.current.blur();
                avatarInputRef.current.blur();
            }
        }
    );


    return (
        <div>
      <span onClick={showModal}>
        <EditOutlined style={{marginRight: 8}}/>
        修改
      </span>
            <Modal
                title="修改小组信息"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item label="标题">
                        <Input
                            placeholder="标题"
                            name="body"
                            onChange={event => setBody(event.target.value)}
                            value={body}
                            ref={bodyInputRef}
                        />
                    </Form.Item>
                    <Form.Item label="简介">
                        <TextArea
                            placeholder="简介"
                            name="bio"
                            onChange={event => setBio(event.target.value)}
                            value={bio}
                            ref={bioInputRef}
                            autosize={{minRows: 3, maxRows: 5}}
                        />
                    </Form.Item>
                    <Form.Item label="图片">
                        <Input
                            placeholder="图片"
                            name="avatar"
                            onChange={event => setAvatar(event.target.value)}
                            value={avatar}
                            ref={avatarInputRef}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Upload {...props}>
                            <Button>
                                <UploadOutlined/> 上传图片
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

const EDIT_GROUP = gql`
    mutation editGroup(
        $groupId: ID!
        $body: String!
        $bio: String!
        $avatar: String!
    ) {
        editGroup(
            groupId: $groupId,
            body: $body,
            bio: $bio,
            avatar: $avatar
        ) {
            id
            body
            bio
            avatar
        }
    }
`;

export default GroupEditButton;
