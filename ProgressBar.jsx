import React from "react";

// ProgressBar component takes a 'progress' prop (percentage of completion)
const ProgressBar = ({ progress }) => (
  // Outer div to create a container for the progress bar with a border
  <div style={{ border: "1px solid #ccc", width: "100%", margin: "10px 0" }}>
    {/* Inner div represents the filled portion of the progress bar */}
    <div
      style={{
        width: `${progress}%`, 
        backgroundColor: "green", // Green color for the progress bar fill
        height: "20px", // Height of the progress bar
        transition: "width 0.5s", // Smooth transition for width change
      }}
    />
  </div>
);

export default ProgressBar; // Exporting the component for use in other parts of the app
