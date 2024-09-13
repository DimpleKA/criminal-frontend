import React, { useState } from 'react';
import classNames from 'classnames';

const PatterLock = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pattern, setPattern] = useState([]);
  const correctPattern = [1, 2, 3, 6, 9];

  // Handles the dot click
  const handleDotClick = (number) => {
    if (pattern.includes(number)) return; // Avoid duplicate dots
    setPattern((prev) => [...prev, number]);
  };

  // Check the pattern after drawing
  const checkPattern = () => {
    if (JSON.stringify(pattern) === JSON.stringify(correctPattern)) {
      setIsUnlocked(true);
    } else {
      setPattern([]); // Reset the pattern if it's incorrect
    }
  };

  return (
    <>
      {/* Full screen modal */}
      {!isUnlocked && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-100">
          <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-center text-2xl font-semibold mb-4">Draw Pattern to Unlock</h2>

            {/* Pattern Grid */}
            <div className="grid grid-cols-3 gap-4 justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <div
                  key={number}
                  onClick={() => handleDotClick(number)}
                  className={classNames(
                    'w-16 h-16 rounded-full border-4 border-gray-400',
                    'flex items-center justify-center cursor-pointer',
                    pattern.includes(number) ? 'bg-blue-500' : 'bg-transparent'
                  )}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6">
              <button
                onClick={checkPattern}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit Pattern
              </button>
              <button
                onClick={() => setPattern([])}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content when unlocked */}
      {isUnlocked && (
        <div className="w-full h-screen flex items-center justify-center bg-green-500 text-white">
          <h1 className="text-4xl">Unlocked!</h1>
        </div>
      )}
    </>
  );
};

export default PatterLock;
