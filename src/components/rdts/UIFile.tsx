import React from "react";

const UIFile = () => {
  return (
    <div className={"personal-setting-container"}>
      <div
        style={{
          fontSize: "2rem",
          marginLeft: "1rem",
          userSelect: "none",
          alignSelf: "flex-start",
        }}
      >
        项目文件树
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <div>BreadThumb</div>
      <div>这个地方做文件选择框</div>
    </div>
  );
};

export default UIFile;
