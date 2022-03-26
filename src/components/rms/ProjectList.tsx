import React, { useEffect, useState } from "react";
import { Progress, Space, Tag, Button } from "antd";
import "./ProjectList.css";
import ProList from "@ant-design/pro-list";

export type TableListItem = {
  key: number;
  name: string;
  desc: string;
  invitation: string;
  status: boolean;
  createdAt: Date;
  image: string;
};

// interface ProjectListProps {
//   readonly showChoose: boolean;
//   readonly myIRKey: number;
//   readonly curProjectKey: number[];
// }

const ProjectList = () => {
  // 总任务列表
  const dataProjectList: TableListItem[] = [];
  for (let i = 0; i < 10; i += 1) {
    dataProjectList.push({
      key: i,
      name: "My Project",
      desc: "这是一个很长很长很长很长有多长呢我也不知道诶怎么办的项目任务描述",
      invitation: "XRT67D53RTGFD568",
      status: true,
      createdAt: new Date(),
      image:
        "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    });
  }
  const [tableListDataSource, settableListDataSource] =
    useState<TableListItem[]>(dataProjectList);

  // useEffect(() => {
  //   const curProjectList = [];
  //   for (let i = 0; i < props.curProjectKey.length; i += 1) {
  //     curProjectList.push(dataProjectList[props.curProjectKey[i]]);
  //   }
  //   // 如果是下拉表，则显示当前的关联任务
  //   if (!props.showChoose) {
  //     settableListDataSource(curProjectList);
  //   }
  // }, [1]);

  return (
    <div className={"prjlist"}>
      <ProList<any>
        toolBarRender={() => {
          return [
            <Button key="add" type="primary">
              新建项目
            </Button>,
          ];
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              console.log(record);
            },
          };
        }}
        rowKey="name"
        dataSource={tableListDataSource}
        showActions="always"
        showExtra="always"
        metas={{
          title: {
            dataIndex: "name",
          },
          avatar: {
            dataIndex: "image",
          },
          subTitle: {
            render: (record, item: TableListItem) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "5px",
                  }}
                >
                  <Space size={0}>
                    <Tag color="blue">邀请码：{item.invitation}</Tag>
                  </Space>
                  <Space size={0}>
                    <Tag color="green">
                      创建时间：{item.createdAt.toDateString()}
                    </Tag>
                  </Space>
                </div>
              );
            },
          },
          content: {
            render: (record, item: TableListItem) => (
              <div
                style={{
                  width: "auto",
                  marginLeft: "400px",
                }}
              >
                {item.desc}
              </div>
            ),
          },
        }}
      />
    </div>
  );
};

export default ProjectList;
