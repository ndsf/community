import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Popconfirm, Icon, message } from "antd";
import {SEND_NOTIFICATION} from "../../utils/graphql";

const GroupDeletePostButton = ({ groupId, post, callback }) => {
  const [deleteGroupPost] = useMutation(DELETE_GROUP_POST_MUTATION, {
    variables: {
      groupId,
      postId: post.id
    },
    update(proxy) {
      message.success("帖子已删除");
      if (callback) callback();
    }
  });

  const [sendNotification] = useMutation(SEND_NOTIFICATION, {
    variables: {
      username: post.username,
      body: `你的帖子${post.title}被删除了`
    },
    update(proxy) {
      message.success(`已发送通知给${post.username}`);
      if (callback) callback();
    }
  });

  return (
      <Popconfirm
          title="确认删除帖子吗？"
          onConfirm={() => {
            deleteGroupPost();
            sendNotification();

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
  mutation deleteGroupPost($groupId: ID!, $postId: ID!) {
    deleteGroupPost(groupId: $groupId, postId: $postId) {
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
