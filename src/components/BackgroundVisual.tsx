import React from 'react';

export const BackgroundVisual: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
      {/* Top Left Blob */}
      <svg className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] text-indigo-100/50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.5C87.4,-33.8,90,-18.6,89.3,-3.5C88.6,11.5,84.6,26.2,77,39.6C69.4,53,58.2,65.1,44.5,72.6C30.8,80.1,14.6,83,0.5,82.2C-13.6,81.4,-27.2,76.9,-39.8,69.5C-52.4,62.1,-64,51.8,-72.1,39.3C-80.2,26.8,-84.8,12.1,-84.1,-2.4C-83.4,-16.9,-77.4,-31.2,-68.5,-43.3C-59.6,-55.4,-47.8,-65.3,-34.5,-72.9C-21.2,-80.5,-6.4,-85.8,8.2,-87.2C22.8,-88.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
      </svg>
      
      {/* Middle Right Blob */}
      <svg className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] text-violet-100/50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M38.1,-65.1C50.2,-58.4,61.4,-49.4,69.3,-38.2C77.2,-27.1,81.8,-13.8,81.1,-0.4C80.4,13,74.4,26.5,65.9,38.2C57.4,49.9,46.4,59.8,33.8,66.8C21.2,73.8,7,77.9,-7.7,77.5C-22.4,77.1,-37.6,72.2,-49.6,63.4C-61.6,54.6,-70.4,41.9,-75.4,28.1C-80.4,14.3,-81.6,-0.6,-78.7,-14.9C-75.8,-29.2,-68.8,-42.9,-58,-50C-47.2,-57.1,-32.6,-57.6,-20,-64.1C-7.4,-70.6,3.2,-83.1,15.6,-81.9C28,-80.7,26,-65.8,38.1,-65.1Z" transform="translate(100 100)" />
      </svg>

      {/* Bottom Left Blob */}
      <svg className="absolute -bottom-[5%] left-[20%] w-[25%] h-[25%] text-blue-100/30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M42.2,-71.4C54.9,-65.2,65.6,-54,73.5,-40.8C81.4,-27.6,86.5,-12.4,85.1,2.4C83.7,17.2,75.8,31.6,65.4,43.5C55,55.4,42.1,64.8,28.2,71.1C14.3,77.4,-0.6,80.6,-15.8,78.8C-31,77,-46.5,70.2,-58.5,60C-70.5,49.8,-79,36.2,-82.9,21.5C-86.8,6.8,-86.1,-9,-81.2,-23.6C-76.3,-38.2,-67.2,-51.6,-54.8,-57.9C-42.4,-64.2,-26.7,-63.4,-12.8,-68.8C1.1,-74.2,14.9,-85.8,29.5,-77.6C44.1,-69.4,29.5,-77.6,42.2,-71.4Z" transform="translate(100 100)" />
      </svg>

      {/* Global Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};
