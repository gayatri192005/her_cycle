
import React from 'react';
import Auth from '@/components/Auth';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 bg-background" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(229, 222, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)' }}>
      <Auth mode="register" />
    </div>
  );
};

export default Register;
