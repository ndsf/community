import React from "react";
import gql from "graphql-tag";
import { DeleteOutlined } from '@ant-design/icons';
import { message, Popconfirm } from "antd";
import {useMutation} from "@apollo/react-hooks";

const UserClearNotificationButton = ({callback}) => {
    const [clearNotification] = useMutation(CLEAR_NOTIFICATION_MUTATION, {
        update(proxy, result) {
            message.success("清空成功");
            if (callback) callback();
        }
    });

    return (
        <Popconfirm
            title="确认清空通知吗？"
            onConfirm={clearNotification}
            okText="确认"
            cancelText="取消"
        >
            <DeleteOutlined style={{marginRight: 8}} />
            清空通知
        </Popconfirm>
    );
};

const CLEAR_NOTIFICATION_MUTATION = gql`
    mutation clearNotification {
        clearNotification {
            notifications{
                id
                username
                createdAt
                body
            }
        }
    }
`;

export default UserClearNotificationButton;
