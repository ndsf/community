import React from "react";
import gql from "graphql-tag";
import { StarOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupQualifiedPostButton = ({ groupId, postId, callback }) => {
  const [qualifiedGroupPost] = useMutation(QUALIFIED_GROUP_POST_MUTATION, {
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
      title="确认精华/取消精华帖子吗？"
      onConfirm={() => {
        qualifiedGroupPost();
        message.success("操作成功");
      }}
      okText="确认"
      cancelText="取消"
    >
      <StarOutlined style={{ marginRight: 8 }} />
      精华
    </Popconfirm>
  );
};

const QUALIFIED_GROUP_POST_MUTATION = gql`
  mutation qualifiedGroupPost($groupId: ID!, $postId: ID!) {
    qualifiedGroupPost(groupId: $groupId, postId: $postId) {
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
        top
        qualified
      }
      postCount
    }
  }
`;

export default GroupQualifiedPostButton;
