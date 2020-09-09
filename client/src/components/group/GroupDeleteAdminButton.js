import React from "react";
import gql from "graphql-tag";
import { Popconfirm, Icon, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupDeleteAdminButton = ({ groupId, name, callback }) => {
  const [deleteGroupAdminPost] = useMutation(DELETE_GROUP_ADMIN_MUTATION, {
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
      title="确认撤销管理员吗？"
      onConfirm={() => {
        deleteGroupAdminPost();
        message.success("操作成功");
      }}
      okText="确认"
      cancelText="取消"
    >
      <Icon type="delete" style={{ marginRight: 8 }} />
      撤销
    </Popconfirm>
  );
};

const DELETE_GROUP_ADMIN_MUTATION = gql`
  mutation grantGroupAdmin($groupId: ID!, $name: String!) {
    grantGroupAdmin(groupId: $groupId, name: $name) {
      id
      admins {
        id
        username
        createdAt
      }
    }
  }
`;

export default GroupDeleteAdminButton;
