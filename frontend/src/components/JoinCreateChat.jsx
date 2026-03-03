import React, { useState } from "react";
import chatIcon from "../assets/ic_chat.png";
import toast from "react-hot-toast";
import { createRoomService as createRoomApi, joinRoomService } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat = () => {
    const [detail, setDetail] = useState({
        userName: "",
        roomId: ""
    });
    const { roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected} = useChatContext();
    const navigate = useNavigate();
    function handleFormInputChange(event) {
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,
        });
    }
    function validateForm() {
        if (detail.userName.trim() === "" || detail.roomId.trim() === "") {
            toast.error("Please fill in all fields");
            return false;
        }
        return true;
    }
    async function joinChat() {
        if (validateForm()) {
            console.log("Joining chat with details: ", detail);
            
            try {
                
                const room = await joinRoomService(detail.roomId);
            toast.success("Joining room...");
            setRoomId(room.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate(`/chat`);
                console.log("Joined room successfully: ", room);
                toast.success("Joined room successfully");
            } catch (error) {
                if(error.status == 400) {
                    toast.error(error.response.data);
                }
                else{
                    toast.error("Failed to join room");
                }
                console.error("Error joining room: ", error);
            }
        }
        
    }
    async function createRoom() {
        if (validateForm()) {
            console.log("Creating chat room with details: ", detail);
            try {
                const response = await createRoomApi(detail);
                setRoomId(response.roomId);
                setCurrentUser(response.userName);
                setConnected(true);
                navigate(`/chat`);
                console.log("Room created successfully: ", response);
                toast.success("Room created successfully");
                joinChat();
            } catch (error) {
                console.error("Error creating room: ", error);
                if (error.status == 400) {
                    toast.error("Room already exists. Please choose a different Room ID.");
                } else {
                    toast.error("Failed to create room");
                }
            }
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-10 dark:border-gray-700 border w-full max-w-md rounded flex flex-col gap-5 dark:bg-gray-900 shadow">
                <div>
                    <img src={chatIcon} alt="Chat Icon" className="w-18 h-16 mx-auto" />
                </div>
                <h1 className="text-2xl font-semibold text-center">Join or Create a Chat Room</h1>
                <div className="">
                    <label htmlFor="name" className="block font-medium md-2">Your Name</label>
                    <input
                        name="userName"
                        onChange={handleFormInputChange}
                        value={detail.userName}
                        type="text"
                        id="name"
                        placeholder="Enter your name" className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="">
                    <label htmlFor="name" className="block font-medium md-2">Room ID / New Room ID</label>
                    <input
                        name="roomId"
                        onChange={handleFormInputChange}
                        value={detail.roomId}
                        type="text"
                        id="roomId"
                        className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter room ID or create new one" />
                </div>
                <div className="flex justify-center gap-2 margin-top">
                    <button onClick={joinChat} className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full">Join Button</button>
                    <button onClick={createRoom} className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full">Create Button</button>
                </div>
            </div>
        </div>
    );
}
export default JoinCreateChat;