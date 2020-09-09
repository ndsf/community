import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

import { Menu } from "antd";

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname.substr(1).split("/")[0];
  const path = pathname === "" ? "home" : pathname;

  const [activeItem, setActiveItem] = useState([path]);

  const handleItemClick = e => setActiveItem([e.key]);

  const menuBar = user ? (
    <Menu theme="dark" mode="horizontal" selectedKeys={activeItem}>
      <Menu.Item key="homepage" onClick={handleItemClick}>
        <Link to="/">首页</Link>
      </Menu.Item>
      {/*<Menu.Item key="books" onClick={handleItemClick}>*/}
      {/*  <Link to="/books">书籍</Link>*/}
      {/*</Menu.Item>*/}
      {/*<Menu.Item key="movies" onClick={handleItemClick}>*/}
      {/*  <Link to="/movies">影视</Link>*/}
      {/*</Menu.Item>*/}
      <Menu.Item key="groups" onClick={handleItemClick}>
        <Link to="/groups">小组</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout} style={{ float: "right" }}>
        退出
      </Menu.Item>
      <Menu.Item key="users" style={{ float: "right" }}>
        <Link to="/users">{user.username}</Link>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu theme="dark" mode="horizontal" selectedKeys={activeItem}>
      <Menu.Item key="homepage" onClick={handleItemClick}>
        <Link to="/">主页</Link>
      </Menu.Item>
      {/*<Menu.Item key="books" onClick={handleItemClick}>*/}
      {/*  <Link to="/books">书籍</Link>*/}
      {/*</Menu.Item>*/}
      {/*<Menu.Item key="movies" onClick={handleItemClick}>*/}
      {/*  <Link to="/movies">影视</Link>*/}
      {/*</Menu.Item>*/}
      <Menu.Item key="groups" onClick={handleItemClick}>
        <Link to="/groups">小组</Link>
      </Menu.Item>
      <Menu.Item
        key="register"
        onClick={handleItemClick}
        style={{ float: "right" }}
      >
        <Link to="/register">注册</Link>
      </Menu.Item>
      <Menu.Item
        key="login"
        onClick={handleItemClick}
        style={{ float: "right" }}
      >
        <Link to="/login">登录</Link>
      </Menu.Item>
    </Menu>
  );

  return menuBar;
};

export default MenuBar;
