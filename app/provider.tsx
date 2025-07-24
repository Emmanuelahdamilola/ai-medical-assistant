"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserProfile, useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/userDetailContext';

export type UsersDetail = {
  name: string,
  email: string,
}

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const {user} = useUser();
  const [userDetail, setUserDetail] = useState<any>()

  useEffect(() => {
    user && createNewUser();
  }, [user]);

  const createNewUser = async () => {
    const result = await axios.post('/api/users')
    console.log(result.data);
    setUserDetail(result.data);
  }
  return (
    <div>
      <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        {children}
      </UserDetailContext.Provider>
    </div>
  )
}
