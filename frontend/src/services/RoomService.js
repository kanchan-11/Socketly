import { httpClient } from "../config/AxiosHelper"

export const createRoomService = async (roomDetail) => {
    const response = await httpClient.post("/api/v1/chatrooms", roomDetail,{
        headers: {
            "Content-Type": "text/plain"
        }
    });
    return response.data;
};

export const joinRoomService = async (roomId) => {
    const response = await httpClient.get(`/api/v1/chatrooms/${roomId}`);
    return response.data;
};

export const getChatHistoryService = async (roomId,size=50,page=0) => {
    const response = await httpClient.get(`/api/v1/chatrooms/${roomId}/messages?size=${size}&page=${page}`);
    return response.data;
}

export const uploadImageService = async (roomId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpClient.post(`/api/v1/images/upload/${roomId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data.imageUrl;
};