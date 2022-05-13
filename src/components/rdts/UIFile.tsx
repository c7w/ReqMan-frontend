import React, { useEffect } from "react";
import "./UIFile.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDispatch, useSelector } from "react-redux";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { Breadcrumb, Empty, Typography } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder, faHome } from "@fortawesome/free-solid-svg-icons";
import { Redirect, ToastMessage } from "../../utils/Navigation";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useLocation, useParams } from "react-router-dom";
import { repoId2RepoInfo } from "../../utils/Association";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import Loading from "../../layout/components/Loading";
import moment from "moment";
import UIFileRenderer from "./UIFileRenderer";

const UIFileNotFound = () => {
  const dispatcher = useDispatch();
  // Get project ID
  const params = useParams<"id">();
  const project_id = Number(params.id);
  if (project_id === undefined) {
    Redirect(dispatcher, "/error", 0);
  }

  const pathname = window.location.pathname
    .split("/")
    .filter((str: string) => str !== "");

  const projectStore = useSelector(getProjectStore);

  return (
    <div className={"personal-setting-container"}>
      <div style={{ fontSize: "2rem" }}>项目文件树</div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <Breadcrumb
        style={{
          width: "98%",
          margin: "1rem auto",
          textAlign: "left",
        }}
      >
        <Breadcrumb.Item>
          <a
            onClick={() => {
              Redirect(dispatcher, `/project/${pathname[1]}/tree/`, 0);
            }}
          >
            <FontAwesomeIcon icon={faHome} />
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Typography.Link
            onClick={() => {
              Redirect(dispatcher, `/project/${pathname[1]}/tree/`, 0);
            }}
          >
            {JSON.parse(projectStore).data.project.title}
          </Typography.Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ fontSize: "1.5rem" }}>
        <span style={{ fontWeight: "bold" }}>
          抱歉，您所查看的项目文件不存在！
        </span>
      </div>
    </div>
  );
};

const UIFile = () => {
  const dispatcher = useDispatch();
  const repoStore = useSelector(getRepoStore);
  const projectStore = useSelector(getProjectStore);

  const params = useParams<"id">();
  const project_id = Number(params.id);

  // Get Query String
  const { search } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(search), [search]);

  const isFile = query.get("isFile") === "1" ? true : false;

  // console.debug(params);

  const [savedBranches, setSavedBranches] = React.useState("{}");
  const [savedFiles, setSavedFiles] = React.useState("{}");
  const [savedCodes, setSavedCodes] = React.useState("{}");
  const [currCode, setCurrCode] = React.useState("");
  const [currCodeType, setCurrCodeType] = React.useState("javascript");

  const [isLoading, setIsLoading] = React.useState(false);

  // From `http://localhost:3000/project/2/tree/123` get ['tree', '123']
  // Wanted data format: ['tree', repo_id, branch_name, file_path]
  const pathname = window.location.pathname
    .split("/")
    .filter((str: string) => str !== "")
    .slice(2);

  useEffect(() => {
    const file_path = pathname.join("/");

    if (isFile) {
      // Try get file from savedCodes
      if (JSON.parse(savedCodes)[file_path] === undefined) {
        setCurrCode("");
        setIsLoading(true);
        // Query for file content
        // console.debug(pathname.slice(3).join("/"));
        request_json(API.GET_FORWARD_CODE_SR, {
          getParams: {
            project: project_id,
            repo: Number(pathname[1]),
            ref: pathname[2],
            path: pathname.slice(3).join("/"),
          },
        }).then((res: any) => {
          if (res.code === 0) {
            const curr_codes = JSON.parse(savedCodes);
            curr_codes[file_path] = res.data;
            setSavedCodes(JSON.stringify(curr_codes));
          } else {
            ToastMessage("error", "请求失败", "请求地址不存在！");
            Redirect(dispatcher, `/project/${project_id}/tree/`, 0);
          }
        });
      } else {
        // Show file
        setIsLoading(false);
        setCurrCode(JSON.stringify(JSON.parse(savedCodes)[file_path]));
        setCurrCodeType(file_path.split(".").pop() || "txt");
      }
    }
  }, [savedCodes, pathname]);

  // Read isFile from params

  const files: any[] = [];
  const breadcrumb_list: any[] = [];

  // Pre-defined functions
  const isRepoIDValid = (repo_id: number) => {
    return (
      JSON.parse(repoStore).data.filter((obj: any) => obj.id === repo_id)
        .length > 0
    );
  };

  // Parse pathname
  if (pathname.length === 1) {
    // Prepare for breadcrumb
    breadcrumb_list.push({
      name: JSON.parse(projectStore).data.project.title,
      link: `/project/${project_id}/tree/`,
    });

    // Prepare for showing directory
    JSON.parse(repoStore).data.forEach((repo: any) => {
      files.push({
        name: repo.title,
        type: "directory",
        link: ["tree", repo.id],
      });
    });
  } else if (pathname.length === 2) {
    // Test if repo_id is valid
    if (!isRepoIDValid(Number(pathname[1]))) {
      // Error: Repo not found
      return (
        <div>
          <UIFileNotFound />
        </div>
      );
    }

    // Prepare for breadcrumb
    breadcrumb_list.push({
      name: JSON.parse(projectStore).data.project.title,
      link: `/project/${project_id}/tree/`,
    });
    breadcrumb_list.push({
      name: repoId2RepoInfo(Number(pathname[1]), repoStore).title, // Get repo name
      link: `/project/${project_id}/tree/${pathname[1]}`,
    });

    // If savedBranches is empty, wait for branches to be loaded
    if (JSON.parse(savedBranches)[Number(pathname[1])] === undefined) {
      // Get Branchs
      const branches = request_json(API.GET_PROJECT_REPO_BRANCH, {
        getParams: {
          project: project_id,
          repo: Number(pathname[1]),
        },
      }).then((res: any) => {
        if (res.data.http_status === 200) {
          const curr_branch = JSON.parse(savedBranches);
          curr_branch[Number(pathname[1])] = res.data.body.map(
            (branch: any) => branch.name
          );
          setSavedBranches(JSON.stringify(curr_branch));
        } else {
          ToastMessage(
            "error",
            "请求失败",
            "项目仓库令牌不可用，请联系项目管理员！"
          );
          Redirect(dispatcher, `/project/${project_id}/tree/`, 0);
        }
      });

      return (
        <div className={"personal-setting-container"}>
          <Loading />
        </div>
      );
    } else {
      // Prepare for directory
      files.push({ name: "..", type: "directory", link: ["tree"] });
      JSON.parse(savedBranches)[Number(pathname[1])].forEach((branch: any) => {
        files.push({
          name: branch,
          type: "directory",
          link: ["tree", pathname[1], branch],
        });
      });
    }
  } else if (pathname.length >= 3) {
    if (pathname.length === 3) {
      pathname.push("/");
    }
    // Join pathname and get file_path
    const file_path = pathname.join("/");

    if (JSON.parse(savedFiles)[file_path] === undefined) {
      // Query for file list
      request_json(API.GET_FORWARD_TREE, {
        getParams: {
          project: project_id,
          repo: Number(pathname[1]),
          ref: pathname[2],
          path: pathname.slice(3).join("/"),
        },
      }).then((res: any) => {
        if (res.data.http_status === 200) {
          const curr_files = JSON.parse(savedFiles);
          curr_files[file_path] = res.data.body;
          setSavedFiles(JSON.stringify(curr_files));
        } else {
          ToastMessage("error", "请求失败", "请求地址不存在！");
          Redirect(dispatcher, `/project/${project_id}/tree/`, 0);
        }
      });

      return (
        <div className={"personal-setting-container"}>
          <Loading />
        </div>
      );
    } else {
      // Prepare for breadcrumb
      breadcrumb_list.push({
        name: JSON.parse(projectStore).data.project.title,
        link: `/project/${project_id}/tree/`,
      });
      breadcrumb_list.push({
        name: repoId2RepoInfo(Number(pathname[1]), repoStore).title, // Get repo name
        link: `/project/${project_id}/tree/${pathname[1]}`,
      });
      for (let i = 2; i < pathname.length; i++) {
        if (pathname[i] === "/") {
          continue;
        }
        let additional = "";
        if (i === pathname.length - 1 && isFile) {
          additional = "?isFile=1";
        }
        breadcrumb_list.push({
          name: pathname[i],
          link:
            "/project/" +
            project_id +
            "/" +
            pathname.slice(0, i + 1).join("/") +
            additional,
        });
      }

      // Prepare for showing directory
      if (pathname[3] === "/") {
        files.push({
          name: "..",
          type: "directory",
          link: pathname.slice(0, pathname.length - 2),
        });
      } else {
        files.push({
          name: "..",
          type: "directory",
          link: pathname.slice(0, pathname.length - 1),
        });
      }

      JSON.parse(savedFiles)[file_path].forEach((file: any) => {
        files.push({
          name: file.name,
          type: file.type === "tree" ? "directory" : "file",
          link: ["tree", pathname[1], pathname[2], file.path],
        });
      });
    }
  }

  // console.debug(savedCodes);
  // console.debug(currCode);

  let code_to_render = "";

  if (currCode !== "") {
    JSON.parse(currCode).relationship.forEach(
      (relation: any, index: number) => {
        code_to_render += relation.lines.join("\n");
        if (index !== JSON.parse(currCode).relationship.length - 1) {
          code_to_render += "\n";
        }
      }
    );
  }

  // console.debug(files.length);

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
      <Breadcrumb
        style={{
          width: "90%",
          margin: "1rem auto",
          textAlign: "left",
        }}
      >
        <Breadcrumb.Item>
          <a
            onClick={() => {
              Redirect(dispatcher, `/project/${project_id}/tree/`, 0);
            }}
          >
            <FontAwesomeIcon icon={faHome} />
          </a>
        </Breadcrumb.Item>
        {breadcrumb_list.map((item: { link: string; name: string }, index) => {
          return (
            <Breadcrumb.Item key={index.toString() + item.name}>
              <Typography.Link
                onClick={() => {
                  Redirect(dispatcher, item.link, 0);
                }}
              >
                {item.name}
              </Typography.Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      {pathname.length === 1 && files.length === 0 ? (
        <Empty description="请添加项目仓库" />
      ) : (
        <div
          style={{
            width: "90%",
            borderRadius: "1rem",
            border: "1px solid #dbdbdb",
            marginTop: "1rem",
            marginBottom: "2rem",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              color: "#303030",
              margin: "0 auto 0",
              padding: "1rem",
            }}
          >
            <thead>
              <tr>
                <td
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#000",
                    fontWeight: "700",
                    lineHeight: "28px",
                    fontSize: "1.2rem",
                    padding: "0.5rem",
                    paddingLeft: "2rem",
                  }}
                >
                  名称
                </td>
              </tr>
            </thead>
            <tbody>
              {files.map((file: any, index: any) => {
                return (
                  <tr
                    className={"tree-item"}
                    key={index}
                    onClick={() => {
                      Redirect(
                        dispatcher,
                        `/project/${project_id}/` +
                          file.link.join("/") +
                          "?isFile=" +
                          (file.type !== "directory" ? "1" : "0"),
                        0
                      );
                    }}
                    style={{
                      lineHeight: "32px",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                  >
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={file.type === "directory" ? faFolder : faFile}
                        style={{
                          color: "#000",
                          padding: "0.2rem",
                          marginLeft: "2rem",
                        }}
                      />
                      <Typography.Link
                        style={{
                          color: "#000",
                          padding: "0.2rem",
                          marginLeft: "2rem",
                        }}
                      >
                        {file.name}
                      </Typography.Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isFile ? (
        isLoading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            {((currCodeType: string, currCode: string) => {
              switch (currCodeType) {
                case "jpg":
                case "png":
                case "gif":
                case "jpeg":
                case "bmp":
                case "svg":
                case "webp":
                case "ico":
                case "tiff":
                case "tif":
                  return (
                    <div
                      style={{
                        width: "100%",
                        height: "40vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      无法预览该文件
                    </div>
                  );
                default:
                  return (
                    <UIFileRenderer
                      currCodeType={currCodeType}
                      currCode={currCode}
                    />
                  );
              }
            })(currCodeType, currCode)}
          </div>
        )
      ) : null}
    </div>
  );
};

export default UIFile;
