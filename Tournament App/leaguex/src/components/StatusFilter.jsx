import React, { useState } from "react";

const statusOptions = ["All", "Finished", "Ongoing", "Ready", "Waiting"];

export default function StatusFilter({ selected, onSelect }) {
    const [active, setActive] = useState(selected || "All");

    const handleSelect = (status) => {
        setActive(status);
        onSelect(status); // callback prop
    };

    return (
        <div className="flex bg-gray-700 w-1/3 m-auto rounded-full px-2 py-1 space-x-4 items-center justify-center mb-7">
            {statusOptions.map((status, idx) => (
                <button
                    key={idx}
                    onClick={() => handleSelect(status)}
                    className={`text-sm font-semibold px-4 py-2 rounded-full transition duration-200
                        ${active === status
                            ? "bg-green-500 text-white"
                            : "text-gray-300 hover:text-white"}`}
                >
                    {status}
                </button>
            ))}
        </div>
    );
}
