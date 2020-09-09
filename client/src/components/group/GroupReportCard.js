import React, {useContext} from "react";
import {AuthContext} from "../../context/auth";
import {Avatar, Card, Comment, List} from "antd";
import GroupDeleteReportButton from "./GroupDeleteReportButton";
import {Link} from "react-router-dom";
import moment from "moment";

const GroupReportCard = ({group: {id: groupId, username, admins, posts}}) => {
  const {user} = useContext(AuthContext);

  const isAdmin =
    user &&
    (admins.find(admin => admin.username === user.username) ||
      username === user.username);

  return (
    <>
      {/* 举报列表 */}
      <Card
        title={`举报`}
        bordered={false}
        style={{marginBottom: "24px"}}
      >
        <List
          className="comment-list"
          itemLayout="horizontal"
          pagination={{
            pageSize: 10,
          }}
          dataSource={posts}
          renderItem={post => (
            <div key={post.id}>
              {post.reports.map(item => (
                <Comment
                  key={item.id}
                  actions={
                    isAdmin
                      ? [
                        <GroupDeleteReportButton
                          groupId={groupId}
                          postId={post.id}
                          reportId={item.id}
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
                  content={
                    <span>
                                {`举报了 ${post.username} 发布的 `}
                      <Link to={`/groups/${groupId}/posts/${post.id}`}>
                                  {post.title}
                                </Link>
                              </span>
                  }
                  datetime={moment(item.createdAt).fromNow()}
                />
              ))}
            </div>
          )}
        />
      </Card>
    </>);
};

export default GroupReportCard;