import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Icon, message } from "antd";

const GroupLikeButton = ({ user, group: { id, username, likeCount, likes, admins} }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likeGroup] = useMutation(LIKE_GROUP_MUTATION, {
    variables: { groupId: id }
  });

  const likeGroupWrapper = () => {
    if (user.username === username || admins.find(admin => admin.username === user.username)) message.error("创建者和管理员不能退出小组");
    else if (!liked) message.error("请在小组页面申请加入小组");
    else likeGroup();
  }

  return user ? (
    <span onClick={likeGroupWrapper}>
      <Icon
        theme={liked ? "twoTone" : ""}
        twoToneColor="#eb2f96"
        type="heart"
        style={{ marginRight: 8 }}
      />
      {likeCount}
    </span>
  ) : (
    <span>
      <Icon type="heart" style={{ marginRight: 8 }} />
      {likeCount}
    </span>
  );
};

const LIKE_GROUP_MUTATION = gql`
  mutation likeGroup($groupId: ID!) {
    likeGroup(groupId: $groupId) {
      id
      likeCount
      likes {
        id
        createdAt
        username
      }
    }
  }
`;
export default GroupLikeButton;
