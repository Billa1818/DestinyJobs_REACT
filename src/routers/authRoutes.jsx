import React from 'react';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import ResetPassword from '../pages/user/ResetPassword';
import SeachAccounts from '../pages/user/SeachAccounts';

const authRoutes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/signup/:type',
    element: <Signup />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/search-accounts',
    element: <SeachAccounts />
  }
];

export default authRoutes; 