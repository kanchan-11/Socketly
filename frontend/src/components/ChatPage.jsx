import React, { use, useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import { getChatHistoryService } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
    const { roomId, currentUser, connected, setConnected,setRoomId,setCurrentUser } = useChatContext();
    console.log(roomId, currentUser, connected);
    const navigate = useNavigate();
    useEffect(() => {
        if (!connected)
            navigate("/")
    }, [connected, roomId, currentUser]);
    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        async function loadChatHistory() {
            try {
                const response = await getChatHistoryService(roomId);
                console.log("Chat history response: ", response);
                setMessages(response);
                        
            } catch (error) {
                console.error("Error loading chat history: ", error);
                toast.error("Failed to load chat history");
            }
        }
        if(connected)
            loadChatHistory();
    }, [roomId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                    top: chatBoxRef.current.scrollHeight,
                    behavior: "smooth"
            });
        }
    }, [messages]);
    useEffect(() => {
        const connectWebSocket = () => {
            const socket = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(socket);
            client.connect({}, () => {
                console.log("Connected to WebSocket");
                setStompClient(client);
                toast.success("Connected to chat server");
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log("Received message: ", message);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            }, (error) => {
                console.error("WebSocket connection error: ", error);
                toast.error("Failed to connect to chat server");
            });
        }
        if(connected)
            connectWebSocket();
    }, [roomId]);

    const sendMessage = async () => {
        if(stompClient && connected && input.trim() !== "") {
            const message = {
                content: input, 
                sender: currentUser,
                roomId: roomId
            };
            try {
                stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
                setInput("");
            } catch (error) {
                console.error("Error sending message: ", error);
                toast.error("Failed to send message");
            }
        }
    }

    function handleLogOut() {
        stompClient.disconnect();
        setConnected(false);
        setMessages([]);
        setRoomId("");
        setCurrentUser("");
        setInput("");
        navigate("/");
    }
    return (
        <div className="">
            <header className="dark:border-gray-700 fixed w-full dark:bg-gray-900 shadow px-3 py-5 flex justify-around">
                <div className="">
                    <h1 className="text-xl font-semibold">
                        Room:<span>{roomId}</span>
                    </h1>
                </div>

                <div>
                    <h1 className="text-xl font-semibold">
                        User: <span>{currentUser}</span>
                    </h1>
                </div>
                <div>
                    <button onClick={handleLogOut} className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full">Leave Room</button>
                </div>
            </header>
            <main ref={chatBoxRef} className="py-20 px-10 dark:bg-slate-600 w-2/3 overflow-auto mx-auto h-screen">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                        <div className={`my-2 ${message.sender === currentUser ? "bg-green-500" : "bg-blue-500"} p-2 rounded max-w-xs`}>
                            <div className="flex flex-row gap-2">
                                <img src={'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'}
                                    alt="" className="w-10 h-10" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-bold">{message.sender}</p>
                                    <p>{message.content}</p>
                                    <p className="text-xs text-gray-600 self-end">{timeAgo(message.timeStamp)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                }
            </main>
            <div className="fixed bottom-4 w-full h-16">
                <div className="h-full pr-10 gap-4 rounded-full w-1/2 items-center justify-between flex mx-auto dark:bg-gray-900">
                    <input type="text" onKeyDown={(e)=>{
                        if(e.key === "Enter") {
                            sendMessage();
                        }
                    }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here..." className="dark:border-gray-600 focus:outline-none px-5 dark:bg-gray-800 rounded-full focus:ring-0 w-full py-2 rounded h-full" />
                    <div className="flex gap-1">
                        <button className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full">
                            <MdAttachFile size={20} />
                        </button>
                        <button onClick={sendMessage} className="dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full">
                            <MdSend size={20} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default ChatPage;