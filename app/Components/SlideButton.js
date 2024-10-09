import React, { useState, useRef } from 'react';

const SlideButton = ({ onComplete, backgroundImage }) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const buttonRef = useRef(null);

  const buttonWidth = 300; // Width of the button container
  const sliderWidth = 50;  // Width of the draggable slider
  const halfwayPoint = ((buttonWidth - sliderWidth) / 2) + 100; // Halfway point of the slider button

  // Handle both mouse and touch start events
  const handleStart = () => {
    setIsDragging(true);
  };

  // Handle both mouse and touch end events
  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (position >= halfwayPoint) {
        onComplete(); // Trigger the onComplete action when past halfway
        setTimeout(() => setPosition(0), 300); // Reset slider after a brief delay
      } else {
        setPosition(0); // Reset slider if not past halfway
      }
    }
  };

  // Handle both mouse and touch move events
  const handleMove = (clientX) => {
    if (isDragging) {
      const buttonLeft = buttonRef.current.getBoundingClientRect().left;
      const newPosition = Math.min(Math.max(0, clientX - buttonLeft), buttonWidth - sliderWidth);
      setPosition(newPosition);
    }
  };

  // Mouse event handlers
  const handleMouseMove = (e) => handleMove(e.clientX);

  // Touch event handlers
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={buttonRef}
      className="relative w-[300px] h-12 rounded-full overflow-hidden bg-gray-300"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Apply background image dynamically
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      <div 
        ref={sliderRef}
        className={`absolute h-full rounded-full bg-green-500 cursor-pointer`}
        style={{
          width: sliderWidth,
          left: `${position}px`,
          transition: isDragging ? 'none' : 'left 0.2s ease',
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      />
    </div>
  );
};

export default SlideButton;
