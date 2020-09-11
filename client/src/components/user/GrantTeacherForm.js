import React, {useContext, useRef, useState} from "react";
import {AuthContext} from "../../context/auth";
import {Form} from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {Button, Input, message} from "antd";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";

const {TextArea} = Input;

const GrantTeacherForm = () => {
    const {user} = useContext(AuthContext);

    const teacherUsernameInputRef = useRef(null);
    const [teacherUsername, setTeacherUsername] = useState("");

    const [grantTeacher] = useMutation(GRANT_TEACHER, {
        update: () => {
            setTeacherUsername("");
        },
        variables: {
            username: teacherUsername
        },
        onError(err) {
            console.error(err);
            message.error(err.message);
        }
    });

    return (
        <>
            {/* 批量导入 */}
            {user && user.username === "admin" && // 已登录且是管理员时显示
            <Form>
                <Form.Item>
                    <TextArea
                        type="text"
                        placeholder="请输入用户名，如果不是老师则会设置为老师，如果已经是老师则会取消老师资格"
                        name="teacherUsername"
                        value={teacherUsername}
                        onChange={event => setTeacherUsername(event.target.value)}
                        ref={teacherUsernameInputRef}
                        autosize={{minRows: 4, maxRows: 100}}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="submit"
                        disabled={teacherUsername.trim() === ""}
                        onClick={grantTeacher}
                    >
                        提交
                    </Button>
                </Form.Item>
            </Form>
            }
        </>);
};

const GRANT_TEACHER = gql`
    mutation($username: String!) {
        grantTeacher(username: $username) {
            id
            username
            isTeacher
        }
    }
`;

export default GrantTeacherForm;