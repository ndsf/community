import React, {useContext, useRef, useState} from "react";
import {AuthContext} from "../../context/auth";
import {Button, Card, Form, Input} from "antd";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";

const {TextArea} = Input;

const GroupImportLikesCard = ({group: {id: groupId, username, admins}}) => {
  const {user} = useContext(AuthContext);

  const usernamesInputRef = useRef(null);
  const [usernames, setUsernames] = useState("");

  const [importGroupLikes] = useMutation(IMPORT_GROUP_LIKES, {
    update: () => {
      setUsernames("");
    },
    variables: {
      groupId: groupId,
      usernames: usernames
    }
  });

  return (
    <>
      {/* 批量导入 */}
      {user &&
      (admins.find(admin => admin.username === user.username) ||
        user.username === username) && // 已登录且是管理员或创建者时显示
      <Card
        title="批量导入成员"
        bordered={false}
        style={{marginBottom: "24px"}}
      >
        <Form>
          <Form.Item>
            <TextArea
              type="text"
              placeholder="以半角空格分割的用户名列表，例如UserA UserB UserC"
              name="usernames"
              value={usernames}
              onChange={event => setUsernames(event.target.value)}
              ref={usernamesInputRef}
              autosize={{minRows: 4, maxRows: 100}}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="submit"
              disabled={usernames.trim() === ""}
              onClick={importGroupLikes}
            >
              批量导入
            </Button>
          </Form.Item>
        </Form>
      </Card>
      }
    </>);
};

const IMPORT_GROUP_LIKES = gql`
    mutation($groupId: ID!, $usernames: String!) {
        importGroupLikes(groupId: $groupId, usernames: $usernames) {
            id
            likes {
                id
                username
                createdAt
            }
            likeCount
        }
    }
`;

export default GroupImportLikesCard;