import React, { useEffect } from 'react';

const BackDrop = ({songIndex,isPlaying,activeColor}) => {
    useEffect(() => {
      document.documentElement.style.setProperty("--active-color",activeColor)
      
    }, [activeColor,songIndex])
    return (
        <div className={`color-backdrop ${isPlaying ? "playing" : "idle"}`} />
    );
};

export default BackDrop;