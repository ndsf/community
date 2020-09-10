import React from "react";
import gql from "graphql-tag";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupReportPostButton = ({ groupId, postId, callback }) => {
  const [reportGroupPost] = useMutation(REPORT_GROUP_POST_MUTATION, {
    variables: {
      groupId,
      postId
    },
    update(proxy) {
      if (callback) callback();
    }
  });

  return (
    <Popconfirm
      title="确认举报/取消举报帖子吗？"
      onConfirm={() => {
        reportGroupPost();
        message.success("操作成功");
      }}
      okText="确认"
      cancelText="取消"
    >
      <InfoCircleOutlined style={{ marginRight: 8 }} />
      举报
    </Popconfirm>
  );
};

const REPORT_GROUP_POST_MUTATION = gql`
  mutation reportGroupPost($groupId: ID!, $postId: ID!) {
    reportGroupPost(groupId: $groupId, postId: $postId) {
      id
      posts {
        id
        title
        body
        createdAt
        username
        comments {
          body
          createdAt
          username
        }
        reports {
          id
          username
        }
        commentCount
        top
        qualified
      }
      postCount
    }
  }
`;

export default GroupReportPostButton;
