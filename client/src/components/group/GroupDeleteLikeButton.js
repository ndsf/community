import React from "react";
import gql from "graphql-tag";
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupDeleteLikeButton = ({ groupId, name, callback }) => {
    const [deleteGroupLike] = useMutation(DELETE_GROUP_LIKE_MUTATION, {
        variables: {
            groupId,
            name
        },
        update(proxy) {
            if (callback) callback();
        }
    });

    return (
        <Popconfirm
            title="确认踢出成员吗？"
            onConfirm={() => {
                deleteGroupLike();
                message.success("操作成功");
            }}
            okText="确认"
            cancelText="取消"
        >
            <DeleteOutlined style={{ marginLeft: 4, marginRight: 4 }} />
            踢出
        </Popconfirm>
    );
};

const DELETE_GROUP_LIKE_MUTATION = gql`
    mutation grantGroupAdmission($groupId: ID!, $name: String!) {
        grantGroupAdmission(groupId: $groupId, name: $name) {
            id
            admins {
                id
                username
                createdAt
            }
            likes {
                id
                username
                createdAt
            }
            likeCount
        }
    }
`;

export default GroupDeleteLikeButton;
