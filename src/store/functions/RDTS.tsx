// Examples

import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { updateRepoStore } from "../slices/RepoSlice";

const getRepoInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "repo",
  };
  const repo_data = await request_json(API.GET_RDTS, {
    getParams: myParams,
  });
  dispatcher(updateRepoStore(JSON.stringify(repo_data)));
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

export { getRepoInfo, createRepoInfo, deleteRepoInfo };
