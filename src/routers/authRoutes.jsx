import React from 'react';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import ResetPassword from '../pages/user/ResetPassword';
import ResetPasswordConfirm from '../pages/user/ResetPasswordConfirm';
import VerifyEmail from '../pages/user/VerifyEmail';
import SeachAccounts from '../pages/user/SeachAccounts';
import ProtectedAuthRoute from '../components/auth/ProtectedAuthRoute';

const authRoutes = [
  {
    path: '/login',
    element: <ProtectedAuthRoute><Login /></ProtectedAuthRoute>
  },
  {
    path: '/signup',
    element: <ProtectedAuthRoute><Signup /></ProtectedAuthRoute>
  },
  {
    path: '/signup/:type',
    element: <ProtectedAuthRoute><Signup /></ProtectedAuthRoute>
  },
  {
    path: '/reset-password',
    element: <ProtectedAuthRoute><ResetPassword /></ProtectedAuthRoute>
  },
  {
    path: '/reset-password/:uid/:token',
    element: <ProtectedAuthRoute><ResetPasswordConfirm /></ProtectedAuthRoute>
  },
  {
    path: '/verify-email/:uid/:token',
    element: <VerifyEmail />
  },
  {
    path: '/search-accounts',
    element: <ProtectedAuthRoute><SeachAccounts /></ProtectedAuthRoute>
  }
];

export default authRoutes; 