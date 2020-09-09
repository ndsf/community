import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import moment from "moment";
import { Layout, Card, Avatar, List, Skeleton, Divider } from "antd";

import { AuthContext } from "../../context/auth";
import GroupForm from "../../components/group/GroupForm";
import SearchGroupForm from "../../components/group/SearchGroupForm";
import {FETCH_GROUPS_QUERY, FETCH_USER_QUERY} from "../../utils/graphql";
import "../../css/w3.css";
import groupsImg from "../../assets/groups.jpg";

const { Content, Footer } = Layout;
const { Meta } = Card;

const Groups = () => {
  const { user } = useContext(AuthContext);

  const {
    loading,
    data: { getGroups: groups }
  } = useQuery(FETCH_GROUPS_QUERY);

  const {
    loading: loadingUser,
    data: { getUser }
  } = useQuery(FETCH_USER_QUERY, {
    variables: {
      username: user.username
    }
  });

  return (loading || loadingUser) ? (
    <>
      <header
        className="w3-display-container w3-content w3-wide"
        style={{ maxWidth: "1500px" }}
        id="home"
      >
        <img
          className="w3-image"
          src={groupsImg}
          alt="Architecture"
          width="1500"
          height="800"
        />
        <div className="w3-display-middle w3-margin-top w3-center">
          <h1 className="w3-xxlarge w3-text-white">
            <span className="w3-padding w3-black w3-opacity-min">
              <b>Circle</b>
            </span>{" "}
            <span className="w3-hide-small w3-text-light-grey">Community</span>
            <div style={{ margin: "24px 0" }} />
            <SearchGroupForm />
          </h1>
        </div>
      </header>
      <Skeleton />
    </>
  ) : (
    <>
      <header
        className="w3-display-container w3-content w3-wide"
        style={{ maxWidth: "1500px" }}
        id="home"
      >
        <img
          className="w3-image"
          src={groupsImg}
          alt="Architecture"
          width="1500"
          height="800"
        />
        <div className="w3-display-middle w3-margin-top w3-center">
          <h1 className="w3-xxlarge w3-text-white">
            <span className="w3-padding w3-black w3-opacity-min">
              <b>Circle</b>
            </span>{" "}
            <span className="w3-hide-small w3-text-light-grey">Community</span>
            <div style={{ margin: "24px 0" }} />
            <SearchGroupForm />
          </h1>
        </div>
      </header>
      <br />
      <Layout className="layout">
        <Content style={{ padding: "0 24px" }}>
          <div>
            <div className="line-raw">
              <Divider>
                <h2 className="raw-title">最新小组</h2>
              </Divider>
            </div>
            <List
              grid={{
                gutter: 16,
                column: 4
              }}
              dataSource={groups}
              renderItem={item => (
                <List.Item>
                  <Card>
                    <Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<Link to={`/groups/${item.id}`}>{item.body}</Link>}
                      description={
                        <p>
                          {item.username} 创建于{" "}
                          {moment(item.createdAt).fromNow()}
                        </p>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
            <div className="line-raw">
              <Divider>
                <h2 className="raw-title">最热小组</h2>
              </Divider>
            </div>
            <List
              grid={{
                gutter: 16,
                column: 4
              }}
              dataSource={[...groups].sort(
                (first, second) => second.likeCount - first.likeCount
              )}
              renderItem={item => (
                <List.Item>
                  <Card>
                    <Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<Link to={`/groups/${item.id}`}>{item.body}</Link>}
                      description={
                        <p>
                          {item.username} 创建于{" "}
                          {moment(item.createdAt).fromNow()}
                        </p>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
            {user && getUser.isTeacher && (
              <>
                <div className="line-raw">
                  <Divider>
                    <h2 className="raw-title">创建小组</h2>
                  </Divider>
                </div>
                <GroupForm />
              </>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Circle Community Created by ndsf
        </Footer>
      </Layout>
    </>
  );
};

export default Groups;
