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
import { getRepoStore } from "../../store/slices/RepoSlice";
import {
  getCommitStore,
  getIssueSRAssociationStore,
  getIssueStore,
  getMergeStore,
} from "../../store/slices/IssueSlice";
import {
  getIterationStore,
  getSRIterationStore,
} from "../../store/slices/IterationSlice";
import { getRDTSInfo } from "../../store/functions/RDTS";
import { Iteration2SR, SR2Issue } from "../../utils/Association";
import { getSRListStore } from "../../store/slices/IRSRSlice";
import MRTimeFigure from "../Figure/MRTimeFigure";
import CountDistribution from "../Figure/CountDistribution";
import CountDistributionFigure from "../Figure/CountDistribution";
import CommitFigure from "../Figure/CommitFigure";
import LinesChanged from "../Figure/LinesChanged";
import MemberCommit from "../Figure/MemberCommit";
import MemberLines from "../Figure/MemberLines";
import { Tabs } from "antd";

const UIAnalysis = () => {
  const [recentSeven, setRecentSeven] = useState("");
  const [overall, setOverall] = useState("");
  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);
  const iterationStore = useSelector(getIterationStore);
  const SRIterationStore = useSelector(getSRIterationStore);
  const issueSRStore = useSelector(getIssueSRAssociationStore);
  const issueStore = useSelector(getIssueStore);
  const SRListStore = useSelector(getSRListStore);
  const mergeStore = useSelector(getMergeStore);
  const commitStore = useSelector(getCommitStore);

  const [iter_issue_sr_list, set_iter_issue_sr_list] = useState({
    iterations: Array<string>(),
    all_sr_count: Array<number>(),
    issues: Array<number>(),
  });

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

  useEffect(() => {
    load_iter_issue_sr();
  }, []);

  if (recentSeven === "" || overall === "") {
    return <Loading />;
  }

  let active_list_7 = [];
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

  let active_list_all = [];
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
  // filter 掉贡献为 0 的
  active_list_7 = active_list_7.filter(
    (active: any) => active.mr !== 0 || active.line !== 0
  );
  active_list_all = active_list_all.filter(
    (active: any) => active.mr !== 0 || active.line !== 0
  );

  // 先获得该项目下的所有 iteration ok
  // 再获得该项目下的所有 repo ok
  // 对每个 repo，查询所有的 issue-sr ok
  // 再根据 sr-iteration 关系，对每个 iteration，查询其对应哪些 sr，需要 utils::Iteration2SR
  // 再根据已得到的 issue-sr，对上述每个 iteration 的每个 sr，需要 utils::SR2Issue
  // 查询有没有 issue 跟它对应，有就计数器 + 1
  const load_iter_issue_sr = async () => {
    const iter_issue_sr_list = {
      iterations: Array<string>(),
      all_sr_count: Array<number>(),
      issues: Array<number>(),
    };
    // 所有 iteration id
    const iterationList = JSON.parse(iterationStore).data.map((value: any) => {
      return {
        id: value.id,
        title: value.title,
      };
    });
    for (const iteration of iterationList) {
      // 该 iteration 对应的所有 SR 信息
      const assoSRList = await Iteration2SR(
        iteration.id,
        SRIterationStore,
        SRListStore
      );
      // console.log(assoSRList);
      iter_issue_sr_list.iterations.push(iteration.title);
      iter_issue_sr_list.all_sr_count.push(assoSRList.length);
      let counter = 0;
      for (const sr of assoSRList) {
        const issue = await SR2Issue(sr.id, issueSRStore, issueStore);
        if (issue.length > 0 && issue[0] !== "not found") counter++;
      }
      iter_issue_sr_list.issues.push(counter);
    }
    set_iter_issue_sr_list(iter_issue_sr_list);
    // console.log(iter_issue_sr_list);
  };

  // put in all the MRs get from an repo
  const MRReviewList = {
    data: Array<any>(),
  };
  JSON.parse(mergeStore).data.forEach((mr: any) => {
    MRReviewList.data.push({
      authoredAt: mr.authoredAt,
    });
  });

  // console.log(JSON.parse(commitStore));

  return (
    <div className={"merge-card"}>
      <div
        style={{
          fontSize: "2rem",
          marginLeft: "1rem",
          userSelect: "none",
          alignSelf: "flex-start",
        }}
      >
        项目数据分析
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <Tabs
        defaultActiveKey="1"
        centered={true}
        style={{
          width: "90%",
        }}
      >
        <Tabs.TabPane tab="开发工程师活跃度分析（周）" key="1">
          <ActiveFigure
            text={JSON.stringify(active_list_7)}
            title={"开发工程师活跃度分析（周）"}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="开发工程师活跃度分析（总）" key="2">
          <ActiveFigure
            text={JSON.stringify(active_list_all)}
            title={"开发工程师活跃度分析（总）"}
          />
        </Tabs.TabPane>
      </Tabs>

      <Tabs
        defaultActiveKey="1"
        centered={true}
        style={{
          width: "90%",
          marginTop: "2rem",
        }}
      >
        <Tabs.TabPane
          tab="开发工程师基于 Issue 解决时间的能力评定（周）"
          key="1"
        >
          <TimeFigure
            text={JSON.stringify(issue_list_7)}
            title={"开发工程师基于 Issue 解决时间的能力评定（周）"}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="开发工程师基于 Issue 解决时间的能力评定（总）"
          key="2"
        >
          <TimeFigure
            text={JSON.stringify(issue_list_all)}
            title={"开发工程师基于 Issue 解决时间的能力评定（总）"}
          />
        </Tabs.TabPane>
      </Tabs>

      <Tabs
        defaultActiveKey="1"
        centered={true}
        style={{
          width: "90%",
          marginTop: "2rem",
        }}
      >
        <Tabs.TabPane tab="交付后缺陷分析" key="1">
          <IssueFigure
            text={JSON.stringify(iter_issue_sr_list)}
            title={"交付后缺陷分析"}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="项目 Commit 时间轴" key="2">
          <CommitFigure title={"Commit数量统计表"} text={overall} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="项目 Merge Request 时间轴" key="3">
          <MRTimeFigure
            text={JSON.stringify(MRReviewList)}
            title={"MR数量统计表"}
          />
        </Tabs.TabPane>{" "}
        <Tabs.TabPane tab="代码变化行数分段计数" key="4">
          <LinesChanged text={commitStore} title={"代码变化行数分段计数"} />
        </Tabs.TabPane>
      </Tabs>
      <Tabs
        defaultActiveKey="1"
        centered={true}
        style={{
          width: "90%",
          marginTop: "2rem",
        }}
      >
        <Tabs.TabPane tab="个人提交次数统计" key="1">
          <MemberCommit text={commitStore} title={"个人提交次数统计"} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="个人提交信息长度分布" key="2">
          <MemberLines text={commitStore} title={"个人提交信息长度分布"} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default UIAnalysis;
