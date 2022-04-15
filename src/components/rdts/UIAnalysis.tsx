import "./UIMerge.css";
import React, { useEffect, useState } from "react";
import ActiveFigure from "../Figure/ActiveFigure";
import IssueFigure from "../Figure/IssueFigure";
import TimeFigure from "../Figure/TimeFigure";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import Loading from "../../layout/components/Loading";

const UIAnalysis = () => {
  const [recentSeven, setRecentSeven] = useState("");
  const [overall, setOverall] = useState("");

  const projectStore = useSelector(getProjectStore);

  const [reload, setReload] = useState(0);

  const dispatcher = useDispatch();
  const params = useParams();
  const project_id = Number(params.id);

  useEffect(() => {
    request_json(API.GET_RECENT_ACTIVITY, {
      body: {
        project: project_id,
        digest: true,
        dev_id: JSON.parse(projectStore).data.users.map((user: any) => user.id), // Maybe filter...?
        limit: 3600 * 24 * 7,
      },
    }).then((res: any) => {
      res.data = res.data.map((activity: any) => {
        return {
          ...activity,
          lines: activity.additions + activity.deletions,
          issue_times: activity.issue_times.map((time: number) =>
            Math.round(time / 3600.0)
          ),
        };
      });
      setRecentSeven(JSON.stringify(res));
    });
    request_json(API.GET_RECENT_ACTIVITY, {
      body: {
        project: project_id,
        digest: true,
        dev_id: JSON.parse(projectStore).data.users.map((user: any) => user.id), // Maybe filter...?
        limit: -1,
      },
    }).then((res: any) => {
      res.data = res.data.map((activity: any) => {
        return {
          ...activity,
          lines: activity.additions + activity.deletions,
          issue_times: activity.issue_times.map((time: number) =>
            Math.round(time / 3600.0)
          ),
        };
      });
      setOverall(JSON.stringify(res));
    });
  }, [reload]);

  if (recentSeven === "" || overall === "") {
    return <Loading />;
  }

  const active_list_7 = [];
  const issue_list_7 = [];
  for (let i = 0; i < JSON.parse(recentSeven).data.length; ++i) {
    active_list_7.push({
      user: JSON.parse(projectStore).data.users[i],
      mr: JSON.parse(recentSeven).data[i].mr_count,
      line: JSON.parse(recentSeven).data[i].lines,
    });
    issue_list_7.push({
      user: JSON.parse(projectStore).data.users[i],
      time: JSON.parse(recentSeven).data[i].issue_times,
    });
  }

  const active_list_all = [];
  const issue_list_all = [];
  for (let i = 0; i < JSON.parse(recentSeven).data.length; ++i) {
    active_list_all.push({
      user: JSON.parse(projectStore).data.users[i],
      mr: JSON.parse(overall).data[i].mr_count,
      line: JSON.parse(overall).data[i].lines,
    });
    issue_list_all.push({
      user: JSON.parse(projectStore).data.users[i],
      time: JSON.parse(overall).data[i].issue_times,
    });
  }

  // 你需要：
  // 查 Issue-SR 对照表，找出某个 Issue 对应哪个 SR
  // 查 SR-Iter 对照表，找出这个 Iter 有多少 SR
  const issue_test =
    '{"iterations":["iter1","iter2","iter3","iter4"],"all_sr_count":[12,14,16,18],"issues":[1,2,4,2]}';

  return (
    <div className={"merge-card"}>
      <IssueFigure text={issue_test} title={"交付后缺陷分析"} />

      <ActiveFigure
        text={JSON.stringify(active_list_7)}
        title={"开发工程师活跃度分析（周）"}
      />

      <ActiveFigure
        text={JSON.stringify(active_list_all)}
        title={"开发工程师活跃度分析（总）"}
      />

      <TimeFigure
        text={JSON.stringify(issue_list_7)}
        title={"开发工程师基于 Issue 解决时间的能力评定（周）"}
      />

      <TimeFigure
        text={JSON.stringify(issue_list_all)}
        title={"开发工程师基于 Issue 解决时间的能力评定（总）"}
      />
    </div>
  );
};

export default UIAnalysis;
