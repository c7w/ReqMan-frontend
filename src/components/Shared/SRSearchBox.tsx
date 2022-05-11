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
  getSelectedSR?: (SRList: any[]) => void;
}

const MergeList = (old: any[], curr: any[]) => {
  const new_list = old.slice(0, old.length);
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

  const getSelectedSR = (value: number[]) => {
    return value
      .map((id) =>
        MergeList(cachedSR, promptSR).find((sr: any) => sr.id === id)
      )
      .filter((sr: any) => sr !== undefined);
  };

  const reload_default_sr_list = async () => {
    // console.debug("Reloading default SR List!");
    // console.debug(props.value);
    const res = await Promise.all(
      props.value.map((sr_id: number) => {
        return SRId2SRInfo(sr_id, "", project_id);
      })
    );

    setCachedSR(MergeList(cachedSR, res));

    if (props.getSelectedSR) {
      props.getSelectedSR(res);
    }

    setPromptSR(JSON.stringify(res));
    return res;
  };

  const request_sr_list = async (input: string, last_res?: any[]) => {
    // setPromptSR([]);
    const res = await request_json(API.GET_RMS_LIST_SR, {
      body: {
        project: project_id,
        title_only: true,
        kw: input,
        limit: 5,
      },
    });
    // console.debug("这里可以做防抖优化，但我懒得做了");

    if (last_res !== undefined) {
      setPromptSR(JSON.stringify(MergeList(last_res, res.data)));
      // console.debug("last_res", last_res);
      // console.debug("res", res.data);
      // console.debug("merged", MergeList(last_res, res.data));

      return MergeList(last_res, res.data);
    } else {
      setPromptSR(JSON.stringify(res.data));
      return MergeList(cachedSR, res.data);
    }
  };

  const onChange = async (value: number[]) => {
    // // console.debug(value);

    if (props.multiple) {
      const res = getSelectedSR(value);

      props.onChange(currSelected, value);
      if (props.getSelectedSR) {
        // console.debug("cachedSR", cachedSR);
        props.getSelectedSR(res);
      }
    } else {
      props.onChange(currSelected, value);
    }
    setCurrSelected(value);
  };

  useEffect(() => {
    // Cache default SR List
    reload_default_sr_list().then((res) => {
      request_sr_list("", res).then((res) => {
        setCachedSR(res);
      });
    });
  }, []);

  // // console.debug(promptSR);
  const options = JSON.parse(promptSR).map((_sr: any) => {
    let sr = cachedSR.find((_cached_sr: any) => _cached_sr.id === _sr.id);
    if (sr === undefined) {
      sr = _sr;
    }
    return (
      <Select.Option key={sr.id} value={sr.id}>
        [{sr.title}] {sr.description}
      </Select.Option>
    );
  });

  return (
    <Select
      showSearch={true}
      defaultActiveFirstOption={false}
      filterOption={false}
      style={{ width: "40rem" }}
      placeholder="功能需求"
      mode={props.multiple ? "multiple" : undefined}
      onChange={onChange}
      defaultValue={props.value}
      onSearch={(input) => {
        request_sr_list(input).then((res) => {
          setCachedSR(res);
        });
      }}
    >
      {props.multiple ? null : <Select.Option value={-1}>　</Select.Option>}

      {options}
    </Select>
  );
};

export default SRSearchBox;
export { MergeList };
