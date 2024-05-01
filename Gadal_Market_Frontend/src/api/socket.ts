import { io } from "socket.io-client";
const URL = 'https://api.gadalmarket.com'
export const socket = io(URL,{autoConnect:false})