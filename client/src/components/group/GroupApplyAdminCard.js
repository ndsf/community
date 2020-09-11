import React, {useContext, useRef, useState} from "react";
import {AuthContext} from "../../context/auth";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Avatar, Button, Card, Comment, Input, List } from "antd";
import GroupGrantAdminButton from "./GroupGrantAdminButton";
import {Link} from "react-router-dom";
import moment from "moment";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";

const {TextArea} = Input;

const GroupApplyAdminCard = ({group: {id: groupId, username, likes, admins, applies, applyCount}}) => {
  const {user} = useContext(AuthContext);

  const commentInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [applyGroupAdmin] = useMutation(APPLY_GROUP_ADMIN_MUTATION, {
    update: () => {
      setTitle("");
      setComment("");
    },
    variables: {
      groupId: groupId,
      title: title,
      body: comment
    }
  });

  return (
    <>
      {/* 发表申请 */}
      {user && likes.find(like => like.username === user.username) &&
      !admins.find(admin => admin.username === user.username) &&
      user.username !== username && // 已登录且是小组成员且不是管理员和创建者时显示
      (applies.find(apply => apply.username === user.username) &&
      likes.find(like => like.username === user.username) ? (
        <Card
          title="申请成为管理员"
          bordered={false}
          style={{marginBottom: "24px"}}
        >
          <Button onClick={applyGroupAdmin}>撤销申请</Button>
        </Card>
      ) : (
        <Card
          title="申请成为管理员"
          bordered={false}
          style={{marginBottom: "24px"}}
        >
          <Form>
            <Form.Item>
              <TextArea
                type="text"
                placeholder="需要加入小组才能进行发表，内容不能为空。"
                name="comment"
                value={comment}
                onChange={event => setComment(event.target.value)}
                ref={commentInputRef}
                autosize={{minRows: 4, maxRows: 100}}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="submit"
                disabled={comment.trim() === ""}
                onClick={applyGroupAdmin}
              >
                发表申请
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ))}
      {/* 申请列表 */}
      <Card
        title={`申请(${applyCount})`}
        bordered={false}
        style={{marginBottom: "24px"}}
      >
        <List
          className="comment-list"
          itemLayout="horizontal"
          pagination={{
            pageSize: 10,
          }}
          dataSource={applies}
          renderItem={item => (
            <li key={item.id}>
              <Comment
                actions={
                  user && user.username === username
                    ? [
                      <GroupGrantAdminButton
                        groupId={groupId}
                        name={item.username}
                      />
                    ]
                    : []
                }
                author={item.username}
                avatar={
                  <Link to={`/users/${username}`}>
                    <Avatar
                      style={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf"
                      }}
                    >
                      {item.username}
                    </Avatar>
                  </Link>
                }
                content={item.body}
                datetime={moment(item.createdAt).fromNow()}
              />
            </li>
          )}
        />
      </Card>
    </>);
};

const APPLY_GROUP_ADMIN_MUTATION = gql`
    mutation($groupId: ID!, $title: String!, $body: String!) {
        applyGroupAdmin(groupId: $groupId, title: $title, body: $body) {
            id
            applies {
                id
                title
                body
                createdAt
                username
            }
            applyCount
        }
    }
`;

export default GroupApplyAdminCard;