import { Button, Upload } from "antd";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  createIRInfo,
  updateIRInfo,
  createIRSR,
  createIteration,
  createSRInfo,
  createSRIteration,
  createUserIteration,
  updateSRInfo,
  updateIterationInfo,
  getIRSRInfo,
  getSRIterationInfo,
  getIRIterationInfo,
  getSRServiceInfo,
  getIRListInfo,
  getSRListInfo,
  updateServiceInfo,
  getIterationInfo,
} from "../store/functions/RMS";
import {
  IRCardProps,
  IRSRAssociation,
  Iteration,
  SRCardProps,
  SRIteration,
  UserIteration,
} from "../store/ConfigureStore";
import {
  IR2Iteration,
  Iteration2IR,
  Iteration2SR,
  oneIR2AllSR,
  oneSR2AllIR,
  Service2SR,
  SR2Iteration,
  SR2Service,
  userId2UserInfo,
} from "../utils/Association";
import { getProjectStore } from "../store/slices/ProjectSlice";
import { updateProjectInfo, updateUserInfo } from "../store/functions/UMS";
import Loading from "../layout/components/Loading";
import {
  getIRListStore,
  getIRSRStore,
  getSRListStore,
} from "../store/slices/IRSRSlice";
import {
  getIRIterationStore,
  getIterationStore,
  getSRIterationStore,
} from "../store/slices/IterationSlice";
import {
  getServiceStore,
  getSRServiceStore,
} from "../store/slices/ServiceSlice";
import {
  getCommitInfo,
  getIssueInfo,
  getMergeInfo,
  getRDTSInfo,
  getRepoInfo,
} from "../store/functions/RDTS";
import React, { useEffect, useState } from "react";
import { getRepoStore } from "../store/slices/RepoSlice";
import {
  getCommitStore,
  getIssueStore,
  getMergeStore,
} from "../store/slices/IssueSlice";
import { compressBase64Image } from "../utils/ImageCompressor";
import request_json from "../utils/Network";
import API from "../utils/APIList";
import { ToastMessage } from "../utils/Navigation";
import { UIUserCard, UIUserCardPreview } from "./ums/UIUserCard";
import { getUserStore } from "../store/slices/UserSlice";
import UIUserActivity from "./ums/UIUserActivity";

const Test = () => {
  const dispatcher = useDispatch();

  const userStore = useSelector(getUserStore);

  const repoStore = useSelector(getRepoStore);
  const issueStore = useSelector(getIssueStore);
  const mergeStore = useSelector(getMergeStore);
  const commitStore = useSelector(getCommitStore);

  const projectInfo = useSelector(getProjectStore);
  const IRSRAsso = useSelector(getIRSRStore);
  const SRIterationAsso = useSelector(getSRIterationStore);
  const IRIterationAsso = useSelector(getIRIterationStore);
  const SRServiceAsso = useSelector(getSRServiceStore);
  const SRListInfo = useSelector(getSRListStore);
  const IRListInfo = useSelector(getIRListStore);
  const iterationInfo = useSelector(getIterationStore);
  const serviceInfo = useSelector(getServiceStore);

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: { url: any; originFileObj: Blob }) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onBeforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.debug(reader.result);
      compressBase64Image(reader.result as string).then((result: string) => {
        console.debug(result);
      });
    });
    reader.readAsDataURL(file);

    return false;
  };

  useEffect(() => {
    updateProjectInfo(dispatcher, 2);
    getIRSRInfo(dispatcher, 2);
    getSRIterationInfo(dispatcher, 2);
    getIRIterationInfo(dispatcher, 2);
    getSRServiceInfo(dispatcher, 2);
    getIRListInfo(dispatcher, 2);
    getSRListInfo(dispatcher, 2);
    updateServiceInfo(dispatcher, 2);
    getIterationInfo(dispatcher, 2);
    getRDTSInfo(dispatcher, 2);
    updateUserInfo(dispatcher);
  }, []);

  const handleOnClick = () => {
    // compressBase64Image(``);
  };
  if (
    projectInfo === "" ||
    IRSRAsso === "" ||
    SRIterationAsso === "" ||
    IRIterationAsso === "" ||
    SRServiceAsso === "" ||
    SRListInfo === "" ||
    IRListInfo === "" ||
    serviceInfo === "" ||
    iterationInfo === "" ||
    repoStore === "" ||
    issueStore === "" ||
    mergeStore === "" ||
    commitStore === "" ||
    userStore === ""
  ) {
  } else {
    // console.debug(JSON.parse(repoStore));
    // console.debug(JSON.parse(issueStore));
    // console.debug(JSON.parse(commitStore));
    // console.debug(JSON.parse(mergeStore));
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>I am test page</p>
        <UIUserCardPreview projectStore={projectInfo} userId={17} />
        {/*<Button type="primary" onClick={() => handleOnClick()}>*/}
        {/*  Primary Button*/}
        {/*</Button>*/}
        {/*<div id={"test-id"} />*/}
        {/*<Upload*/}
        {/*  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*/}
        {/*  listType="text"*/}
        {/*  showUploadList={false}*/}
        {/*  beforeUpload={onBeforeUpload}*/}
        {/*  fileList={fileList}*/}
        {/*  onChange={onChange}*/}
        {/*  onPreview={onPreview as any}*/}
        {/*  id={"setting-upload"}*/}
        {/*  className={"setting-upload"}*/}
        {/*>*/}
        {/*  <Button type={"primary"}>修改头像</Button>*/}
        {/*</Upload>*/}
      </div>
    );
  }
  return (
    <>
      <Loading />
    </>
  );
};

export default Test;
