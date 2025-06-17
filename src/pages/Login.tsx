
import React from 'react';
import Auth from '@/components/Auth';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 bg-background" style={{ backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255, 182, 193, 0.15) 0%, rgba(255, 255, 255, 0) 50%)' }}>
      <Auth mode="login" />
    </div>
  );
};

export default Login;
