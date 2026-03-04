import React, { memo, useCallback, useEffect } from "react";
import { MdClose } from "react-icons/md";

const ImagePreviewModal = ({ imageUrl, onClose }) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!imageUrl) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Close preview"
            >
                <MdClose size={32} />
            </button>
            <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
                loading="lazy"
            />
        </div>
    );
};

export default memo(ImagePreviewModal);
