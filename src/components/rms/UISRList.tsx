import React, { useEffect, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable, { EditableProTable } from "@ant-design/pro-table";
import { Space, Table } from "antd";
import "./UISRList.css";
import { useDispatch } from "react-redux";
import { SRCard } from "../../store/ConfigureStore";

interface UISRListProps {
  readonly showChoose: boolean;
  readonly myIRKey: number;
  readonly curSRKey: number[];
  readonly project_id: number;
  readonly SRListStr: string;
  readonly userInfo: string;
}

/*
SRListStr:  {"code":0,"data":[{"id":1,"project":2,"title":"sr","description":"sr","priority":1000,"rank":1000,"state":"TODO","createdBy":17,"createdAt":1648475583.008951,"disabled":false}]}
 */

const UISRList = (props: UISRListProps) => {
  console.log(props.SRListStr);
  console.log(props.userInfo);
  const SRListData = JSON.parse(props.SRListStr).data;
  const userData = JSON.parse(props.userInfo);
  const dispatcher = useDispatch();
  // 总任务列表
  const dataSRList: SRCard[] = [];
  SRListData.forEach((value: any, index: number) => {
    dataSRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      priority: value.priority,
      rank: value.rank,
      currState: value.currState,
      createdBy: value.createdBy,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
    });
  });
  const [tableListDataSource, settableListDataSource] =
    useState<SRCard[]>(dataSRList);

  useEffect(() => {
    const curSRList = [];
    for (let i = 0; i < props.curSRKey.length; i += 1) {
      curSRList.push(dataSRList[props.curSRKey[i]]);
    }
    // 如果是下拉表，则显示当前的关联任务
    if (!props.showChoose) {
      settableListDataSource(curSRList);
    }
  }, [1]);

  const columns: ProColumns<SRCard>[] = [
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
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  const chooseColumn: ProColumns<SRCard>[] = [];
  for (let i = 0; i < 5; i += 1) {
    columns[i].filters = false;
    chooseColumn.push(columns[i]);
  }

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ProColumns<SRCard>[]
    ) => {
      const selectedSR = [];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        selectedSR.push(selectedRows[i].key);
      }
      for (let i = 0; i < props.curSRKey.length; i++) {
        selectedSR.push(props.curSRKey[i]);
      }
    },
    getCheckboxProps: (record: ProColumns<SRCard>) => {
      console.log("=================");
      for (let i = 0; i < props.curSRKey.length; i++) {
        if (props.curSRKey[i] === record.key) {
          return { disabled: true };
        }
      }
      return { disabled: false };
    },
  };

  if (!props.showChoose) {
    return (
      <div className={"SRTable"}>
        <EditableProTable<SRCard>
          columns={columns}
          request={() => {
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          pagination={{
            pageSize: 5,
          }}
          rowKey="key"
          editable={{
            type: "multiple",
          }}
          recordCreatorProps={{
            record: (index: number) => ({
              id: index,
              project: props.project_id,
              title: "",
              description: "",
              priority: 1,
              rank: 1,
              currState: "TODO",
              createdBy: userData.name,
              createdAt: Date.now(),
              disabled: false,
            }),
            position: "top",
            creatorButtonText: "新增 SR 任务",
          }}
          dateFormatter="string"
        />
      </div>
    );
  } else {
    return (
      <div className={"SRTable"}>
        <ProTable<SRCard>
          columns={chooseColumn}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            defaultSelectedRowKeys: [],
            ...rowSelection,
          }}
          tableAlertRender={({
            selectedRowKeys,
            selectedRows,
            onCleanSelected,
          }) => (
            <Space size={24}>
              <span>已选 {selectedRowKeys.length} 项</span>
              <span>{`关联 SR 任务: ${selectedRows.reduce(
                (pre, item) => pre + " " + item.title,
                ""
              )} `}</span>
            </Space>
          )}
          request={() => {
            return Promise.resolve({
              data: tableListDataSource,
              success: true,
            });
          }}
          pagination={{
            pageSize: 5,
          }}
          rowKey="key"
          search={false}
          dateFormatter="string"
          toolBarRender={false}
        />
      </div>
    );
  }
};

export default UISRList;
