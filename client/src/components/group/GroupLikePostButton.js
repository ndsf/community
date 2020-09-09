import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Icon } from "antd";

const GroupLikePostButton = ({
  user,
  groupId,
  post: { id, likeCount, likes }
}) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likeGroup] = useMutation(LIKE_GROUP_POST_MUTATION, {
    variables: { groupId: groupId, postId: id }
  });

  return user ? (
    <span onClick={likeGroup}>
      <Icon
        theme={liked ? "twoTone" : ""}
        twoToneColor="#eb2f96"
        type="like-o"
        style={{ marginRight: 8 }}
      />
      {likeCount}
    </span>
  ) : (
    <span>
      <Icon type="like-o" style={{ marginRight: 8 }} />
      {likeCount}
    </span>
  );
};

const LIKE_GROUP_POST_MUTATION = gql`
  mutation likeGroupPost($groupId: ID!, $postId: ID!) {
    likeGroupPost(groupId: $groupId, postId: $postId) {
      id
      posts {
        id
        likes {
          id
          username
          createdAt
        }
        likeCount
      }
    }
  }
`;
export default GroupLikePostButton;
