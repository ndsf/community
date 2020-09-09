import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Input } from "antd";

const { Search } = Input;

const SearchForm = props => {
  return (
    <Form>
      <Form.Item>
        <Search
          placeholder="搜索全站"
          onSearch={value => props.history.push(`/search/all/${value}`)}
        />
      </Form.Item>
    </Form>
  );
};

export default withRouter(SearchForm);
