import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Avatar, List } from "antd";
import moment from "moment";
import { AuthContext } from "../../context/auth";

const GroupUserCard = ({ group: { id, body, username, admins, likes } }) => {
  const { user } = useContext(AuthContext);

  const isAdmin =
    user &&
    (admins.find(admin => admin.username === user.username) ||
      username === user.username);
  const liked = user && likes.find(like => like.username === user.username);

  return (
    <Card
      bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
      bordered={false}
      title="成员"
      extra={
        <Link to={`/groups/${id}/applies`}>
          {isAdmin ? "批量导入" : (liked ? "" : "申请加入")}
        </Link>
      }
      style={{ marginBottom: "24px" }}
    >
      <List
        itemLayout="horizontal"
        pagination={{
          pageSize: 10,
        }}
        dataSource={likes}
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
                {/*  TODO add a remove user button? */}
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

export default GroupUserCard;
