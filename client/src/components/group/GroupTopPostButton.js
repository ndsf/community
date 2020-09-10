import React from "react";
import gql from "graphql-tag";
import { UpCircleOutlined } from '@ant-design/icons';
import { Popconfirm, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

const GroupTopPostButton = ({ groupId, postId, callback }) => {
  const [topGroupPost] = useMutation(TOP_GROUP_POST_MUTATION, {
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
      title="确认置顶/取消置顶帖子吗？"
      onConfirm={() => {
        topGroupPost();
        message.success("操作成功");
      }}
      okText="确认"
      cancelText="取消"
    >
      <UpCircleOutlined style={{ marginRight: 8 }} />
      置顶
    </Popconfirm>
  );
};

const TOP_GROUP_POST_MUTATION = gql`
  mutation topGroupPost($groupId: ID!, $postId: ID!) {
    topGroupPost(groupId: $groupId, postId: $postId) {
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
        top
      }
      postCount
    }
  }
`;

export default GroupTopPostButton;
