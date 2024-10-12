'use client'
import React, {useState} from 'react'
import Link from 'next/link'
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function RegisterPage() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [conpass, setConpass] = useState('')
    const [error, setError] = useState('')
    const [userCheck, setUserCheck] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isUserFocused, setIsUserFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [emailCheck, setEmailCheck] = useState('')
    const [success, setSuccess] = useState('')
    const [check, setCheck] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false
    })

    // ตรวจสอบ password ทันทีที่ผู้ใช้พิมพ์
    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPass(password);

        // ตรวจสอบความยาว, ตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข
        setCheck({
            length: password.length >= 7,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        });
    }

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email)
        setEmailCheck(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    }

    const handleUserChange = (e) => {
        const username = e.target.value;
        setUser(username);
        setUserCheck(username.length >= 7); // ตรวจสอบความยาว Username
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (!email || !name || !pass || !user){
            setError("Please fill all input!")
            return;
        }
        if (!emailCheck) {
            setError("Email invalid!")
            return;
        }
        if (!userCheck) {
            setError("Username invalid!")
            return;
        }
        if (!check.length || !check.lowercase || !check.number || !check.uppercase){
            setError("Password incorrect!")
            return;
        }
        if (pass !== conpass) {
            setError("Password not match!")
            return;
        }
        

        try{

            const resCheckUser = await fetch("http://localhost:3000/api/checkuser",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    email, 
                    user,
                })
            })

            const data = await resCheckUser.json();

            if (!resCheckUser.ok) {
                setError(data.error);
                return;
            }

            const res = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    name, email, user, pass
                })
            })

            if(res.ok) {
                setEmail('');
                setName('');
                setUser('');
                setPass('');
                setConpass('');
                setError("");
                setUserCheck(false)
                setEmailCheck('')
                setCheck({
                    length: false,
                    lowercase: false,
                    uppercase: false,
                    number: false
                })

                setSuccess("Registration completed")
            }else {
                console.log("User registration failed.")
            }

        }catch(error){
            console.log("Error during registration: ", error)
        }
    }

  return (
    <div className=''>
        <div className='container mx-auto w-[20rem]'>
            <h3 className='my-3 text-4xl'>Register</h3>
            <form className='flex flex-col ' onSubmit={handleSubmit}>
                <input 
                    className='block bg-gray-200 p-2 my-1 rounded-lg' 
                    type="email" 
                    placeholder='Email' 
                    value={email} 
                    onChange={handleEmailChange} 
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                />
                <div className="relative">
                    {isEmailFocused && (
                        <div className='valid absolute z-10 top-2 left-0 bg-white p-2 rounded shadow-lg w-full'>
                            <div className='flex flex-row text-sm'>
                                {emailCheck ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                                <span className={emailCheck ? 'text-green-600' : 'text-red-500'}>Email should be like "example@example.com"</span>
                            </div>
                        </div>
                    )}
                </div>
                <input className='block bg-gray-200 p-2 my-1 rounded-lg' type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                <input 
                    className='block relative bg-gray-200 p-2 my-1 rounded-lg' 
                    type="text" 
                    placeholder='Username' 
                    value={user} 
                    onChange={handleUserChange}
                    onFocus={() => setIsUserFocused(true)}
                    onBlur={() => setIsUserFocused(false)}
                />
                <div className="relative">
                    {isUserFocused && (
                        <div className='valid absolute z-10 top-2 left-0 bg-white p-2 rounded shadow-lg w-full'>
                            <div className='flex flex-row text-sm'>
                                {userCheck ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                                <span className={userCheck ? 'text-green-600' : 'text-red-500'}>User minimum of 7 character length</span>
                            </div>
                        </div>
                    )}
                </div>
                <input 
                    className='block bg-gray-200 p-2 my-1 rounded-lg relative' 
                    type="password" 
                    placeholder='Password' 
                    value={pass} 
                    onChange={handlePasswordChange}
                    onFocus={() => setIsPasswordFocused(true)} // เมื่อคลิกในช่อง Password
                    onBlur={() => setIsPasswordFocused(false)}  // เมื่อเลิกคลิกที่ช่อง Password
                />
                {/* แสดงข้อความการตรวจสอบใต้ช่อง Password */}
                <div className="relative">
                    {isPasswordFocused && (
                        <div className='valid absolute top-2 left-0 bg-white p-2 rounded shadow-lg w-full'>
                            <div className='flex flex-row text-sm'>
                                {check.length ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                                <span className={check.length ? 'text-green-600' : 'text-red-500'}>Password minimum of 7 character length</span>
                            </div>
                            <div className='flex flex-row text-sm'>
                                {check.lowercase ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                                <span className={check.lowercase ? 'text-green-600' : 'text-red-500'}>Password contain character a-z</span>
                            </div>
                            <div className='flex flex-row text-sm'>
                                {check.uppercase ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                                <span className={check.uppercase ? 'text-green-600' : 'text-red-500'}>Password contain character upper and lower</span>
                            </div>
                            <div className='flex flex-row text-sm'>
                                {check.number ? <FaCheck size={21} color='#16a34a' /> : <RxCross2 size={21} color='#ef4444' />}
                                <span className={check.number ? 'text-green-600' : 'text-red-500'}>Password contain number</span>
                            </div>
                        </div>
                    )}
                </div>
                <input className='block bg-gray-200 p-2 my-1 rounded-lg' type="password" placeholder='Confirm Password' value={conpass} onChange={(e) => setConpass(e.target.value)} />
                <button type='submit' className='bg-blue-400 p-2 my-3 rounded-lg text-white'>Sign Up</button>
            </form>
            <Link href="/" className="text-green-500">Go back to Login</Link>

            <div className='valid my-4'>
                {error && (
                    <div className='bg-red-500 w-fit text-sm text-white py-1 rounded-md mt-2'>
                        {error}
                    </div>
                )}
                {success && (
                    <div className='bg-green-500 w-fit text-sm text-white py-1 rounded-md mt-2'>
                        {success}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default RegisterPage
