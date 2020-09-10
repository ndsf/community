import React from "react";
import gql from "graphql-tag";
import { HeartOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupGrantAdmissionButton = ({ groupId, name, callback }) => {
  const [grantGroupAdmission] = useMutation(GRANT_GROUP_ADMISSION_MUTATION, {
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
      title="确认同意加入吗？"
      onConfirm={() => {
        grantGroupAdmission();
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

const GRANT_GROUP_ADMISSION_MUTATION = gql`
    mutation grantGroupAdmission($groupId: ID!, $name: String!) {
        grantGroupAdmission(groupId: $groupId, name: $name) {
            id
            likes {
                id
                username
                createdAt
            }
            admissions {
                id
                username
                body
                createdAt
            }
            likeCount
        }
    }
`;

export default GroupGrantAdmissionButton;
