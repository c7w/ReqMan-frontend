import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import moment from "moment";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React from "react";
import { UIUserCardPreview } from "../ums/UIUserCard";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useSelector } from "react-redux";

interface UIFileRendererProps {
  currCodeType: string;
  currCode: string;
}

const UIFileRenderer = (props: UIFileRendererProps) => {
  const currCode = JSON.parse(props.currCode);

  const projectStore = useSelector(getProjectStore);

  const RENDER = [];
  let start_line_num = 1;

  console.debug(currCode);
  for (const entry of currCode.relationship) {
    const commit_list = Object.values(currCode.Commits).filter(
      (commit: any) => commit.id === entry.local_commit
    );
    const commit: any = commit_list[0];

    const sr_list = Object.values(currCode.SR).filter(
      (sr: any) => sr.id === entry.SR
    );
    const sr: any = sr_list[0];

    RENDER.push([
      <div
        style={{
          // width: "100%",
          // height: "92%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          // whiteSpace: "nowrap",
          borderRadius: "0.2rem",
          padding: "1rem",
          marginTop: "0.4rem",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {commit !== undefined ? (
          <>
            <div>
              <UIUserCardPreview
                projectStore={projectStore}
                userId={commit.user_committer}
                previewSize={48}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "1rem",
                wordWrap: "break-word",
              }}
            >
              <div
                style={{ fontWeight: "600", fontSize: "0.9rem" }}
                title={"[" + commit.hash_id.slice(0, 6) + "]" + commit.title}
              >
                {commit.title}
              </div>
              <div>
                <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                  [提交时间]
                </span>
                &nbsp;&nbsp;
                {moment(commit.createdAt * 1000).format("YYYY-MM-DD HH:mm")}
              </div>
              {sr !== undefined ? (
                <div title={`[${sr.title}] ${sr.description}`}>
                  <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                    [关联功能需求]
                  </span>
                  &nbsp;&nbsp; {sr.title}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          "No commit"
        )}

        {/*{JSON.stringify(commit)}*/}
      </div>,

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <SyntaxHighlighter
          language={props.currCodeType}
          style={a11yDark}
          startingLineNumber={start_line_num}
          showLineNumbers={true}
          // wrapLongLines={true}
          wrapLines={true}
          customStyle={{
            height: "100%",
            margin: "0",
            borderRadius: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          {entry.lines.join("\n") ? entry.lines.join("\n") : " "}
        </SyntaxHighlighter>
      </div>,
    ]);

    start_line_num += entry.lines.length;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {RENDER.length === 0 ? (
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          (空文件)
        </div>
      ) : (
        RENDER.map((entry: any) => {
          return (
            <div className={"render-row"}>
              <div className={"render-row-c1"}>{entry[0]}</div>
              <div className={"render-row-c2"}>{entry[1]}</div>
            </div>
          );
        })
      )}
    </div>
  );

  // return (
  //   <SyntaxHighlighter
  //     language={props.currCodeType}
  //     style={a11yDark}
  //     showLineNumbers={true}
  //     wrapLongLines={true}
  //     lineProps={(lineNumber) => {
  //       const appended_list = document.getElementsByClassName("Appended");
  //       for (let i = appended_list.length - 1; i >= 0; --i) {
  //         appended_list[i].remove();
  //       }
  //       const appended2_list = document.getElementsByClassName("Appended2");
  //       for (let i = appended2_list.length - 1; i >= 0; --i) {
  //         appended2_list[i].remove();
  //       }
  //
  //       const unique_ID =
  //         Math.random().toString(8) + "-" + lineNumber.toString();
  //
  //       const GenerateNewNode = (
  //         unique_ID: string,
  //         NodeText: string,
  //         index = 0
  //       ) => {
  //         if (NodeText !== "") {
  //           const Node2 = document.createElement("span");
  //           Node2.innerText = NodeText;
  //           Node2.className = "Appended";
  //           // Node2.style.setProperty(
  //           //   "right",
  //           //   `${index * 10}rem`
  //           // );
  //           document.getElementById(unique_ID)?.appendChild(Node2);
  //           return 1;
  //         }
  //         return 0;
  //       };
  //
  //       setTimeout(() => {
  //         console.debug(unique_ID);
  //         const Node = document.createElement("span");
  //         Node.style.setProperty("flex-grow", "1");
  //         Node.className = `Appended2`;
  //         document.getElementById(unique_ID)?.appendChild(Node);
  //
  //         const tmp_idx = [0];
  //
  //         const line_lens = JSON.parse(currCode)
  //           .relationship.map((relation: any) => {
  //             return relation.lines.length;
  //           })
  //           .forEach((lines: number) => {
  //             tmp_idx.push(tmp_idx[tmp_idx.length - 1] + lines);
  //           });
  //
  //         // Decide lineNumber in which relation
  //         // Find i - 1 which tmp_idx[i-1] < lineNumber <= tmp_idx[i]
  //         let relation_index = 0;
  //         for (let i = 1; i < tmp_idx.length; ++i) {
  //           if (tmp_idx[i - 1] < lineNumber && lineNumber <= tmp_idx[i]) {
  //             relation_index = i - 1;
  //             break;
  //           }
  //         }
  //
  //         const my_relation = JSON.parse(currCode).relationship[relation_index];
  //         console.debug(my_relation);
  //
  //         let user = "";
  //         let lastUpdate = "";
  //         let hash_id = "";
  //         let sr = "";
  //
  //         const filtered: any = Object.entries(
  //           JSON.parse(currCode).Commits
  //         ).filter(([hash, commit]: any) => {
  //           console.debug(commit);
  //           return commit.id === my_relation.local_commit;
  //         });
  //
  //         if (filtered.length > 0) {
  //           user = filtered[0][1].commiter_name;
  //           lastUpdate = moment(filtered[0][1].createdAt * 1000).calendar();
  //           hash_id = filtered[0][1].hash_id.slice(0, 7);
  //         }
  //
  //         const SR_list = JSON.parse(currCode).SR;
  //         if (my_relation.SR !== null) {
  //           const tmp_SR = SR_list[my_relation.SR];
  //           if (tmp_SR !== undefined) {
  //             sr = tmp_SR.title;
  //           }
  //         }
  //
  //         let idx = 0;
  //         idx += GenerateNewNode(unique_ID, sr, idx);
  //         idx += GenerateNewNode(unique_ID, user, idx);
  //         idx += GenerateNewNode(unique_ID, lastUpdate, idx);
  //         idx += GenerateNewNode(unique_ID, hash_id, idx);
  //       }, 400);
  //
  //       return {
  //         onClick: () => {
  //           console.debug(lineNumber);
  //         },
  //         style: {
  //           margin: "0.15rem",
  //         },
  //         id: unique_ID,
  //       };
  //     }}
  //   >
  //     {code_to_render}
  //   </SyntaxHighlighter>
};
export default UIFileRenderer;
