import { useParams } from "react-router-dom";
import { IssueDetails } from "./IssueDetails";
import type { Issue } from "../types/domain";

export const IssueDetailsPage = ({
  issues,
  staff,
  onBack,
  onStatusChange,
}: {
  issues: Issue[];
  staff: boolean;
  onBack: () => void;
  onStatusChange: (issue: Issue) => void;
}) => {
  const { id } = useParams();
  const issue = issues.find((i) => i.id === Number(id));

  if (!issue)
    return (
      <div className="empty">
        <p>Nie znaleziono zgłoszenia.</p>
      </div>
    );

  return (
    <IssueDetails
      issue={issue}
      staff={staff}
      onBack={onBack}
      onStatusChange={onStatusChange}
    />
  );
};
