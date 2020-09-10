import React from "react";
import gql from "graphql-tag";
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupDeletePostCommentButton = ({
  groupId,
  postId,
  commentId,
  callback
}) => {
  const [deleteGroupPostComment] = useMutation(
    DELETE_GROUP_POST_COMMENT_MUTATION,
    {
      variables: {
        groupId,
        postId,
        commentId
      },
      update(proxy) {
        if (callback) callback();
      }
    }
  );

  return (
    <Popconfirm
      title="确认删除评论吗？"
      onConfirm={() => {
        deleteGroupPostComment();
        message.success("评论已删除");
      }}
      okText="确认"
      cancelText="取消"
    >
      <DeleteOutlined style={{ marginRight: 8 }} />
      删除
    </Popconfirm>
  );
};

const DELETE_GROUP_POST_COMMENT_MUTATION = gql`
  mutation deleteGroupPostComment(
    $groupId: ID!
    $postId: ID!
    $commentId: ID!
  ) {
    deleteGroupPostComment(
      groupId: $groupId
      postId: $postId
      commentId: $commentId
    ) {
      id
      comments {
        id
        title
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default GroupDeletePostCommentButton;
