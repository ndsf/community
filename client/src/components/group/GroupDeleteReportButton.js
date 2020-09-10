import React from "react";
import gql from "graphql-tag";
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupDeleteReportButton = ({ groupId, postId, reportId, callback }) => {
  const [removeGroupPostReport] = useMutation(DELETE_GROUP_REPORT_MUTATION, {
    variables: {
      groupId,
      postId,
      reportId
    },
    update(proxy) {
      if (callback) callback();
    }
  });

  return (
    <Popconfirm
      title="确认忽略举报吗？"
      onConfirm={() => {
        removeGroupPostReport();
        message.success("操作成功");
      }}
      okText="确认"
      cancelText="取消"
    >
      <DeleteOutlined style={{ marginRight: 8 }} />
      忽略
    </Popconfirm>
  );
};

const DELETE_GROUP_REPORT_MUTATION = gql`
  mutation removeGroupPostReport($groupId: ID!, $postId: ID!, $reportId: ID!) {
    removeGroupPostReport(
      groupId: $groupId
      postId: $postId
      reportId: $reportId
    ) {
      id
      body
      posts {
        id
        title
        body
        likes {
          username
        }
        likeCount
        reports {
          id
          username
        }
      }
      applies {
        username
        title
        body
      }
      admins {
        createdAt
        username
      }
    }
  }
`;

export default GroupDeleteReportButton;
