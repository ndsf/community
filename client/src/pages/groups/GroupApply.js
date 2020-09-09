import React from "react";
import gql from "graphql-tag";
import {Link} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import {Breadcrumb, Col, Layout, Row, Skeleton} from "antd";
import GroupInformationCard from "../../components/group/GroupInformationCard";
import GroupAdminCard from "../../components/group/GroupAdminCard";
import GroupUserCard from "../../components/group/GroupUserCard";
import GroupApplyAdminCard from "../../components/group/GroupApplyAdminCard";
import GroupImportLikesCard from "../../components/group/GroupImportLikesCard";
import GroupReportCard from "../../components/group/GroupReportCard";
import GroupApplyAdmissionCard from "../../components/group/GroupApplyAdmissionCard";

const {Content, Footer} = Layout;

const GroupApply = props => {
  const groupId = props.match.params.groupId;

  const {
    data: {getGroup}
  } = useQuery(FETCH_GROUP_APPLY_QUERY, {
    variables: {
      groupId
    }
  });

  const deleteGroupCallback = () => {
    props.history.push("/groups");
  };

  let postMarkup;

  if (!getGroup) {
    postMarkup = <Skeleton/>;
  } else {
    postMarkup = (
      <Layout className="layout">
        <Content style={{padding: "0 24px"}}>
          <Breadcrumb style={{margin: "16px 0"}}>
            <Breadcrumb.Item>
              <Link to="/groups">小组</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/groups/${groupId}`}>{getGroup.body}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/groups/${groupId}/applies`}>管理</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <Row gutter={24}>
              <Col lg={17} md={24}>
                <GroupApplyAdmissionCard group={getGroup}/>
                <GroupImportLikesCard group={getGroup}/>
                <GroupApplyAdminCard group={getGroup}/>
                <GroupReportCard group={getGroup}/>
              </Col>
              <Col lg={7} md={24}>
                <GroupInformationCard
                  group={getGroup}
                  deleteGroupCallback={deleteGroupCallback}
                />
                <GroupAdminCard group={getGroup}/>
                <GroupUserCard group={getGroup}/>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{textAlign: "center"}}>
          Circle Community Created by ndsf
        </Footer>
      </Layout>
    );
  }

  return postMarkup;
};

const FETCH_GROUP_APPLY_QUERY = gql`
    query getGroup($groupId: ID!) {
        getGroup(groupId: $groupId) {
            id
            body
            createdAt
            username
            bio
            avatar
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
                reports {
                    id
                    username
                    createdAt
                }
                likeCount
                reportCount
            }
            applyCount
            admissions {
                id
                username
                body
                createdAt
            }
            admissionCount
        }
    }
`;

export default GroupApply;