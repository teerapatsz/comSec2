"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [check, setCheck] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message); // Set message after sending OTP
      if (res.ok) {
        setStep(2); // Proceed to the next step if successful
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
      console.error('Error:', error);
    }
  };

  const validatePassword = (password) => {
    const newCheck = {
      length: password.length >= 7,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };
    setCheck(newCheck);
    return newCheck.length && newCheck.lowercase && newCheck.uppercase && newCheck.number;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(newPassword)) {
      setMessage('Password does not meet the requirements.');
      return;
    }

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setStep(3); // Move to success step
    } catch (error) {
      setMessage('Error verifying OTP. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
          {message && <p>{message}</p>} {/* Show message after sending OTP */}
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            required
          />
          {/* Validation Messages */}
          <div className="relative">
            {isPasswordFocused && (
              <div className='valid absolute top-2 left-0 bg-white p-2 rounded shadow-lg w-full'>
                <div className='flex flex-row text-sm'>
                  {check.length ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                  <span className={check.length ? 'text-green-600' : 'text-red-500'}>Password minimum of 7 characters</span>
                </div>
                <div className='flex flex-row text-sm'>
                  {check.lowercase ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                  <span className={check.lowercase ? 'text-green-600' : 'text-red-500'}>Password contains characters a-z</span>
                </div>
                <div className='flex flex-row text-sm'>
                  {check.uppercase ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                  <span className={check.uppercase ? 'text-green-600' : 'text-red-500'}>Password contains upper and lower case</span>
                </div>
                <div className='flex flex-row text-sm'>
                  {check.number ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                  <span className={check.number ? 'text-green-600' : 'text-red-500'}>Password contains a number</span>
                </div>
              </div>
            )}
          </div>
          <button type="submit">Reset Password</button>
          {message && <p>{message}</p>} {/* Show message after verifying OTP */}
        </form>
      )}
      {step === 3 && (
        <p>Password reset successfully. You can now log in with your new password.</p>
      )}
      
      {/* Link to go back to Login */}
      <Link href="/" className="text-blue-500 hover:underline mt-4">
        Go back to Login
      </Link>
    </div>
  );
}

export default ForgotPasswordPage;
