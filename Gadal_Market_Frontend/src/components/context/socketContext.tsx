import React, { ReactElement, useEffect, useState } from "react";
import { socket } from "../../api/socket";
import { useQuery } from "@tanstack/react-query";
import getUnreadMessageCount from "../../api/messages/getUnreadMessages";
import getUnreadNotifications from "../../api/notifications/getUnreadNotifications";
const intialContextData:string[] = []
export const SocketCon  = React.createContext({
    connectedUsers:intialContextData,
    unreadCount:0,
    unreadNotifications:0,
})
export default function SocketContext({children}:{children:ReactElement}){
    const userId = localStorage.getItem('userId') as string
    const [connectedUsers,setConnectedUsers] = useState<string[]>([])
    const [unreadCount,setUnreadCount] = useState(0)
    const [unreadNotifications,setUnreadNotifications] = useState(0)
    const {data:unreadMessagesCount} = useQuery({
        queryKey:['get_unread_Messages_count',userId],
        queryFn:()=>getUnreadMessageCount(userId as string),
        enabled:Boolean(userId)
    })
    const {data:unreadNotificationsCount} = useQuery({
        queryKey:['get_unread_Notifications_count',userId],
        queryFn:()=>getUnreadNotifications(userId as string),
        enabled:Boolean(userId)
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
        // add 1 to the count whenever new messages arrive for the looged in user
        if(newMessage?.receiver === userId){
        setUnreadCount(unreadCount + 1)
        }
    })
    socket.on('notification',(notification)=>{
        // add 1 to the notification count whenever there is a new notification
        console.log(notification)
        if(notification?.user === userId || notification?.isCampaign){
        setUnreadNotifications(unreadNotifications +1)
        }
    })
    useEffect(()=>{
        if(unreadMessagesCount?.unreadCount){
            setUnreadCount(unreadMessagesCount?.unreadCount)
        }
    },[unreadMessagesCount])
    useEffect(()=>{
        if(unreadNotificationsCount?.unreadCount){
            setUnreadNotifications(unreadNotificationsCount?.unreadCount)
        }
    },[unreadNotificationsCount])
    return (
       <SocketCon.Provider
            value={{
                connectedUsers,
                unreadCount,
                unreadNotifications
            }}
       >
        {
            children
        }
       </SocketCon.Provider>
    )
}
