import React from "react";
import { withRouter } from "react-router-dom";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input } from "antd";

const { Search } = Input;

const SearchGroupForm = props => {
  return (
    <Form>
      <Form.Item>
        <Search
          placeholder="搜索小组"
          onSearch={value => props.history.push(`/search/groups/${value}`)}
        />
      </Form.Item>
    </Form>
  );
};

export default withRouter(SearchGroupForm);
