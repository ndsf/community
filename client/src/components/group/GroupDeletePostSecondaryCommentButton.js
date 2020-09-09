import React from "react";
import gql from "graphql-tag";
import { Popconfirm, Icon, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupDeletePostCommentButton = ({
  groupId,
  postId,
  commentId,
  secondaryId,
  callback
}) => {
  const [deleteGroupPostSecondaryComment] = useMutation(
    DELETE_GROUP_POST_COMMENT_MUTATION,
    {
      variables: {
        groupId,
        postId,
        commentId,
        secondaryId
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
        deleteGroupPostSecondaryComment();
        message.success("评论已删除");
      }}
      okText="确认"
      cancelText="取消"
    >
      <Icon type="delete" style={{ marginRight: 8 }} />
      删除
    </Popconfirm>
  );
};

const DELETE_GROUP_POST_COMMENT_MUTATION = gql`
  mutation deleteGroupPostSecondaryComment(
    $groupId: ID!
    $postId: ID!
    $commentId: ID!
    $secondaryId: ID!
  ) {
    deleteGroupPostSecondaryComment(
      groupId: $groupId
      postId: $postId
      commentId: $commentId
      secondaryId: $secondaryId
    ) {
      id
      comments {
        id
        title
        body
        createdAt
        username
        comments {
          id
          title
          body
          createdAt
          username
        }
      }
      commentCount
    }
  }
`;

export default GroupDeletePostCommentButton;
