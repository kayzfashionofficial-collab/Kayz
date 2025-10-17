import React from "react";

const TopStrip = ({ data }) => {
  if (!data) return null; // nothing to render if data missing

  return (
    <div className="top-strip">
      {data.leftIcon && <span>{data.leftIcon}</span>}
      <span>{data.text}</span>
      {data.rightIcon && <span>{data.rightIcon}</span>}
    </div>
  );
};

export default TopStrip;
