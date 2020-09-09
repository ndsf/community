import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Form,
  Layout,
  Breadcrumb,
  Input,
  Row,
  Col,
  Card,
  Button,
  Avatar,
  Comment,
  Tooltip,
  List,
  Skeleton
} from "antd";
import moment from "moment";

import { AuthContext } from "../../context/auth";
//import GroupDeletePostButton from "../../components/group/GroupDeletePostButton.js";
import GroupDeletePostCommentButton from "../../components/group/GroupDeletePostCommentButton";
import GroupAddPostSecondaryCommentButton from "../../components/group/GroupAddPostSecondaryCommentButton";
import GroupDeletePostSecondaryCommentButton from "../../components/group/GroupDeletePostSecondaryCommentButton";
import GroupInformationCard from "../../components/group/GroupInformationCard";
import GroupAdminCard from "../../components/group/GroupAdminCard";

const { TextArea } = Input;
const { Content, Footer } = Layout;
const GroupPost = props => {
  const groupId = props.match.params.groupId;
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const {
    data: { getGroup }
  } = useQuery(FETCH_GROUP_QUERY, {
    variables: {
      groupId
    }
  });

  const {
    data: { getGroupPost }
  } = useQuery(FETCH_GROUP_POST_QUERY, {
    variables: {
      groupId,
      postId
    }
  });

  const deleteGroupCallback = () => {
    props.history.push("/groups");
  };

  const [createGroupPostComment] = useMutation(
    CREATE_GROUP_POST_COMMENT_MUTATION,
    {
      update: () => {
        setComment("");
        commentInputRef.current.blur();
      },
      variables: {
        groupId: groupId,
        postId: postId,
        title: "",
        body: comment
      }
    }
  );

  /* const deletePostCallback = () => {
    props.history.push("/");
  };
 */
  let postMarkup;

  if (!getGroupPost || !getGroup) {
    postMarkup = <Skeleton />;
  } else {
    const {
      id,
      title,
      body,
      createdAt,
      username,
      comments,
      //likes,
      //likeCount,
      commentCount
    } = getGroupPost;

    //const { likes, admins } = getGroup;

    postMarkup = (
      <Layout className="layout">
        <Content style={{ padding: "0 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Link to="/groups">小组</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/groups/${getGroup.id}`}>{getGroup.body}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/groups/${getGroup.id}/posts/${id}`}>{title}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <Row gutter={24}>
              <Col lg={17} md={24}>
                {/* 帖子信息 */}
                <Card
                  title={title}
                  bordered={false}
                  style={{ marginBottom: "24px" }}
                >
                  <Comment
                    author={username}
                    avatar={
                      <Link to={`/users/${username}`}>
                        <Avatar
                          style={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf"
                          }}
                        >
                          {username}
                        </Avatar>
                      </Link>
                    }
                    content={<ReactMarkdown source={body} />}
                    datetime={
                      <Tooltip
                        title={moment(createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      >
                        <span>{moment(createdAt).fromNow()}</span>
                      </Tooltip>
                    }
                  />
                </Card>
                {/* 发表评论 */}
                <Card
                  title="发表评论"
                  bordered={false}
                  style={{ marginBottom: "24px" }}
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
                        autosize={{ minRows: 4, maxRows: 100 }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="submit"
                        disabled={comment.trim() === ""}
                        onClick={createGroupPostComment}
                      >
                        添加评论
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                {/* 评论列表 */}
                <Card
                  title={`评论(${commentCount})`}
                  bordered={false}
                  style={{ marginBottom: "24px" }}
                >
                  <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={item => {
                      const isAuthorOrAdmin =
                        user &&
                        (user.username === item.username ||
                          getGroup.admins.find(
                            admin => admin.username === user.username
                          ) ||
                          getGroup.username === user.username);
                      const canComment =
                        user &&
                        getGroup.likes.find(
                          like => like.username === user.username
                        );

                      let actions = [];
                      if (isAuthorOrAdmin)
                        actions.push(
                          <GroupDeletePostCommentButton
                            groupId={getGroup.id}
                            postId={id}
                            commentId={item.id}
                          />
                        );

                      if (canComment)
                        actions.push(
                          <GroupAddPostSecondaryCommentButton
                            groupId={getGroup.id}
                            postId={id}
                            commentId={item.id}
                          />
                        );

                      return (
                        <li key={item.id}>
                          <Comment
                            actions={actions}
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
                            content={<ReactMarkdown source={item.body} />}
                            datetime={moment(item.createdAt).fromNow()}
                          >
                            {/* 二级评论 */}
                            {item.comments.map(secondary => (
                              <Comment
                                key={secondary.id}
                                actions={
                                  user &&
                                  (user.username === secondary.username ||
                                    getGroup.admins.find(
                                      admin => admin.username === user.username
                                    ) ||
                                    getGroup.username === user.username)
                                    ? [
                                        <GroupDeletePostSecondaryCommentButton
                                          groupId={getGroup.id}
                                          postId={id}
                                          commentId={item.id}
                                          secondaryId={secondary.id}
                                        />
                                      ]
                                    : []
                                }
                                author={secondary.username}
                                avatar={
                                  <Link to={`/users/${username}`}>
                                    <Avatar
                                      style={{
                                        color: "#f56a00",
                                        backgroundColor: "#fde3cf"
                                      }}
                                    >
                                      {secondary.username}
                                    </Avatar>
                                  </Link>
                                }
                                content={
                                  <ReactMarkdown source={secondary.body} />
                                }
                                datetime={moment(secondary.createdAt).fromNow()}
                              />
                            ))}
                          </Comment>
                        </li>
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

  return postMarkup;
};

const CREATE_GROUP_POST_COMMENT_MUTATION = gql`
  mutation($groupId: ID!, $postId: ID!, $title: String!, $body: String!) {
    createGroupPostComment(
      groupId: $groupId
      postId: $postId
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

const FETCH_GROUP_POST_QUERY = gql`
  query getGroupPost($groupId: ID!, $postId: ID!) {
    getGroupPost(groupId: $groupId, postId: $postId) {
      id
      title
      body
      createdAt
      username
      commentCount
      comments {
        id
        username
        createdAt
        title
        body
        comments {
          id
          title
          body
          createdAt
          username
        }
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

export default GroupPost;
