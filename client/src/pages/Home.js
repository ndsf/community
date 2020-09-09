import React, {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {AuthContext} from "../context/auth";
import {Avatar, Breadcrumb, Card, Col, Layout, List, Row} from "antd";
import moment from "moment";
import {FETCH_GROUPS_QUERY, FETCH_USER_QUERY} from "../utils/graphql";

const {Content, Footer} = Layout;
const {Meta} = Card;

const Home = props => {
  let username;

  const {user} = useContext(AuthContext);

  if (props.match.params.username) {
    username = props.match.params.username;
  } else {
    if (!user) {
      props.history.push(`/login`);
    } else username = user.username;
  }

  // const {
  //   loading: loadingBooks,
  //   data: {getBooks: books}
  // } = useQuery(FETCH_BOOKS_QUERY);
  //
  // const {
  //   loading: loadingMovies,
  //   data: {getMovies: movies}
  // } = useQuery(FETCH_MOVIES_QUERY);

  const {
    loading: loadingGroups,
    data: {getGroups: groups}
  } = useQuery(FETCH_GROUPS_QUERY);

  const {
    loading: loadingUser,
    data: {getUser}
  } = useQuery(FETCH_USER_QUERY, {
    variables: {
      username
    }
  });

  const [noTitleKey, setNoTitleKey] = useState("group");
  const tabListNoTitle = user && username === user.username ? [
    {
      key: "notification",
      tab: "通知"
    },
    // {
    //   key: "book",
    //   tab: "书评"
    // },
    // {
    //   key: "movie",
    //   tab: "影评"
    // },
    {
      key: "group",
      tab: "小组"
    }
  ] : [
    // {
    //   key: "book",
    //   tab: "书评"
    // },
    // {
    //   key: "movie",
    //   tab: "影评"
    // },
    {
      key: "group",
      tab: "小组"
    }
  ];

  const contentListNoTitle = {
    notification: (
      <List
        itemLayout="vertical"
        pagination={{
          pageSize: 10,
        }}
        size="large"
        loading={loadingUser}
        dataSource={loadingUser ? [] : getUser.notifications}
        renderItem={notification => {
          // let comments = notification.comments.filter(c => c.username === username);
          return (
            <List.Item key={notification.id}>
              <List.Item.Meta
                avatar={
                  <Link to={`/users/${notification.username}`}>
                    <Avatar
                      style={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf"
                      }}
                    >
                      {notification.username}
                    </Avatar>
                  </Link>
                }
                title="通知"
                description={`${notification.username} 于 ${moment(
                  notification.createdAt
                ).fromNow()} 发送`}
              />
              {notification.body}
            </List.Item>
          );
        }}
      />
    ),
    group: (
      <List
        itemLayout="vertical"
        pagination={{
          pageSize: 10,
        }}
        size="large"
        dataSource={groups}
        renderItem={group => {
          let posts = group.posts.filter(c => c.username === username);
          return (
            <>
              {posts.map(item => (
                <List.Item key={item.id}>
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
                      <Link to={`/groups/${group.id}/posts/${item.id}`}>
                        {item.title}
                      </Link>
                    }
                    description={`${item.username} 于 ${moment(
                      item.createdAt
                    ).fromNow()} 发布在 ${group.body}`}
                  />
                  {item.body}
                </List.Item>
              ))}
            </>
          );
        }}
      />
    )
  };

  return loadingGroups ? (
    <></>
  ) : (
    <Layout className="layout">
      <Content style={{padding: "0 24px"}}>
        <Breadcrumb style={{margin: "16px 0"}}>
          <Breadcrumb.Item>用户</Breadcrumb.Item>
          <Breadcrumb.Item>{username}</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Row gutter={24}>
            <Col lg={17} md={24}>
              <Card
                tabList={tabListNoTitle}
                activeTabKey={noTitleKey}
                onTabChange={key => setNoTitleKey(key)}
                bordered={false}
                style={{marginBottom: "24px"}}
              >
                {contentListNoTitle[noTitleKey]}
              </Card>
            </Col>
            <Col lg={7} md={24}>
              <Card
                actions={
                  user && user.username === username
                    ? [<Link to={`/change-password`}>修改密码</Link>]
                    : []
                }
                bordered={false}
                style={{marginBottom: "24px"}}
              >
                <Meta
                  avatar={
                    <Link to={`/users/${username}`}>
                      <Avatar
                        style={{color: "#f56a00", backgroundColor: "#fde3cf"}}
                      >
                        {username}
                      </Avatar>
                    </Link>
                  }
                  title={username}
                />
              </Card>
              <Card
                bordered={false}
                style={{marginBottom: "24px"}}
                title="加入的小组"
              >
                <List
                  itemLayout="vertical"
                  size="large"
                  dataSource={groups.filter(group =>
                    group.likes.find(like => like.username === username)
                  )}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={
                          <Link to={`/groups/${item.id}`}>{item.body}</Link>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{textAlign: "center"}}>
        Circle Community Created by ndsf
      </Footer>
    </Layout>
  );
};
export default Home;
