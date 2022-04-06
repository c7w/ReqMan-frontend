import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./UIUserManage.css";
import ProList from "@ant-design/pro-list";
import { Iteration, ManageUserInfo } from "../../store/ConfigureStore";
import CryptoJS from "crypto-js";
import { Checkbox, Empty, Input, Modal, Select, Typography } from "antd";
import Loading from "../../layout/components/Loading";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { useParams } from "react-router-dom";
import { ToastMessage } from "../../utils/Navigation";
import { updateProjectInfo, updateUserInfo } from "../../store/functions/UMS";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import {
  getIRIterationStore,
  getIterationStore,
  getUserIterationStore,
} from "../../store/slices/IterationSlice";
import moment from "moment";
import {
  createUserIteration,
  deleteUserIteration,
} from "../../store/functions/RMS";

interface UserManageProps {
  readonly userInfo: string;
}

const getRoleName = (role: string) => {
  if (role === "member") {
    return "项目成员";
  }
  if (role === "sys") {
    return "系统工程师";
  }
  if (role === "dev") {
    return "开发工程师";
  }
  if (role === "qa") {
    return "质保工程师";
  }
  if (role === "supermaster") {
    return "项目管理员";
  }
  return "";
};

interface UserModelProps {
  visible: boolean;
  close: () => void;
  userInfo: string;
  editable: boolean;
}

const UserModel = (props: UserModelProps) => {
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  const iterationStore = useSelector(getIterationStore);
  const userIterStore = useSelector(getUserIterationStore);

  const [role, setRole] = useState("");
  useEffect(() => {
    if (props.userInfo !== "") setRole(JSON.parse(props.userInfo).role);
  }, [props.userInfo]);

  const switchUserRole = (new_role: string) => {
    const data = JSON.parse(props.userInfo);
    request_json(API.MODIFY_USER_ROLE, {
      body: { project: project_id, user: data.id, role: new_role },
    }).then((data) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "用户身份修改成功");
        updateProjectInfo(dispatcher, project_id);
      } else {
        ToastMessage("error", "修改失败", "用户身份修改失败");
      }
    });
  };

  if (props.userInfo !== "" && iterationStore !== "" && userIterStore !== "") {
    return (
      <Modal
        title="编辑项目成员"
        destroyOnClose={true}
        centered={true}
        visible={props.visible}
        onCancel={() => props.close()}
        width={"60%"}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <img
              src={
                JSON.parse(props.userInfo).avatar.length > 5
                  ? JSON.parse(props.userInfo).avatar
                  : `https://www.gravatar.com/avatar/${CryptoJS.MD5(
                      JSON.parse(props.userInfo).email
                    )}`
              }
              width={200}
              height={200}
              style={{ marginBottom: "1rem" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "2rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  color: "black",
                  fontSize: "40px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {JSON.parse(props.userInfo).name}
                <span
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  （{JSON.parse(props.userInfo).role}）
                </span>
              </div>
              <div
                style={{
                  color: "grey",
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {JSON.parse(props.userInfo).email}
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <p style={{ marginTop: "1rem", marginBottom: "0.4rem" }}>
            用户身份：
          </p>
          <Select
            disabled={JSON.parse(props.userInfo).role === "项目管理员"}
            defaultValue={JSON.parse(props.userInfo).role}
            style={{ width: "20rem" }}
            onChange={(value) => {
              setRole(value);
              switchUserRole(value);
            }}
          >
            <Select.Option value="sys">系统工程师</Select.Option>
            <Select.Option value="dev">开发工程师</Select.Option>
            <Select.Option value="qa">质保工程师</Select.Option>
            <Select.Option value="member">项目成员</Select.Option>
          </Select>
        </div>
        <div
          style={{
            display: role === "dev" || role === "开发工程师" ? "block" : "none",
          }}
        >
          <p style={{ marginTop: "1rem", marginBottom: "0.4rem" }}>
            关联迭代周期：
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {JSON.parse(iterationStore).data.length === 0 ? (
              <Empty />
            ) : (
              <table
                width={"50%"}
                style={{
                  margin: "0.5rem",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderWidth: "1px",
                      padding: "8px",
                      borderStyle: "solid",
                      borderColor: "#666666",
                      backgroundColor: "#dedede",
                    }}
                  >
                    <td>主管</td>
                    <td>迭代周期编号</td>
                    <td>周期名</td>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(iterationStore).data.map((iter: Iteration) => (
                    <tr
                      key={iter.id}
                      style={{
                        borderWidth: "1px",
                        padding: "8px",
                        borderStyle: "solid",
                        borderColor: "#666666",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <td>
                        <Checkbox
                          defaultChecked={
                            JSON.parse(userIterStore).data.filter(
                              (asso: {
                                user: any;
                                iteration: number | undefined;
                              }) =>
                                asso.user === JSON.parse(props.userInfo).id &&
                                asso.iteration === iter.id
                            ).length > 0
                          }
                          onChange={(evt) => {
                            if (evt.target.checked) {
                              createUserIteration(dispatcher, project_id, {
                                iterationId: iter.id as number,
                                userId: JSON.parse(props.userInfo).id as number,
                              });
                            } else {
                              deleteUserIteration(dispatcher, project_id, {
                                iterationId: iter.id as number,
                                userId: JSON.parse(props.userInfo).id as number,
                              });
                            }
                          }}
                        />
                      </td>
                      <td className={"iter-manager-column"}>{iter.sid}</td>
                      <td
                        className={"iter-manager-column"}
                        style={{ maxWidth: "15rem", overflow: "hidden" }}
                      >
                        {iter.title}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal destroyOnClose={true}>
        <Loading />
      </Modal>
    );
  }
};

const UserManage = (props: UserManageProps) => {
  const [cachedUserInfo, setCachedUserInfo] = useState("");
  const [userModalVisibility, setUserModalVisibility] = useState(false);

  // 总任务列表
  const ProjectList = JSON.parse(props.userInfo).data.users;
  const dataProjectList: ManageUserInfo[] = [];
  ProjectList.forEach((value: any, index: number) => {
    dataProjectList.push({
      id: value.id,
      name: value.name,
      email: value.email,
      role: getRoleName(value.role),
      avatar:
        value.avatar.length > 5
          ? value.avatar
          : `https://www.gravatar.com/avatar/${CryptoJS.MD5(value.email)}`,
    });
  });

  return (
    <div className={"prjuser"}>
      <UserModel
        visible={userModalVisibility}
        close={() => setUserModalVisibility(false)}
        userInfo={cachedUserInfo}
        editable={true}
      />
      <ProList<ManageUserInfo>
        pagination={{
          defaultPageSize: 24,
          showSizeChanger: false,
        }}
        grid={{ gutter: 16, column: 4 }}
        metas={{
          title: {
            render: (record: ReactNode, item: ManageUserInfo) => (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <img alt={""} className={"avatarimg"} src={item.avatar} />
              </div>
            ),
          },
          subTitle: {
            render: (record: ReactNode, item: ManageUserInfo) => {
              return (
                <div
                  style={{
                    color: "black",
                    fontSize: "30px",
                    padding: "10px",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
              );
            },
          },
          content: {
            render: (record: ReactNode, item: ManageUserInfo) => (
              <div
                style={{
                  flexDirection: "row",
                  fontSize: "16px",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.email}
                <br />
                {item.role}
                <br />
                {
                  <Typography.Link
                    onClick={() => {
                      setCachedUserInfo(JSON.stringify(item));
                      setUserModalVisibility(true);
                    }}
                  >
                    {" "}
                    编辑{" "}
                  </Typography.Link>
                }
              </div>
            ),
          },
        }}
        headerTitle="项目成员列表"
        dataSource={dataProjectList}
      />
    </div>
  );
};

export default UserManage;
