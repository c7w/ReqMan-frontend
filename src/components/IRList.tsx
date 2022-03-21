import React from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { Progress } from "antd";
import "./IRList.css";
import { SRList } from "./SRList";

export type TableListItem = {
  key: number;
  name: string;
  desc: string;
  progress: number;
  creator: string;
  createdAt: number;
};

interface IRListState {
  tableListDataSource: TableListItem[];
}

const expandedRowRender = () => {
  return <SRList />;
};

class IRList extends React.Component<any, IRListState> {
  constructor(props: IRListState | Readonly<IRListState>) {
    super(props);
    const creators = ["qc", "c7w", "hxj", "wxy", "lmd"];
    const dataIRList = [];
    for (let i = 0; i < 30; i += 1) {
      dataIRList.push({
        key: i,
        // progress 数据须与后端刷新数据进行对接
        progress: 50,
        name: "[IR.001.002]",
        desc: "我是关于这个任务很长很长很长很长很长很长长很长很长很长长很长很长很长长很长很长很长的描述",
        creator: creators[Math.floor(Math.random() * creators.length)],
        createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
      });
    }
    this.state = {
      tableListDataSource: dataIRList,
    };
  }

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
      render: (_) => <a>{_}</a>,
    },
    {
      title: "任务描述",
      width: 240,
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
      title: "进度",
      width: 80,
      dataIndex: "creator",
      align: "right",
      editable: false,
      render: (_, record) => <Progress percent={record.progress} />,
    },
    {
      title: "创建者",
      width: 80,
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
      width: 110,
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
              data: this.state.tableListDataSource,
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
              desc: "",
              progress: 0,
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
