import React, { useEffect, useRef, useState, useCallback } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getChatHistoryService, uploadImageService } from "../services/RoomService";
import { isSameDay } from "../config/helper";
import { MessageBubble, DateSeparator, ImagePreviewModal, ImageSendModal } from "./chat";

const ChatPage = () => {
    const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [pendingImage, setPendingImage] = useState(null);
    
    const chatBoxRef = useRef(null);
    const fileInputRef = useRef(null);
    const stompClientRef = useRef(null);

    // Redirect if not connected
    useEffect(() => {
        if (!connected) navigate("/");
    }, [connected, navigate]);

    // Load chat history
    useEffect(() => {
        if (!connected) return;
        
        const loadChatHistory = async () => {
            try {
                const response = await getChatHistoryService(roomId);
                setMessages(response);
            } catch (error) {
                toast.error("Failed to load chat history");
            }
        };
        loadChatHistory();
    }, [roomId, connected]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    // WebSocket connection with cleanup
    useEffect(() => {
        if (!connected) return;

        const socket = new SockJS(`${baseURL}/chat`);
        const client = Stomp.over(socket);
        client.debug = () => {}; // Disable debug logs
        
        client.connect({}, () => {
            setStompClient(client);
            stompClientRef.current = client;
            toast.success("Connected to chat server");
            
            client.subscribe(`/topic/room/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        }, () => {
            toast.error("Failed to connect to chat server");
        });

        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [roomId, connected]);

    const sendMessage = useCallback(() => {
        if (stompClient && connected && input.trim()) {
            const message = {
                content: input,
                sender: currentUser,
                roomId: roomId
            };
            try {
                stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
                setInput("");
            } catch (error) {
                toast.error("Failed to send message");
            }
        }
    }, [stompClient, connected, input, currentUser, roomId]);

    const handleFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImageUpload = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setPendingImage({ file, previewUrl });
        e.target.value = '';
    }, []);

    const cancelPendingImage = useCallback(() => {
        if (pendingImage?.previewUrl) {
            URL.revokeObjectURL(pendingImage.previewUrl);
        }
        setPendingImage(null);
    }, [pendingImage]);

    const confirmSendImage = useCallback(async () => {
        if (!pendingImage?.file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadImageService(roomId, pendingImage.file);
            if (stompClient && connected) {
                const message = {
                    content: imageUrl,
                    sender: currentUser,
                    roomId: roomId,
                    messageType: "IMAGE"
                };
                stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
                toast.success("Image sent");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
            if (pendingImage?.previewUrl) {
                URL.revokeObjectURL(pendingImage.previewUrl);
            }
            setPendingImage(null);
        }
    }, [pendingImage, roomId, stompClient, connected, currentUser]);

    const handleImageClick = useCallback((imageUrl) => {
        setPreviewImage(imageUrl);
    }, []);

    const closePreview = useCallback(() => {
        setPreviewImage(null);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") sendMessage();
    }, [sendMessage]);

    const handleLogOut = useCallback(() => {
        stompClientRef.current?.disconnect();
        setConnected(false);
        setMessages([]);
        setRoomId("");
        setCurrentUser("");
        setInput("");
        navigate("/");
    }, [setConnected, setRoomId, setCurrentUser, navigate]);
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
                {messages.map((message, index) => {
                    const showDateSeparator = index === 0 || 
                        !isSameDay(message.timeStamp, messages[index - 1].timeStamp);
                    
                    return (
                        <React.Fragment key={index}>
                            {showDateSeparator && (
                                <DateSeparator timestamp={message.timeStamp} />
                            )}
                            <MessageBubble
                                message={message}
                                isOwnMessage={message.sender === currentUser}
                                onImageClick={handleImageClick}
                            />
                        </React.Fragment>
                    );
                })}
            </main>
            <div className="fixed bottom-4 w-full h-16">
                <div className="h-full pr-10 gap-4 rounded-full w-1/2 items-center justify-between flex mx-auto dark:bg-gray-900">
                    <input
                        type="text"
                        onKeyDown={handleKeyDown}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="dark:border-gray-600 focus:outline-none px-5 dark:bg-gray-800 rounded-full focus:ring-0 w-full py-2 h-full"
                    />
                    <div className="flex gap-1">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <button 
                            onClick={handleFileSelect} 
                            disabled={uploading}
                            className={`dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:dark:bg-purple-700'}`}
                        >
                            {uploading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <MdAttachFile size={20} />
                            )}
                        </button>
                        <button onClick={sendMessage} className="dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full hover:dark:bg-green-700">
                            <MdSend size={20} />
                        </button>
                    </div>

                </div>
            </div>

            <ImagePreviewModal 
                imageUrl={previewImage} 
                onClose={closePreview} 
            />

            <ImageSendModal
                previewUrl={pendingImage?.previewUrl}
                uploading={uploading}
                onConfirm={confirmSendImage}
                onCancel={cancelPendingImage}
            />
        </div>
    );
};

export default ChatPage;