import React, { ReactElement, useState } from "react";
import { socket } from "../../api/socket";
import { useQuery } from "@tanstack/react-query";
import getUnreadMessageCount from "../../api/messages/getUnreadMessages";
const intialContextData:string[] = []
export const SocketCon  = React.createContext({connectedUsers:intialContextData,unreadCount:0,})
export default function SocketContext({children}:{children:ReactElement}){
    const userId = localStorage.getItem('userId')
    const [connectedUsers,setConnectedUsers] = useState<string[]>([])
    const {data:unreadMessagesCount} = useQuery({
        queryKey:['get_unread_Messages_count',userId],
        queryFn:()=>getUnreadMessageCount(userId as string)
    })
    React.useEffect(()=>{
    // establish connection if user is logged in
    if(userId){
        socket.auth = {userId}
        socket.connect();
    }
    // return ()=>{
    //     socket.off('connect_error')
    // }
    },[userId])
    socket.on('users',(users)=>{
      setConnectedUsers(users)
    })
    socket.on('new_message',(newMessage)=>{
        console.log(newMessage)
    })
    return (
       <SocketCon.Provider
            value={{
                connectedUsers,
                unreadCount:unreadMessagesCount?.unreadCount ? unreadMessagesCount?.unreadCount : 0
            }}
       >
        {
            children
        }
       </SocketCon.Provider>
    )
}
