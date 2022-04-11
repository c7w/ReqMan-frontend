// Examples

import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateRepoStore } from "../slices/RepoSlice";
import { updateMergeStore } from "../slices/MergeSlice";
import { updateIssueStore } from "../slices/IssueSlice";

const getRepoInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "repo",
  };
  return request_json(API.GET_RDTS, {
    getParams: myParams,
  }).then((data: any) => {
    dispatcher(updateRepoStore(JSON.stringify(data)));
  });
};

const createRepoInfo = async (
  dispatcher: any,
  project_id: number,
  remote_id: string,
  access_token: string,
  title: string
): Promise<void> => {
  const myBody = {
    project: 2,
    type: "gitlab",
    remote_id: remote_id,
    access_token: access_token,
    enable_crawling: true,
    info: {
      base_url: "https://gitlab.secoder.net",
    },
    title: title,
    description: "New Repo!",
    op: "add",
  };
  return request_json(API.CREATE_REPO, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getRepoInfo(dispatcher, project_id);
    }
    return data;
  });
};

const deleteRepoInfo = async (
  dispatcher: any,
  project_id: number,
  repo_id: number
): Promise<void> => {
  // console.log(SRService);
  const myBody = {
    project: project_id,
    type: "repo",
    operation: "delete",
    data: {
      id: repo_id,
    },
  };
  return request_json(API.POST_RDTS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getRepoInfo(dispatcher, project_id);
    }
    return data;
  });
};

const getMergeInfo = async (
  dispatcher: any,
  project_id: number,
  RepoStore: string
): Promise<void> => {
  const promise_list: any[] = [];
  JSON.parse(RepoStore).data.forEach((repo: any) => {
    const myParams = {
      repo: repo.id,
      type: "mr",
    };
    const promise = request_json(API.GET_RDTS, {
      getParams: myParams,
    });
    promise_list.push(promise);
  });

  Promise.all(promise_list).then((data: any) => {
    const all_mr: any[] = [];

    data.forEach((repo_mr: any) => {
      repo_mr.data.forEach((mr: any) => {
        all_mr.push(mr);
      });
    });

    all_mr.sort((mr1: any, mr2: any) => mr1.authoredAt - mr2.authoredAt);

    const res = {
      code: 0,
      data: all_mr,
    };

    dispatcher(updateMergeStore(JSON.stringify(res)));
  });
};

const getIssueInfo = async (
  dispatcher: any,
  project_id: number,
  RepoStore: string
) => {
  const promise_list: any[] = [];
  JSON.parse(RepoStore).data.forEach((repo: any) => {
    const myParams = {
      repo: repo.id,
      type: "issue",
    };
    const promise = request_json(API.GET_RDTS, {
      getParams: myParams,
    });
    promise_list.push(promise);
  });

  console.debug(promise_list);

  Promise.all(promise_list).then((data: any) => {
    console.debug(data);
    let all_issue: any[] = [];

    data.forEach((repo_issue: any) => {
      repo_issue.data.forEach((issue: any) => {
        all_issue.push(issue);
      });
    });

    all_issue = all_issue
      .filter((issue: any) => issue.is_bug)
      .sort((mr1: any, mr2: any) => mr1.authoredAt - mr2.authoredAt);

    const res = {
      code: 0,
      data: all_issue,
    };

    dispatcher(updateIssueStore(JSON.stringify(res)));
  });
};

const getCommitInfo = async (
  dispatcher: any,
  project_id: number,
  RepoStore: string
) => {
  return;
};

export {
  getRepoInfo,
  createRepoInfo,
  deleteRepoInfo,
  getMergeInfo,
  getIssueInfo,
  getCommitInfo,
};
