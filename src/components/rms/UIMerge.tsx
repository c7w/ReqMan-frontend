import "./UIMerge.css";
import React from "react";

const SingleMergeEntry = () => {
  const getBackgroundColor = () => {
    return "#f6f6f6";
  };

  return (
    <div
      className="issuable-info-container"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="issuable-main-info">
        <div className="merge-request-title title">
          <span className="merge-request-title-text js-onboarding-mr-item">
            <a href="/undefined/frontend/-/merge_requests/63">
              [SR.005.104] Bugfix: modify login regExp (#66)
            </a>
          </span>
        </div>
        <div className="issuable-info">
          <span className="issuable-reference">!63</span>
          <span className="issuable-authored d-none d-sm-inline-block">
            · opened{" "}
            <time
              className="js-timeago"
              title=""
              dateTime="2022-04-10T14:32:18Z"
              data-toggle="tooltip"
              data-placement="bottom"
              data-container="body"
              data-original-title="Apr 10, 2022 10:32pm GMT+0800"
            >
              1小时前
            </time>
            by{" "}
            <a
              className="author-link js-user-link  "
              data-user-id="122"
              data-username="2020010951"
              data-name="高焕昂"
              href="/2020010951"
              title=""
            >
              <span className="author">高焕昂</span>
            </a>
          </span>
        </div>
      </div>

      <div className="issuable-meta">
        <div className="issuable-status d-none d-sm-inline-block">已合并</div>

        <div className="float-right issuable-updated-at d-none d-sm-inline-block">
          <span>
            更新于
            <time
              className="js-timeago merge_request_updated_ago"
              title=""
              dateTime="2022-04-10T14:36:59Z"
              data-toggle="tooltip"
              data-placement="bottom"
              data-container="body"
              data-original-title="Apr 10, 2022 10:36pm GMT+0800"
            >
              1小时前
            </time>
          </span>
        </div>
      </div>
    </div>
  );
};

const UIMerge = () => {
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
        合并情况查看
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <SingleMergeEntry />
      <SingleMergeEntry />
      <SingleMergeEntry />
      <SingleMergeEntry />
      <SingleMergeEntry />
    </div>
  );
};

export default UIMerge;
