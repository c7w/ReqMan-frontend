import React from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import "./IRList.css";
import { SRList } from "./SRList";

export interface IRListProps {
  readonly unimportant: string;
}

export interface IRListState {
  readonly unimportant: string;
}

export type TableListItem = {
  key: number;
  name: string;
  title: string;
  desc: string;
  creator: string;
  createdAt: number;
};

const tableListDataSource: TableListItem[] = [];

const creators = ["qc", "c7w", "hxj", "wxy", "lmd"];

for (let i = 0; i < 30; i += 1) {
  tableListDataSource.push({
    key: i,
    name: "[IR.001.002]",
    title: "不重要的名字",
    desc: "我是关于这个任务很长很长很长很长很长很长长很长很长很长长很长很长很长长很长很长很长的描述",
    creator: creators[Math.floor(Math.random() * creators.length)],
    createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
  });
}

const expandedRowRender = () => {
  return <SRList unimportant={"unimportant"} />;
};

class IRList extends React.Component<IRListProps, IRListState> {
  columns: ProColumns<TableListItem>[] = [
    {
      title: "IR标题",
      width: 100,
      dataIndex: "name",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      // 后续对接展示 IR 卡片
      render: (_) => <a>{_}</a>,
    },
    {
      title: "任务描述",
      width: 280,
      dataIndex: "desc",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },

    {
      title: "创建者",
      width: 100,
      dataIndex: "creator",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "创建时间",
      width: 120,
      dataIndex: "createdAt",
      valueType: "dateTime",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "操作",
      width: 100,
      valueType: "option",
      align: "center",
      render: (text, record, _, action) => [
        // 编辑内含修改删除等，须继续与后端接口适配
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.key);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  render() {
    return (
      <div className={"IRTable"}>
        <EditableProTable<TableListItem>
          columns={this.columns}
          request={(params, sorter, filter) => {
            // 此处数据来源应与后端对接，须进一步对接
            console.log(params, sorter, filter);
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          rowKey="key"
          expandable={{ expandedRowRender }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          editable={{
            type: "multiple",
          }}
          recordCreatorProps={{
            record: (index: number) => ({
              key: index,
              name: "",
              title: "",
              desc: "",
              creator: "",
              createdAt: Date.now(),
            }),
            position: "top",
            creatorButtonText: "新增 IR 任务",
          }}
          dateFormatter="string"
        />
      </div>
    );
  }
}

export { IRList };
