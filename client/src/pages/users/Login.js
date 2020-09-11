import React, {useContext, useState} from 'react';
import {Form} from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {Breadcrumb, Button, Input, Layout} from "antd";
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {AuthContext} from '../../context/auth';
import {useForm} from '../../utils/hooks';

const {Content, Footer} = Layout;


const Login = props => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const {onChange, onSubmit, values} = useForm(loginUserCallback, {
    username: '',
    password: ''
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    update(
        _,
        {
          data: {login: userData}
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
      <Layout className="layout">
        <Content style={{padding: '0 50px'}}>
          <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>用户</Breadcrumb.Item>
            <Breadcrumb.Item>登录</Breadcrumb.Item>
          </Breadcrumb>
          <h1>登录</h1>
          <Form layout="vertical" onSubmit={onSubmit}>
            <Form.Item label="用户名">
              <Input
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={values.username}
                  error={errors.username ? 1 : 0}
                  onChange={onChange}
              />
            </Form.Item>
            <Form.Item label="密码">
              <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  error={errors.password ? 1 : 0}
                  onChange={onChange}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                登录
              </Button>
            </Form.Item>
          </Form>
          {Object.keys(errors).length > 0 && (
              <ul className="list">
                {Object.values(errors).map(err => (
                    <li key={err}>{err}</li>
                ))}
              </ul>
          )}
        </Content>
        <Footer style={{textAlign: 'center'}}>Circle Community Created by ndsf</Footer>
      </Layout>
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
