import React from "react";
import { Button, Space, Tag } from "antd";
import {
  DownOutlined,
  QuestionCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import "./IRList.css";

const statusMap = {
  0: {
    color: "blue",
    text: "进行中",
  },
  1: {
    color: "green",
    text: "已完成",
  },
  2: {
    color: "volcano",
    text: "警告",
  },
  3: {
    color: "red",
    text: "失败",
  },
};

export type TableListItem = {
  key: number;
  name: string;
  desc: string;
  creator: string;
  status: {
    color: string;
    text: string;
  };
  createdAt: number;
};

const tableListDataSource: TableListItem[] = [];

const creators = ["qc", "c7w", "hxj", "wxy", "lmd"];

for (let i = 0; i < 8; i += 1) {
  tableListDataSource.push({
    key: i,
    name: "[IR.001.002]",
    desc: "我是关于这个任务很长很长很长很长很长很长长很长很长很长长很长很长很长长很长很长很长的描述",
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: {
      color: "blue",
      text: "进行中",
    },
    createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
  });
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: "IR标题",
    width: 140,
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
    width: 20,
    dataIndex: "status",
    align: "center",
    valueType: "select",
    valueEnum: {
      progress: {
        color: "blue",
        text: "进行中",
      },
      finished: {
        color: "green",
        text: "已完成",
      },
      warning: {
        color: "volcano",
        text: "警告",
      },
      failed: {
        color: "red",
        text: "失败",
      },
    },
    render: (_, record) => (
      <Tag color={record.status.color}>{record.status.text}</Tag>
    ),
  },
  {
    title: "任务描述",
    width: 280,
    dataIndex: "desc",
    align: "center",
  },

  {
    title: "创建者",
    width: 120,
    dataIndex: "creator",
    align: "center",
  },
  {
    title: "创建时间",
    width: 120,
    key: "since",
    dataIndex: "createdAt",
    valueType: "dateTime",
    align: "center",
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
  {
    title: "操作",
    width: 150,
    key: "option",
    valueType: "option",
    align: "center",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.key);
        }}
      >
        编辑
      </a>,
      <a key="2">删除</a>,
    ],
  },
];

const expandedRowRender = () => {
  const data = [];
  for (let i = 0; i < 3; i += 1) {
    data.push({
      key: i,
      date: "2014-12-24 23:12:00",
      name: "This is production name",
      upgradeNum: "Upgraded: 56",
    });
  }
  return (
    <ProTable
      columns={[
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Name", dataIndex: "name", key: "name" },

        { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
        {
          title: "Action",
          dataIndex: "operation",
          key: "operation",
          valueType: "option",
          render: () => [<a key="Pause">Pause</a>, <a key="Stop">Stop</a>],
        },
      ]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={data}
      pagination={false}
    />
  );
};

class IRList {
  render() {
    return (
      <div className={"IRTable"}>
        <ProTable<TableListItem>
          columns={columns}
          request={(params, sorter, filter) => {
            // 此处数据来源应与后端对接
            console.log(params, sorter, filter);
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          rowKey="key"
          pagination={{
            showQuickJumper: true,
          }}
          expandable={{ expandedRowRender }}
          editable={{
            type: "multiple",
          }}
          search={false}
          dateFormatter="string"
          options={false}
          toolBarRender={() => [
            <Button key="primary" type="primary">
              创建新IR
            </Button>,
            <Button key="primary" type="primary">
              刷新
            </Button>,
          ]}
        />
      </div>
    );
  }
}

export { IRList };
