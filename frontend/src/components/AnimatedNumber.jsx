import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ value = 0, duration = 600, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startVal = displayValue;
    const targetVal = typeof value === 'number' ? value : parseFloat(value) || 0;
    
    if (startVal === targetVal) return;

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = startVal + (targetVal - startVal) * easeProgress;
      
      setDisplayValue(Math.round(current * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(targetVal);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  const formatted = typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue;

  return (
    <span>{prefix}{formatted}{suffix}</span>
  );
};

export default AnimatedNumber;
