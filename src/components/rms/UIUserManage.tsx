import React, { ReactNode, useState } from "react";
import "./UIUserManage.css";
import ProList from "@ant-design/pro-list";
import { ManageUserInfo } from "../../store/ConfigureStore";
import CryptoJS from "crypto-js";
import { Modal, Typography } from "antd";

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
}

const UserModel = (props: UserModelProps) => {
  return (
    <Modal
      title="编辑项目成员"
      destroyOnClose={true}
      centered={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"60%"}
    >
      {props.userInfo}
    </Modal>
  );
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
  // for (let i = 0; i <= 30; i++) {
  //   dataProjectList.push({
  //     id: ProjectList.id,
  //     name: ProjectList.name,
  //     email: ProjectList.email,
  //     avatar: ProjectList.avatar,
  //   });
  // }
  const [tableListDataSource] = useState<ManageUserInfo[]>(dataProjectList);

  return (
    <div className={"prjuser"}>
      <UserModel
        visible={userModalVisibility}
        close={() => setUserModalVisibility(false)}
        userInfo={cachedUserInfo}
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
                  }}
                  onClick={() => {
                    console.log("title clicked");
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
        dataSource={tableListDataSource}
      />
    </div>
  );
};

export default UserManage;
