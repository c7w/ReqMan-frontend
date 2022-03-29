export interface Service {
  id: number;
  project: number;
  title: string;
  description: string;
  rank: number;
  createdBy: number;
  createdAt: number;
}

const ProjectServiceCard = (props: Service) => {
  return <div></div>;
};

const UIServiceReadonly = () => {
  return <div className={"personal-setting-container"}></div>;
};

export default UIServiceReadonly;
