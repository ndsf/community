import React from "react";
import gql from "graphql-tag";
import { Popconfirm, Icon, message } from "antd";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_GROUPS_QUERY } from "../../utils/graphql";

const GroupDeleteButton = ({ groupId, callback }) => {
  const [deleteGroup] = useMutation(DELETE_GROUP_MUTATION, {
    variables: {
      groupId
    },
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_GROUPS_QUERY
      });

      data.getGroups = data.getGroups.filter(p => p.id !== groupId);

      proxy.writeQuery({ query: FETCH_GROUPS_QUERY, data });

      if (callback) callback();
    }
  });

  return (
    <Popconfirm
      title="确认删除小组吗？"
      onConfirm={() => {
        deleteGroup();
        message.success("小组已删除");
      }}
      okText="确认"
      cancelText="取消"
    >
      <Icon type="delete" style={{ marginRight: 8 }} />
      删除
    </Popconfirm>
  );
};

const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroup($groupId: ID!) {
    deleteGroup(groupId: $groupId)
  }
`;

export default GroupDeleteButton;
