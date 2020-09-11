import React from "react";
import {Form} from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {Button, Input, message, Upload} from "antd";

import {useForm} from "../../utils/hooks";
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {FETCH_GROUPS_QUERY} from "../../utils/graphql";
import {UploadOutlined} from "@ant-design/icons";
import {slugify} from "transliteration";

const {TextArea} = Input;

const GroupForm = () => {
    const {values, onChange, onSubmit, setAvatar} = useForm(
        createGroupCallBack,
        {
            body: "",
            bio: "",
            avatar: ""
        }
    );

    const props = {
        name: "file",
        accept: ".png, .jpg, .jpeg",
        action: "http://localhost:5000/upload",
        onChange(info) {
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


    const [createGroup, {error}] = useMutation(CREATE_GROUP_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_GROUPS_QUERY
            });

            data.getGroups = [result.data.createGroup, ...data.getGroups];
            proxy.writeQuery({query: FETCH_GROUPS_QUERY, data});
            values.body = "";
            values.bio = "";
            values.avatar = "";
        }
    });

    function createGroupCallBack() {
        createGroup();
    }

    return (
        <Form layout="vertical" onSubmit={onSubmit}>
            <Form.Item label="标题">
                <Input
                    placeholder="标题"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error}
                />
            </Form.Item>
            <Form.Item label="简介">
                <TextArea
                    placeholder="简介"
                    name="bio"
                    onChange={onChange}
                    value={values.bio}
                    error={error}
                    autosize={{minRows: 3, maxRows: 5}}
                />
            </Form.Item>
            <Form.Item label="图片">
                <Input
                    placeholder="图片"
                    name="avatar"
                    onChange={onChange}
                    value={values.avatar}
                    error={error}
                />
            </Form.Item>
            <Form.Item>
                <Upload {...props}>
                    <Button>
                        <UploadOutlined/> 上传图片
                    </Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary">
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

const CREATE_GROUP_MUTATION = gql`
    mutation createGroup($body: String!, $bio: String!, $avatar: String!) {
        createGroup(body: $body, bio: $bio, avatar: $avatar) {
            id
            body
            createdAt
            username
            bio
            avatar
            posts {
                id
                username
                title
                body
                createdAt
            }
            likeCount
            likes {
                id
                createdAt
                username
            }
            admins {
                createdAt
                username
            }
            admissions {
                id
                body
                createdAt
                username
            }
            admissionCount
        }
    }
`;

export default GroupForm;
