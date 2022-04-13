// Examples

import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateRepoStore } from "../slices/RepoSlice";
import {
  updateIssueStore,
  updateCommitStore,
  updateMergeStore,
  updateMRSRAssociationStore,
} from "../slices/IssueSlice";

const getRDTSInfo = async (dispatcher: any, project_id: number) => {
  return getRepoInfo(dispatcher, project_id).then((repo_data: any) => {
    const promise_list = [];
    promise_list.push(
      getIssueInfo(dispatcher, project_id, JSON.stringify(repo_data))
    );
    promise_list.push(
      getCommitInfo(dispatcher, project_id, JSON.stringify(repo_data))
    );
    promise_list.push(
      getMergeInfo(dispatcher, project_id, JSON.stringify(repo_data))
    );
    promise_list.push(getMRSRAssociation(dispatcher, project_id));
    return Promise.all(promise_list);
  });
};

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
    return data;
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
) => {
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

  return Promise.all(promise_list).then((data: any) => {
    const all_mr: any[] = [];

    data.forEach((repo_mr: any) => {
      repo_mr.data.forEach((mr: any) => {
        all_mr.push(mr);
      });
    });

    all_mr.sort((mr1: any, mr2: any) => mr2.authoredAt - mr1.authoredAt);

    const res = {
      code: 0,
      data: all_mr,
    };

    dispatcher(updateMergeStore(JSON.stringify(res)));
    return res;
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

  return Promise.all(promise_list).then((data: any) => {
    let all_issue: any[] = [];

    data.forEach((repo_issue: any) => {
      repo_issue.data.forEach((issue: any) => {
        all_issue.push(issue);
      });
    });

    all_issue = all_issue
      .filter((issue: any) => issue.is_bug)
      .sort((mr1: any, mr2: any) => mr2.authoredAt - mr1.authoredAt);

    const res = {
      code: 0,
      data: all_issue,
    };

    dispatcher(updateIssueStore(JSON.stringify(res)));
    return res;
  });
};

const getCommitInfo = async (
  dispatcher: any,
  project_id: number,
  RepoStore: string
) => {
  const promise_list: any[] = [];
  JSON.parse(RepoStore).data.forEach((repo: any) => {
    const myParams = {
      repo: repo.id,
      type: "commit",
    };
    const promise = request_json(API.GET_RDTS, {
      getParams: myParams,
    });
    promise_list.push(promise);
  });

  return Promise.all(promise_list).then((data: any) => {
    let all_commit: any[] = [];

    data.forEach((repo_commit: any) => {
      repo_commit.data.forEach((commit: any) => {
        all_commit.push(commit);
      });
    });

    all_commit = all_commit.sort(
      (mr1: any, mr2: any) => mr2.createdAt - mr1.createdAt // Inversed Order by default
    );

    const res = {
      code: 0,
      data: all_commit,
    };

    dispatcher(updateCommitStore(JSON.stringify(res)));
    return res;
  });
};

const getMRSRAssociation = async (
  dispatcher: any,
  project_id: number
): Promise<any> => {
  const myParams = {
    project: project_id,
    type: "mr-sr",
  };
  return request_json(API.GET_RDTS, {
    getParams: myParams,
  }).then((data: any) => {
    dispatcher(updateMRSRAssociationStore(JSON.stringify(data)));
    return data;
  });
};

const createMRSRAssociation = async (
  dispatcher: any,
  project_id: number,
  mr_id: number,
  sr_id: number
) => {
  const myBody = {
    project: project_id,
    type: "mr-sr",
    operation: "create",
    data: {
      updateData: {
        MRId: mr_id,
        SRId: sr_id,
      },
    },
  };
  return request_json(API.POST_RDTS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getMRSRAssociation(dispatcher, project_id);
    }
    return data;
  });
};

const deleteMRSRAssociation = async (
  dispatcher: any,
  project_id: number,
  mr_id: number,
  sr_id: number
) => {
  const myBody = {
    project: project_id,
    type: "mr-sr",
    operation: "delete",
    data: {
      updateData: {
        MRId: mr_id,
        SRId: sr_id,
      },
    },
  };
  return request_json(API.POST_RDTS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getMRSRAssociation(dispatcher, project_id);
    }
    return data;
  });
};

export {
  getRepoInfo,
  createRepoInfo,
  deleteRepoInfo,
  getMergeInfo,
  getIssueInfo,
  getCommitInfo,
  getRDTSInfo,
  getMRSRAssociation,
  createMRSRAssociation,
  deleteMRSRAssociation,
};
