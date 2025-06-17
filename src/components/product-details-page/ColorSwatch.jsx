import React from 'react'

const ColorSwatch = ({ isActive, onClick, background }) => {
    return (
        <div
            onClick={onClick}
            className={`w-6 h-6 rounded-full border border-gray-300 mx-0.5 cursor-pointer flex-shrink-0 
                        ${isActive ? "ring-2 ring-[#bb1f2a]" : ""}`}
            style={{ background }}
        />
    )
}

export default ColorSwatch