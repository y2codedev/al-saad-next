import React from 'react'

const SizeOption = ({ isActive, sizeName, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`uppercase px-2 rounded cursor-pointer shadow-[0_0_3px_rgba(0,0,0,0.5)] 
                        whitespace-nowrap font-medium h-[23px] 
                        ${isActive ? "bg-[#bb1f2a] text-white" : "bg-white text-black"}`}
        >
            <p style={{ fontSize: "14px", direction: "ltr" }}>{sizeName}</p>
        </div>
    )
}

export default SizeOption
