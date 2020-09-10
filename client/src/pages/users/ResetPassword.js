import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Avatar, Layout, Button, Result } from "antd";
import { useForm } from "../../utils/hooks";
const { Content } = Layout;
const ResetPassword = props => {
  const { onChange, onSubmit, values } = useForm(resetPasswordCallback, {
    username: "",
    email: ""
  });

  const [ok, setOk] = useState(false);

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    variables: values
  });

  function resetPasswordCallback() {
    resetPassword();
    setOk(true);
  }

  return ok ? (
    <Result
      status="success"
      title="密码重置成功"
      subTitle="如果您填写了正确的用户名和邮箱，一封电子邮件将发送至该邮箱。如果您没有收到邮件，请稍等并检查垃圾箱。"
      extra={[<Link to="/login">登录账号</Link>, <Link to="/">返回主页</Link>]}
    />
  ) : (
    <Content style={{ padding: "0 300px" }}>
      <div style={{ margin: "24px 0" }} />
      <Avatar size={64} icon={<UserOutlined />} position="center" />
      <div style={{ margin: "24px 0" }} />
      <Form layout="vertical" onSubmit={onSubmit}>
        <Form.Item label="用户名">
          <Input
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item label="邮箱">
          <Input
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">重置密码</Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

const RESET_PASSWORD = gql`
  mutation resetPassword($username: String!, $email: String!) {
    resetPassword(username: $username, email: $email) {
      id
      email
      username
    }
  }
`;

export default ResetPassword;
