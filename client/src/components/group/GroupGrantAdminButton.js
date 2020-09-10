import React from "react";
import gql from "graphql-tag";
import { HeartOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupGrantAdminButton = ({ groupId, name, callback }) => {
  const [grantGroupAdmin] = useMutation(GRANT_GROUP_ADMIN_MUTATION, {
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
      title="确认设置为管理员吗？"
      onConfirm={() => {
        grantGroupAdmin();
        message.success("操作成功");
      }}
      okText="确认"
      cancelText="取消"
    >
      <HeartOutlined style={{ marginRight: 8 }} />
      同意
    </Popconfirm>
  );
};

const GRANT_GROUP_ADMIN_MUTATION = gql`
  mutation grantGroupAdmin($groupId: ID!, $name: String!) {
    grantGroupAdmin(groupId: $groupId, name: $name) {
      id
      admins {
        id
        username
        createdAt
      }
      applies {
        id
        username
        title
        body
        createdAt
      }
      applyCount
    }
  }
`;

export default GroupGrantAdminButton;
