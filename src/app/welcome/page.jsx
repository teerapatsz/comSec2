'use client'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function WelcomePage() {

  const { data: session, status } = useSession()
  console.log(session)
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  return (
    <div className='flex justify-center'>
      <div className='container mx-auto w-full h-full'>
        <h3 className='text-center my-4 text-5xl font-bold'>Welcome</h3>
        <p className='text-center text-2xl font-bold text-red-500'>Name: <span className='text-black font-normal text-lg'>{session?.user?.name}</span></p>
        <p className='text-center text-2xl font-bold text-red-500'>Email: <span className='text-black font-normal text-lg'>{session?.user?.email}</span></p>
        <div className='flex justify-center mt-4'> {/* Centering the button */}
          <button className="btn btn-error" onClick={() => signOut()}>Sign Out</button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage