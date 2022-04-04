import React, { ReactNode, useState } from "react";
import "./UIUserManage.css";
import ProList from "@ant-design/pro-list";
import { ManageUserInfo } from "../../store/ConfigureStore";
import CryptoJS from "crypto-js";

interface UserManageProps {
  readonly userInfo: string;
}

const UserManage = (props: UserManageProps) => {
  // 总任务列表
  const ProjectList = JSON.parse(props.userInfo).data.users;
  const dataProjectList: ManageUserInfo[] = [];
  ProjectList.forEach((value: any, index: number) => {
    dataProjectList.push({
      id: value.id,
      name: value.name,
      email: value.email,
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
      <ProList<ManageUserInfo>
        pagination={{
          defaultPageSize: 8,
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
              </div>
            ),
          },
        }}
        headerTitle="项目成员展示"
        dataSource={tableListDataSource}
      />
    </div>
  );
};

export default UserManage;
