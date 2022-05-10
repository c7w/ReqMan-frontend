import React, { useEffect, useState } from "react";
import { SRId2SRInfo } from "../../utils/Association";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { Empty, Select } from "antd";

interface SRSearchBoxProps {
  value: number[];
  onChange: (from: number[], to: number[]) => void;
  multiple: boolean;
}

const MergeList = (old: any[], curr: any[]) => {
  const new_list = old;
  for (const item of curr) {
    const tmp_idx = old.findIndex((old_item) => old_item.id === item.id);
    if (tmp_idx === -1) {
      new_list.push(item);
    } else {
      new_list[tmp_idx] = item;
    }
  }
  return new_list;
};

const SRSearchBox = (props: SRSearchBoxProps) => {
  const dispatcher = useDispatch();

  // get project id
  const params = useParams();
  const project_id = Number(params.id);

  const [cachedSR, setCachedSR] = useState<any>([]);
  const [promptSR, setPromptSR] = useState<any>("[]");

  const [currSelected, setCurrSelected] = useState<number[]>(props.value);

  const reload_default_sr_list = async () => {
    setCachedSR(
      MergeList(
        cachedSR,
        await Promise.all(
          props.value.map((sr_id: number) => {
            return SRId2SRInfo(sr_id, "", project_id);
          })
        )
      )
    );
  };

  const request_sr_list = async (input: string) => {
    // setPromptSR([]);
    const res = await request_json(API.GET_RMS_LIST_SR, {
      body: {
        project: project_id,
        title_only: true,
        kw: input,
        limit: 5,
      },
    });
    console.debug("这里可以做防抖优化，但我懒得做了");
    console.debug(res.data);

    setPromptSR(JSON.stringify(res.data));
    setCachedSR(MergeList(cachedSR, res.data));
  };

  const onChange = (value: number[]) => {
    // console.debug(value);

    if (props.multiple) {
    } else {
      props.onChange(currSelected, value);
    }

    setCurrSelected(value);
  };

  useEffect(() => {
    // Cache default SR List
    reload_default_sr_list();
    request_sr_list("");
  }, []);

  // console.debug(promptSR);
  const options = JSON.parse(promptSR).map((sr: any) => (
    <Select.Option key={sr.id} value={sr.id}>
      [{sr.title}] {sr.description}
    </Select.Option>
  ));

  return (
    <Select
      showSearch={true}
      defaultActiveFirstOption={false}
      filterOption={false}
      style={{ width: "20rem" }}
      placeholder="功能需求"
      mode={props.multiple ? "multiple" : undefined}
      onChange={onChange}
      defaultValue={props.value}
      onSearch={(input) => {
        request_sr_list(input);
      }}
    >
      <Select.Option value={-1}>　</Select.Option>
      {options}
    </Select>
  );
};

export default SRSearchBox;
export { MergeList };
