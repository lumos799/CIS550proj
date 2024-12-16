// src/components/NavBar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation(); // 获取当前路由路径，用于高亮当前页面按钮

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* 左侧标题：可点击并跳转到首页 */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: '#ffffff', // 白色文字
            textDecoration: 'none', // 去掉下划线
            '&:hover': { color: '#ffcc00' }, // 鼠标悬停时变为黄色
          }}
        >
          Navigation Pane
        </Typography>

        {/* 导航按钮 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/business"
            sx={{
              color: location.pathname === '/business' ? '#ffcc00' : '#ffffff', // 当前路径高亮黄色
              textTransform: 'none', // 取消文字大写
              fontWeight: location.pathname === '/business' ? 'bold' : 'normal', // 当前路径加粗
              '&:hover': {
                backgroundColor: 'transparent', // 悬停时背景透明
                color: '#ffcc00', // 悬停时变为黄色
              },
            }}
          >
            Business
          </Button>
          <Button
            component={Link}
            to="/restaurant"
            sx={{
              color: location.pathname === '/restaurant' ? '#ffcc00' : '#ffffff',
              textTransform: 'none',
              fontWeight: location.pathname === '/restaurant' ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#ffcc00',
              },
            }}
          >
            City Insights
          </Button>
          <Button
            component={Link}
            to="/complex3"
            sx={{
              color: location.pathname === '/complex3' ? '#ffcc00' : '#ffffff',
              textTransform: 'none',
              fontWeight: location.pathname === '/complex3' ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#ffcc00',
              },
            }}
          >
            Users Page
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
