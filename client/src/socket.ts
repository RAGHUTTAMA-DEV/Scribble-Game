import {io,Socket} from "socket.io-client"

const URL="http://localhost:5000"

export const socket=io(URL,{
    transports:["websocket"]    
})

