import React, {useContext, useRef, useState} from "react";
import {AuthContext} from "../../context/auth";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Avatar, Button, Card, Comment, Input, List } from "antd";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import GroupGrantAdmissionButton from "./GroupGrantAdmissionButton";
import {Link} from "react-router-dom";
import moment from "moment";

const {TextArea} = Input;

const GroupApplyAdmissionCard = ({group: {id: groupId, username, likes, admissions, admissionCount, admins}}) => {
  const {user} = useContext(AuthContext);

  const admissionInputRef = useRef(null);
  const [admission, setAdmission] = useState("");

  const [applyGroupAdmission] = useMutation(APPLY_GROUP_ADMISSION_MUTATION, {
    update: () => {
      setAdmission("");
    },
    variables: {
      groupId: groupId,
      body: admission
    }
  });

  return (
    <>
      {/* 申请加入 */}
      {user && !likes.find(like => like.username === user.username)
      && // 已登录且不是成员时显示
      (admissions.find(admission => admission.username === user.username) ?
        (<Card
          title="申请加入小组"
          bordered={false}
          style={{marginBottom: "24px"}}
        >
          <Button onClick={applyGroupAdmission}>撤销申请</Button>
        </Card>)
        :
        (<Card
          title="申请加入小组"
          bordered={false}
          style={{marginBottom: "24px"}}
        >
          <Form>
            <Form.Item>
              <TextArea
                type="text"
                placeholder="申请理由"
                name="admission"
                value={admission}
                onChange={event => setAdmission(event.target.value)}
                ref={admissionInputRef}
                autosize={{minRows: 4, maxRows: 100}}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="submit"
                disabled={admission.trim() === ""}
                onClick={applyGroupAdmission}
              >
                提交申请
              </Button>
            </Form.Item>
          </Form>
        </Card>))
      }
      {/* 申请列表 */}
      <Card
        title={`申请加入小组(${admissionCount})`}
        bordered={false}
        style={{marginBottom: "24px"}}
      >
        <List
          className="comment-list"
          itemLayout="horizontal"
          pagination={{
            pageSize: 10,
          }}
          dataSource={admissions}
          renderItem={item => (
            <li key={item.id}>
              <Comment
                actions={
                  user && (user.username === username || admins.find(admin => admin.username === user.username))
                    ? [
                      <GroupGrantAdmissionButton
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

const APPLY_GROUP_ADMISSION_MUTATION = gql`
    mutation($groupId: ID!, $body: String!) {
        applyGroupAdmission(groupId: $groupId, body: $body) {
            id
            admissions {
                id
                body
                createdAt
                username
            }
            admissionCount
        }
    }
`;
export default GroupApplyAdmissionCard;