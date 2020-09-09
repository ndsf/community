import React, { useContext, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { Avatar, Layout } from "antd";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import { AuthContext } from "../../context/auth";
import { useForm } from "../../utils/hooks";
const { Content } = Layout;
const Login = props => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: ""
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(
      _,
      {
        data: { login: userData }
      }
    ) {
      context.login(userData);
      props.history.goBack();
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <Content style={{ padding: "0 300px" }}>
      <div style={{ margin: "24px 0" }} />
      <Avatar size={64} icon="user" position="center" />
      <div style={{ margin: "24px 0" }} />
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="用户名"
          placeholder="Username"
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="密码"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <p>
          <Link to="/reset-password">忘记密码</Link>
        </p>
        <Button type="submit" primary>
          登录
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(err => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </Content>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
