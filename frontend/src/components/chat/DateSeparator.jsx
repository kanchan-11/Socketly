import React, { memo } from "react";
import { formatDate } from "../../config/helper";

const DateSeparator = ({ timestamp }) => {
    return (
        <div className="flex items-center justify-center my-4">
            <div className="flex-1 border-t border-gray-500"></div>
            <span className="px-4 text-sm text-gray-400 bg-slate-600">
                {formatDate(timestamp)}
            </span>
            <div className="flex-1 border-t border-gray-500"></div>
        </div>
    );
};

export default memo(DateSeparator);
