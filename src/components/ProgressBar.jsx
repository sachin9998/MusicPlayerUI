import React from "react";

const ProgressBar = ({ value, color }) => {
  const styleObject = {
    width: `${value}%`,
    backgroundColor: color || "white",
    // height: "10px",
    borderRadius: 20,
    textAlign: "center",
    transition: "all 0.3s ease",
  };

  return (
    <div className="progress">
      <div style={styleObject}>
      </div>
    </div>
  );
};

export default ProgressBar;
