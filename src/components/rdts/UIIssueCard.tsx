interface UIIssueCardProps {
  data: string;
  SRListStore: string;
  MRSRAssociationStore: string;
  visible: boolean;
  close: () => void;
}

interface UIIssueCardPreviewProps {
  SRListStore: string;
  MRSRAssociationStore: string;
  data: string;
}

const UIIssueCard = (props: UIIssueCardProps) => {
  return <></>;
};

const UIIssueCardPreview = (props: UIIssueCardPreviewProps) => {
  return <></>;
};

export { UIIssueCard };
