// Examples

import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateRepoStore } from "../slices/RepoSlice";
import {
  updateIssueStore,
  updateCommitStore,
  updateMergeStore,
  updateMRSRAssociationStore,
  updateIssueSRAssociationStore,
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
    promise_list.push(
      getMRSRAssociation(dispatcher, project_id, JSON.stringify(repo_data))
    );
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
    project: project_id,
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
  project_id: number,
  RepoStore: string
): Promise<any> => {
  const promise_list: any[] = [];
  JSON.parse(RepoStore).data.forEach((repo: any) => {
    const myParams = {
      repo: repo.id,
      type: "mr-sr",
    };
    const promise = request_json(API.GET_RDTS, {
      getParams: myParams,
    });
    promise_list.push(promise);
  });

  return Promise.all(promise_list).then((data: any) => {
    const all_mr_sr_asso: any[] = [];

    data.forEach((repo_mr_sr_asso: any) => {
      repo_mr_sr_asso.data.forEach((mr_sr_asso: any) => {
        all_mr_sr_asso.push(mr_sr_asso);
      });
    });

    const res = {
      code: 0,
      data: all_mr_sr_asso,
    };

    dispatcher(updateMRSRAssociationStore(JSON.stringify(res)));
    return res;
  });
};

const createMRSRAssociation = async (
  dispatcher: any,
  project_id: number,
  mr_id: number,
  sr_id: number,
  repoStore: string
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
      getMRSRAssociation(dispatcher, project_id, repoStore);
    }
    return data;
  });
};

const deleteMRSRAssociation = async (
  dispatcher: any,
  project_id: number,
  mr_id: number,
  sr_id: number,
  repoStore: string
) => {
  const myBody = {
    project: project_id,
    type: "mr-sr",
    operation: "delete",
    data: {
      MRId: mr_id,
      SRId: sr_id,
    },
  };
  return request_json(API.POST_RDTS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getMRSRAssociation(dispatcher, project_id, repoStore);
    }
    return data;
  });
};

const getIssueSRAssociation = async (
  dispatcher: any,
  project_id: number,
  RepoStore: string
): Promise<any> => {
  const promise_list: any[] = [];
  JSON.parse(RepoStore).data.forEach((repo: any) => {
    const myParams = {
      repo: repo.id,
      type: "issue-sr",
    };
    const promise = request_json(API.GET_RDTS, {
      getParams: myParams,
    });
    promise_list.push(promise);
  });

  return Promise.all(promise_list).then((data: any) => {
    const all_issue_sr_asso: any[] = [];

    data.forEach((repo_issue_sr_asso: any) => {
      repo_issue_sr_asso.data.forEach((issue_sr_asso: any) => {
        all_issue_sr_asso.push(issue_sr_asso);
      });
    });

    const res = {
      code: 0,
      data: all_issue_sr_asso,
    };

    dispatcher(updateIssueSRAssociationStore(JSON.stringify(res)));
    return res;
  });
};

const createIssueSRAssociation = async (
  dispatcher: any,
  project_id: number,
  issue_id: number,
  sr_id: number,
  repoStore: string
) => {
  const myBody = {
    project: project_id,
    type: "issue-sr",
    operation: "create",
    data: {
      updateData: {
        issueId: issue_id,
        SRId: sr_id,
      },
    },
  };
  return request_json(API.POST_RDTS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getIssueSRAssociation(dispatcher, project_id, repoStore);
    }
    return data;
  });
};

const deleteIssueSRAssociation = async (
  dispatcher: any,
  project_id: number,
  issue_id: number,
  sr_id: number,
  repoStore: string
) => {
  const myBody = {
    project: project_id,
    type: "issue-sr",
    operation: "delete",
    data: {
      issue: issue_id,
      SRId: sr_id,
    },
  };
  return request_json(API.POST_RDTS, { body: myBody }).then((data) => {
    if (data.code === 0) {
      getIssueSRAssociation(dispatcher, project_id, repoStore);
    }
    return data;
  });
};

const createMRIssueAssociation = async (
  dispatcher: any,
  project_id: number,
  mr_id: number,
  issue_id: number
) => {
  const myBody = {
    project: project_id,
    type: "issue-mr",
    operation: "create",
    data: {
      updateData: {
        issueId: issue_id,
        MRId: mr_id,
      },
    },
  };
  return request_json(API.POST_RDTS, { body: myBody });
};

const deleteMRIssueAssociation = async (
  dispatcher: any,
  project_id: number,
  mr_id: number,
  issue_id: number
) => {
  const myBody = {
    project: project_id,
    type: "issue-mr",
    operation: "delete",
    data: {
      issueId: issue_id,
      MRId: mr_id,
    },
  };
  return request_json(API.POST_RDTS, { body: myBody });
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
  getIssueSRAssociation,
  createIssueSRAssociation,
  deleteIssueSRAssociation,
  createMRIssueAssociation,
  deleteMRIssueAssociation,
};
