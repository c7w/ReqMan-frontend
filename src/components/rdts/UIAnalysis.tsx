import "./UIMerge.css";
import React from "react";
import ActiveFigure from "../Figure/ActiveFigure";
import IssueFigure from "../Figure/IssueFigure";
import TimeFigure from "../Figure/TimeFigure";

const UIAnalysis = () => {
  const active_test =
    '[{"user":{"name":"c7w"},"mr":10,"line":3000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000},' +
    '{"user":{"name":"c7w"},"mr":10,"line":3000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000},' +
    '{"user":{"name":"c7w"},"mr":10,"line":1000},{"user":{"name":"wxy"},"mr":8,"line":1500},{"user":{"name":"hbx"},"mr":7,"line":2000}]';

  const issue_test =
    '{"iterations":["iter1","iter2","iter3","iter4"],"all_sr_count":[12,14,16,18],"issues":[1,2,4,2]}';

  const time_test =
    '[{"user":{"name":"c7w"},"time":[10,20,30,30,40,100,40]},{"user":{"name":"wxy"},"time":[5,10,20,20,30,40,5,10]},{"user":{"name":"hbx"},"time":[10,20,30,70,40,10,40]}]';

  return (
    <div className={"merge-card"}>
      <ActiveFigure text={active_test} title={"活跃度图表"} />
      <IssueFigure text={issue_test} title={"活跃度图表"} />
      <TimeFigure text={time_test} title={"活跃度图表"} />
    </div>
  );
};

export default UIAnalysis;
