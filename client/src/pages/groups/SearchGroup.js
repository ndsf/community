import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import {
  Layout,
  Breadcrumb,
  Card,
  Avatar,
  List,
  Skeleton,
  Divider
} from "antd";

import SearchGroupForm from "../../components/group/SearchGroupForm";
import { FETCH_GROUPS_BY_BODY_QUERY } from "../../utils/graphql";
const { Content, Footer } = Layout;
const { Meta } = Card;
const SearchGroup = props => {
  const keyword = props.match.params.keyword;

  const {
    loading,
    data: { getGroupsByBody: groups } = {}
  } = useQuery(FETCH_GROUPS_BY_BODY_QUERY, {
    variables: { keyword: keyword }
  });

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 24px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/groups">小组</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <SearchGroupForm />
          {loading ? (
            <Skeleton />
          ) : (
            <>
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
                        title={
                          <Link to={`/groups/${item.id}`}>{item.body}</Link>
                        }
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
                        title={
                          <Link to={`/groups/${item.id}`}>{item.body}</Link>
                        }
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
            </>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Circle Community Created by ndsf
      </Footer>
    </Layout>
  );
};

export default SearchGroup;
