import React from "react";

const ProgressBar = ({ value }) => {
  const styleObject = {
    width: `${value}%`,
    backgroundColor: "white",
    // height: "10px",
    borderRadius: 20,
    textAlign: "center",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div className="progress">
      <div style={styleObject}></div>
    </div>
  );
};

export default ProgressBar;
