'use client'
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  

  const [cooldownTime, setCooldownTime] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [isCooldown, setIsCooldown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const attempts = parseInt(localStorage.getItem('failedAttempts')) || 0;
      const cooldown = parseInt(localStorage.getItem('cooldownTime')) || 0;
      setFailedAttempts(attempts);
      setCooldownTime(cooldown);
    }
  }, []);

  // Load the cooldown state from localStorage on component mount
  useEffect(() => {
    if (isCooldown) {
      const interval = setInterval(() => {
        setCooldownTime((prev) => {
          const updatedTime = prev - 1;
          localStorage.setItem('cooldownTime', updatedTime);
          return updatedTime;
        });
      }, 1000);

      if (cooldownTime <= 0) {
        setIsCooldown(false);
        setFailedAttempts(0);
        setError('')
        localStorage.removeItem('cooldownTime');
        localStorage.removeItem('failedAttempts');
      }

      return () => clearInterval(interval);
    }
  }, [isCooldown, cooldownTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCooldown) {
      setError(`Please wait ${cooldownTime} seconds before trying again.`);
      return;
    }

    try {
      const res = await signIn("credentials", {
        user, pass, redirect: false
      });

      if (res.error) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        localStorage.setItem('failedAttempts', newFailedAttempts);

        if (newFailedAttempts >= 5) {
          setIsCooldown(true);
          setCooldownTime(5); // Cooldown for 5 minutes
          setError('You can not log in please wait')
          localStorage.setItem('cooldownTime', 5);
        }   
        else {
          setError(`Username or password wrong. You have ${5 - newFailedAttempts} attempts left.`);
        }
        return;
      }

      localStorage.setItem('failedAttempts', 0)
      setFailedAttempts(0)
      router.replace("/welcome");

    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className='w-[25rem] h-[20rem] shadow-md rounded-xl flex items-center bg-red-300' style={{ 
         backgroundColor: 'rgba(0, 0, 0, 0.2)',  // สีแดงโปร่งแสง
         backdropFilter: 'blur(2px)'  // เบลอพื้นหลัง
       }}>
        <div className='container  mx-auto w-[20rem]'>
          <h3 className='my-5 text-4xl font-extrabold text-center text-white'>Login</h3>
          <form className='flex flex-col' onSubmit={handleSubmit}>
            <input
              onChange={(e) => setUser(e.target.value)}
              className='block bg-gray-200 p-2 my-1 rounded-lg'
              type="text"
              placeholder='Username'
              disabled={isCooldown}  
            />
            <input
              onChange={(e) => setPass(e.target.value)}
              className='block bg-gray-200 p-2 my-1 rounded-lg'
              type="password"
              placeholder='Password'
              disabled={isCooldown}  
            />
            <Link href="/forgotpassword" className='self-end mt-2 text-sm text-red-600'>forgot password</Link>
            <button 
              type='submit' 
              className='bg-blue-400 p-2 my-3 rounded-lg text-white'
              disabled={isCooldown}
            >
              {isCooldown ? `Try again in ${cooldownTime} seconds` : 'Login'}
            </button>
          </form>
          {error && (
            <div className="bg-red-500 w-fit text-sm text-white">
              {error}
            </div>
          )}
          <p className='text-white'>Don't have an account? <Link href="/register" className="text-red-600">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
