import React from 'react';
import useAuthStore from "@/stores/user.ts";

interface PropsTypes {
  auth?: string;
  children: React.ReactNode;
}

const ButtonAccess =  ( props: PropsTypes ) => {

  const access = useAuthStore((model) => model.access);

  const buttonAccess = (name?: string) => {
    if( name) {
      return access.includes(name.toLowerCase())
    }else {
      return true;
    }
  }

  return (
    <>
      { buttonAccess(props.auth) ? props.children : null }
    </>
  );
}

export default ButtonAccess