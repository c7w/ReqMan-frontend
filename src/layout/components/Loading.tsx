import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  return (
    <div
      style={{
        width: "80vw",
        minHeight: "80vh",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingOutlined style={{ fontSize: "3rem" }}></LoadingOutlined>
    </div>
  );
};
export default Loading;
