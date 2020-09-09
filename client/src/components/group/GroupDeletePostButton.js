import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Popconfirm, Icon, message } from "antd";

const GroupDeletePostButton = ({ groupId, postId, callback }) => {
  const [deleteGroupPost] = useMutation(DELETE_GROUP_POST_MUTATION, {
    variables: {
      groupId,
      postId,
      reason: "你的帖子被删除了" //TODO custom reason
    },
    update(proxy) {
      if (callback) callback();
    }
  });

  return (
    <Popconfirm
      title="确认删除帖子吗？"
      onConfirm={() => {
        deleteGroupPost();
        message.success("帖子已删除");
      }}
      okText="确认"
      cancelText="取消"
    >
      <Icon type="delete" style={{ marginRight: 8 }} />
      删除
    </Popconfirm>
  );
};

const DELETE_GROUP_POST_MUTATION = gql`
  mutation deleteGroupPost($groupId: ID!, $postId: ID!, $reason: String!) {
    deleteGroupPost(groupId: $groupId, postId: $postId, reason: $reason) {
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
        commentCount
      }
      postCount
    }
  }
`;

export default GroupDeletePostButton;
