import React, { memo } from "react";
import { timeAgo } from "../../config/helper";
import { baseURL } from "../../config/AxiosHelper";

const AVATAR_URL = 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light';

const getImageUrl = (url) => {
    if (url && url.startsWith('/api/')) {
        return `${baseURL}${url}`;
    }
    return url;
};

const isImageMessage = (message) => {
    return message.messageType === "IMAGE" || 
           (message.content && (message.content.match(/\.(jpeg|jpg|gif|png|webp)$/i) || message.content.startsWith('data:image')));
};

const MessageBubble = ({ message, isOwnMessage, onImageClick }) => {
    const bubbleClass = isOwnMessage ? "bg-green-500" : "bg-blue-500";
    const alignClass = isOwnMessage ? "justify-end" : "justify-start";

    return (
        <div className={`flex ${alignClass}`}>
            <div className={`my-2 ${bubbleClass} p-2 rounded max-w-xs`}>
                <div className="flex flex-row gap-2">
                    <img 
                        src={AVATAR_URL}
                        alt="" 
                        className="w-10 h-10" 
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold">{message.sender}</p>
                        {isImageMessage(message) ? (
                            <img 
                                src={getImageUrl(message.content)} 
                                alt="Shared image" 
                                className="max-w-[200px] max-h-[200px] rounded cursor-pointer object-cover hover:opacity-90 transition-opacity"
                                onClick={() => onImageClick(getImageUrl(message.content))}
                                loading="lazy"
                            />
                        ) : (
                            <p>{message.content}</p>
                        )}
                        <p className="text-xs text-gray-600 self-end">
                            {timeAgo(message.timeStamp)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(MessageBubble);
