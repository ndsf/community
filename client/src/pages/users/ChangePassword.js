import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Avatar, Layout, Button, message } from "antd";
import { useForm } from "../../utils/hooks";
const { Content } = Layout;
const ChangePassword = props => {
  const { onChange, onSubmit, values } = useForm(changePasswordCallback, {
    password: "",
    confirmPassword: ""
  });

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    variables: values,
    update() {
      message.success("修改成功");
      props.history.push("/");
    }
  });

  function changePasswordCallback() {
    changePassword();
  }

  return (
    <Content style={{ padding: "0 300px" }}>
      <div style={{ margin: "24px 0" }} />
      <Avatar size={64} icon={<UserOutlined />} position="center" />
      <div style={{ margin: "24px 0" }} />
      <Form layout="vertical" onSubmit={onSubmit}>
        <Form.Item label="密码">
          <Input
            placeholder="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item label="确认密码">
          <Input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item>
          {values.password && values.password === values.confirmPassword ? (
            <Button htmlType="submit">修改密码</Button>
          ) : (
            <Button htmlType="submit" disabled>
              修改密码
            </Button>
          )}
        </Form.Item>
      </Form>
    </Content>
  );
};

const CHANGE_PASSWORD = gql`
  mutation changePassword($password: String!) {
    changePassword(password: $password) {
      id
      email
      username
    }
  }
`;

export default ChangePassword;
