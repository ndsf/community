import React from "react";
import gql from "graphql-tag";
import {Icon, message, Popconfirm} from "antd";
import {useMutation} from "@apollo/react-hooks";

import {FETCH_USER_QUERY} from "../../utils/graphql";

const UserClearNotificationButton = () => {
    const [clearNotification] = useMutation(CLEAR_NOTIFICATION_MUTATION, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_USER_QUERY
            });

            console.log(result)

            // data.getUser.notifications = [];
            //
            // proxy.writeQuery({query: FETCH_USER_QUERY, data});
            // if (callback) callback();
        }
    });

    return (
        <Popconfirm
            title="确认清空通知吗？"
            onConfirm={() => {
                clearNotification();
                message.success("通知已清空");
            }}
            okText="确认"
            cancelText="取消"
        >
            <Icon type="delete" style={{marginRight: 8}}/>
            清空通知
        </Popconfirm>
    );
};

const CLEAR_NOTIFICATION_MUTATION = gql`
    mutation clearNotification {
        clearNotification
    }
`;

export default UserClearNotificationButton;
