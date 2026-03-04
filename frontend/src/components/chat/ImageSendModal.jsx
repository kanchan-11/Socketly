import React, { memo, useCallback, useEffect, useRef } from "react";
import { MdClose, MdSend } from "react-icons/md";

const ImageSendModal = ({ previewUrl, uploading, onConfirm, onCancel }) => {
    const modalRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !uploading) onConfirm();
        if (e.key === 'Escape') onCancel();
    }, [uploading, onConfirm, onCancel]);

    useEffect(() => {
        modalRef.current?.focus();
    }, []);

    if (!previewUrl) return null;

    return (
        <div 
            ref={modalRef}
            className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <button 
                onClick={onCancel}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Cancel"
            >
                <MdClose size={32} />
            </button>
            
            <p className="text-white text-lg mb-4">Send this image?</p>
            
            <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-[80vw] max-h-[70vh] object-contain rounded-lg"
            />
            
            <div className="flex gap-4 mt-6">
                <button 
                    onClick={onCancel}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    disabled={uploading}
                    className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center gap-2 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            <MdSend size={20} />
                            Send
                        </>
                    )}
                </button>
            </div>
            <p className="text-gray-400 text-sm mt-3">Press Enter to send, Escape to cancel</p>
        </div>
    );
};

export default memo(ImageSendModal);
