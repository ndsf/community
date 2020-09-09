import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Avatar, List } from "antd";
import moment from "moment";
import GroupDeleteAdminButton from "./GroupDeleteAdminButton";
import { AuthContext } from "../../context/auth";

const GroupAdminCard = ({ group: { id, body, username, admins } }) => {
  const { user } = useContext(AuthContext);

  const isAdmin =
    user &&
    (admins.find(admin => admin.username === user.username) ||
      username === user.username);

  return (
    <Card
      bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
      bordered={false}
      title="管理员"
      extra={
        <Link to={`/groups/${id}/applies`}>
          {isAdmin ? "管理小组" : "管理员申请"}
        </Link>
      }
      style={{ marginBottom: "24px" }}
    >
      <List
        itemLayout="horizontal"
        pagination={{
          pageSize: 10,
        }}
        dataSource={admins}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
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
              title={
                <>
                  {item.username}
                  {user && user.username === username && (
                    <GroupDeleteAdminButton groupId={id} name={item.username} />
                  )}
                </>
              }
              description={moment(item.createdAt).fromNow()}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GroupAdminCard;
