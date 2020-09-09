import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ReactMarkdown from "react-markdown";
import {
  Layout,
  Breadcrumb,
  Input,
  Row,
  Col,
  Card,
  Button,
  Icon,
  Avatar,
  List,
  Skeleton
} from "antd";
import moment from "moment";
import { AuthContext } from "../../context/auth";
import GroupDeletePostButton from "../../components/group/GroupDeletePostButton";
import GroupQualifiedPostButton from "../../components/group/GroupQualifiedPostButton";
import GroupTopPostButton from "../../components/group/GroupTopPostButton";
import GroupLikePostButton from "../../components/group/GroupLikePostButton";
import GroupReportPostButton from "../../components/group/GroupReportPostButton";
import GroupInformationCard from "../../components/group/GroupInformationCard";
import GroupAdminCard from "../../components/group/GroupAdminCard";
import GroupUserCard from "../../components/group/GroupUserCard";
const { TextArea } = Input;
const { Content, Footer } = Layout;

const Group = props => {
  const groupId = props.match.params.groupId;
  const { user } = useContext(AuthContext);
  const titleInputRef = useRef(null);
  const commentInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );

  const {
    data: { getGroup }
  } = useQuery(FETCH_GROUP_QUERY, {
    variables: {
      groupId
    }
  });

  const [submitComment] = useMutation(CREATE_GROUP_POST_MUTATION, {
    update: () => {
      setTitle("");
      setComment("");
      titleInputRef.current.blur();
      commentInputRef.current.blur();
    },
    variables: {
      groupId: groupId,
      title: title,
      body: comment
    }
  });

  const deleteGroupCallback = () => {
    props.history.push("/groups");
  };

  let groupMarkup;

  if (!getGroup) {
    groupMarkup = <Skeleton />;
  } else {
    let { id, body, username, posts, postCount, admins } = getGroup;

    posts = [
      ...posts.filter(post => post.top),
      ...posts.filter(post => !post.top)
    ];

    const isAdmin =
      user &&
      (admins.find(admin => admin.username === user.username) ||
        username === user.username);

    groupMarkup = (
      <Layout className="layout">
        <Content style={{ padding: "0 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Link to="/groups">小组</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/groups/${id}`}>{body}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <Row gutter={24}>
              <Col lg={17} md={24}>
                {/* 发表帖子 */}
                <Card
                  title="发表帖子"
                  bordered={false}
                  style={{ marginBottom: "24px" }}
                >
                  <div>
                    <Input
                      type="text"
                      placeholder="标题"
                      name="title"
                      value={title}
                      onChange={event => setTitle(event.target.value)}
                      ref={titleInputRef}
                    />
                    <div style={{ margin: "24px 0" }} />
                    <TextArea
                      type="text"
                      placeholder="需要加入小组才能进行发表，内容不能少于25字。"
                      name="comment"
                      value={comment}
                      onChange={event => setComment(event.target.value)}
                      ref={commentInputRef}
                      autosize={{ minRows: 4, maxRows: 100 }}
                    />
                    <div style={{ margin: "24px 0" }} />
                    <Button
                      type="submit"
                      disabled={comment.trim().length < 25}
                      onClick={submitComment}
                    >
                      发表
                    </Button>
                  </div>
                </Card>
                {/* 帖子列表 */}
                <Card
                  title={`帖子(${postCount})`}
                  bordered={false}
                  style={{ marginBottom: "24px" }}
                >
                  <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={posts}
                    renderItem={item => {
                      const canDelete =
                        user &&
                        (user.username === item.username ||
                          admins.find(
                            admin => admin.username === user.username
                          ) ||
                          username === user.username);

                      let actions = [
                        <GroupLikePostButton
                          user={user}
                          groupId={id}
                          post={item}
                        />,
                        <IconText
                          type="message"
                          text={item.commentCount}
                          key="list-vertical-message"
                        />
                      ];

                      if (canDelete) {
                        actions.push(
                          <GroupDeletePostButton
                            groupId={id}
                            postId={item.id}
                          />
                        );
                      }

                      if (isAdmin) {
                        actions.push(
                          <GroupQualifiedPostButton
                            groupId={id}
                            postId={item.id}
                          />,
                          <GroupTopPostButton groupId={id} postId={item.id} />
                        );
                      }

                      actions.push(
                        <GroupReportPostButton groupId={id} postId={item.id} />
                      );

                      return (
                        <List.Item key={item.title} actions={actions}>
                          <List.Item.Meta
                            avatar={
                              <Link to={`/users/${item.username}`}>
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
                              <Link to={`/groups/${id}/posts/${item.id}`}>
                                {item.title}
                                {item.qualified && (
                                  <span>
                                    {" "}
                                    <Icon type="star" />{" "}
                                  </span>
                                )}
                                {item.top && (
                                  <span>
                                    {" "}
                                    <Icon type="up-circle" />{" "}
                                  </span>
                                )}
                              </Link>
                            }
                            description={`${item.username} 发表于 ${moment(
                              item.createdAt
                            ).fromNow()}`}
                          />
                          {<ReactMarkdown source={item.body} />}
                        </List.Item>
                      );
                    }}
                  />
                </Card>
              </Col>
              <Col lg={7} md={24}>
                <GroupInformationCard
                  group={getGroup}
                  deleteGroupCallback={deleteGroupCallback}
                />
                <GroupAdminCard group={getGroup} />
                <GroupUserCard group={getGroup} />
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Circle Community Created by ndsf
        </Footer>
      </Layout>
    );
  }

  return groupMarkup;
};

const CREATE_GROUP_POST_MUTATION = gql`
  mutation($groupId: ID!, $title: String!, $body: String!) {
    createGroupPost(groupId: $groupId, title: $title, body: $body) {
      id
      body
      createdAt
      username
      bio
      avatar
      likes {
        id
        username
        createdAt
      }
      likeCount
      posts {
        id
        title
        body
        createdAt
        username
        commentCount
        top
        qualified
        likes {
          id
          username
          createdAt
        }
        likeCount
      }
      postCount
      admins {
        createdAt
        username
      }
      applies {
        title
        body
        username
        createdAt
      }
    }
  }
`;

const FETCH_GROUP_QUERY = gql`
  query getGroup($groupId: ID!) {
    getGroup(groupId: $groupId) {
      id
      body
      createdAt
      username
      bio
      avatar
      likes {
        id
        username
        createdAt
      }
      likeCount
      posts {
        id
        title
        body
        createdAt
        username
        commentCount
        top
        qualified
        likes {
          id
          username
          createdAt
        }
        likeCount
      }
      postCount
      admins {
        createdAt
        username
      }
      applies {
        title
        body
        username
        createdAt
      }
    }
  }
`;

export default Group;
