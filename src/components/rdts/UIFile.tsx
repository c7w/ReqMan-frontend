import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const UIFile = () => {
  const codeString = `using namespace std\nint main(){\n  return 0;\n}`;

  const link = window.location.href;
  console.debug(link);

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
      <div style={{ width: "90%" }}>
        <SyntaxHighlighter
          language="cpp"
          style={a11yDark}
          showLineNumbers={true}
          wrapLongLines={true}
          lineProps={(lineNumber) => {
            const appended_list = document.getElementsByClassName("Appended");
            for (let i = appended_list.length - 1; i >= 0; --i) {
              appended_list[i].remove();
            }

            const unique_ID =
              Math.random().toString(8) + "-" + lineNumber.toString();

            setTimeout(() => {
              console.debug(unique_ID);
              const Node = document.createElement("span");
              Node.style.setProperty("flex-grow", "1");
              Node.className = `Appended`;

              const Node1 = document.createElement("span");
              Node1.innerText = "1233";
              Node1.className = "Appended";
              Node1.style.setProperty("background-color", "grey");
              Node1.style.setProperty("border-radius", "0.15rem");
              Node1.style.setProperty("padding", "0.05rem 0.15rem");
              Node1.style.setProperty("margin", "0rem 0.15rem");

              const Node2 = document.createElement("span");
              Node2.innerText = "1234";
              Node2.className = "Appended";
              Node2.style.setProperty("background-color", "grey");
              Node2.style.setProperty("border-radius", "0.15rem");
              Node2.style.setProperty("padding", "0.05rem 0.15rem");
              Node2.style.setProperty("margin", "0rem 0.15rem");

              const Node3 = document.createElement("span");
              Node3.innerText = "1235";
              Node3.className = "Appended";
              Node3.style.setProperty("background-color", "grey");
              Node3.style.setProperty("border-radius", "0.15rem");
              Node3.style.setProperty("padding", "0.05rem 0.15rem");
              Node3.style.setProperty("margin", "0rem 0.15rem");

              document.getElementById(unique_ID)?.appendChild(Node);
              document.getElementById(unique_ID)?.appendChild(Node1);
              document.getElementById(unique_ID)?.appendChild(Node2);
              document.getElementById(unique_ID)?.appendChild(Node3);
            }, 400);

            return {
              onClick: () => {
                console.debug(lineNumber);
              },
              style: {
                margin: "0.15rem",
              },
              id: unique_ID,
            };
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default UIFile;
