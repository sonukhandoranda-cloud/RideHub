import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);


const socket = io( "http://localhost:4000",
  {
    transports:["websocket"], });

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

     

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

   

    // ❌ DO NOT disconnect here
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;