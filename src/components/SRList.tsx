import React from "react";
import type { ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import "./SRList.css";

export type TableListItem = {
  key: number;
  name: string;
  desc: string;
  creator: string;
  status: string;
  createdAt: number;
};

export interface SRListState {
  tableListDataSource: TableListItem[];
}

class SRList extends React.Component<any, SRListState> {
  constructor(props: SRListState | Readonly<SRListState>) {
    super(props);
    const creators = ["qc", "c7w", "hxj", "wxy", "lmd"];
    const my_status = ["start", "progress", "finished", "debug"];
    const dataSRList = [];
    for (let i = 0; i < 4; i += 1) {
      dataSRList.push({
        key: i,
        name: "[SR.001.000]",
        desc: "这是一个 SR 任务描述",
        creator: creators[Math.floor(Math.random() * creators.length)],
        status: my_status[i],
        createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
      });
    }
    this.state = {
      tableListDataSource: dataSRList,
    };
  }

  columns: ProColumns<TableListItem>[] = [
    {
      title: "SR标题",
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
      title: "状态",
      width: 90,
      dataIndex: "status",
      filters: true,
      onFilter: true,
      align: "center",
      valueType: "select",
      valueEnum: {
        start: {
          text: "未开始",
          status: "Default",
        },
        progress: {
          text: "进行中",
          status: "Processing",
        },
        finished: {
          text: "已完成",
          status: "Success",
        },
        debug: {
          text: "调试中",
          status: "Warning",
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      // render: (_, record) => <Tag color={record.status.color}>{record.status.text}</Tag>,
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
      width: 120,
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
      <div className={"SRTable"}>
        <EditableProTable<TableListItem>
          columns={this.columns}
          request={(params, sorter, filter) => {
            // 此处数据来源应与后端对接
            console.log(params, sorter, filter);
            return Promise.resolve({
              data: this.state.tableListDataSource,
              success: true,
            });
          }}
          rowKey="key"
          editable={{
            type: "multiple",
          }}
          recordCreatorProps={{
            record: (index: number) => ({
              key: index,
              name: "",
              title: "",
              status: "start",
              desc: "",
              creator: "",
              createdAt: Date.now(),
            }),
            position: "top",
            creatorButtonText: "新增 SR 任务",
          }}
          dateFormatter="string"
        />
      </div>
    );
  }
}

export { SRList };
