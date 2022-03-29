import React, { useState } from "react";
import "./UIProjectList.css";
import ProList from "@ant-design/pro-list";
import { useDispatch } from "react-redux";
import { ManageUserInfo } from "../../store/ConfigureStore";
import { ProFormSwitch } from "@ant-design/pro-form";

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
    <div
      style={{
        backgroundColor: "#eee",
      }}
    >
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
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: {
            cardActionProps,
          },
        }}
        headerTitle="项目成员展示"
        dataSource={tableListDataSource}
      />
    </div>
  );
};

export default UserManage;
