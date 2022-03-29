import React, { useState } from "react";
import "./UIProjectList.css";
import ProList from "@ant-design/pro-list";
import { useDispatch } from "react-redux";
import { ManageUserInfo } from "../../store/ConfigureStore";
import { ProFormSwitch } from "@ant-design/pro-form";
import { Space, Tag } from "antd";
import moment from "moment";
import ReactMarkdown from "react-markdown";

interface UserManageProps {
  readonly userInfo: string;
}

const UserManage = (props: UserManageProps) => {
  // 总任务列表
  const ProjectList = JSON.parse(props.userInfo).data.user;
  console.log(ProjectList);
  const dispatcher = useDispatch();
  const dataProjectList: ManageUserInfo[] = [];
  // ProjectList.forEach((value: any, index: number) => {
  //   dataProjectList.push({
  //     id: value.id,
  //     name: value.name,
  //     email: value.email,
  //     avatar: value.avatar,
  //   });
  // });
  for (let i = 0; i <= 5; i++) {
    dataProjectList.push({
      id: ProjectList.id,
      name: ProjectList.name,
      email: ProjectList.email,
      avatar: ProjectList.avatar,
    });
  }
  const [tableListDataSource, settableListDataSource] =
    useState<ManageUserInfo[]>(dataProjectList);
  console.log(tableListDataSource);
  const [cardActionProps, setCardActionProps] = useState<"actions" | "extra">(
    "extra"
  );

  const [ghost, setGhost] = useState<boolean>(false);
  return (
    <div>
      {/*<ProFormRadio.Group*/}
      {/*  label="actions 放置的地方"*/}
      {/*  options={[*/}
      {/*    {*/}
      {/*      label: "设置为 action",*/}
      {/*      value: "actions",*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: "设置为 extra",*/}
      {/*      value: "extra",*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*  fieldProps={{*/}
      {/*    value: cardActionProps,*/}
      {/*    onChange: (e) => setCardActionProps(e.target.value),*/}
      {/*  }}*/}
      {/*/>*/}
      <ProFormSwitch
        label="幽灵模式"
        fieldProps={{
          checked: ghost,
          onChange: (e) => setGhost(e),
        }}
      />
      <ProList<any>
        ghost={ghost}
        itemCardProps={{
          ghost,
        }}
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: false,
        }}
        showActions="hover"
        rowSelection={{}}
        grid={{ gutter: 16, column: 2 }}
        metas={{
          title: {
            render: (record: any, item: ManageUserInfo) => (
              <a
                style={{
                  color: "black",
                  fontSize: "20px",
                }}
                onClick={() => {
                  console.log("title clicked");
                }}
              >
                {item.name}
              </a>
            ),
          },
          avatar: {
            dataIndex: "image",
          },
          subTitle: {
            render: (record: any, item: ManageUserInfo) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "5px",
                  }}
                >
                  {item.email}
                </div>
              );
            },
          },
          content: {
            render: (record: any, item: ManageUserInfo) => (
              <div style={{}}></div>
            ),
          },
          actions: {
            render: () => {
              return [<a key="init">邀请</a>];
            },
          },
        }}
        headerTitle="项目成员展示"
        dataSource={tableListDataSource}
      />
    </div>
  );
};

export default UserManage;
