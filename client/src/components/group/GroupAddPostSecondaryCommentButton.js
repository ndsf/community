import React, { useState, useRef } from "react";
import gql from "graphql-tag";
import { Input, Form, Icon, Modal } from "antd";
import { useMutation } from "@apollo/react-hooks";
const { TextArea } = Input;
const GroupAddPostSecondaryCommentButton = ({
  groupId,
  postId,
  commentId,
  callback
}) => {
  const bodyInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    if (body.trim() !== "") createGroupPostSecondaryComment();
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const [createGroupPostSecondaryComment] = useMutation(
    CREATE_GROUP_POST_COMMENT_MUTATION,
    {
      variables: {
        groupId,
        postId,
        commentId,
        title,
        body
      },
      update(proxy) {
        if (callback) callback();
        setTitle("");
        setBody("");
        bodyInputRef.current.blur();
      }
    }
  );
  return (
    <div>
      <span onClick={showModal}>
        <Icon type="message" style={{ marginRight: 8 }} />
        评论
      </span>
      <Modal
        title="添加评论"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item>
            <TextArea
              type="text"
              placeholder="需要加入小组才能进行发表，内容不能为空。"
              name="body"
              value={body}
              onChange={event => setBody(event.target.value)}
              ref={bodyInputRef}
              autosize={{ minRows: 4, maxRows: 15 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const CREATE_GROUP_POST_COMMENT_MUTATION = gql`
  mutation createGroupPostSecondaryComment(
    $groupId: ID!
    $postId: ID!
    $commentId: ID!
    $title: String!
    $body: String!
  ) {
    createGroupPostSecondaryComment(
      groupId: $groupId
      postId: $postId
      commentId: $commentId
      title: $title
      body: $body
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

export default GroupAddPostSecondaryCommentButton;
