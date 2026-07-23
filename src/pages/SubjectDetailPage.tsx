import { useParams } from "react-router-dom";
import { PlaceholderPage } from "./_PlaceholderPage";

const SubjectDetailPage = () => {
  const { publicId } = useParams();
  return (
    <PlaceholderPage
      seoTitle={`Subject ${publicId ?? ""}`.trim()}
      seoDescription="Subject record with identity status, evidence and incident cross-references."
      path={`/subjects/${publicId ?? ""}`}
      eyebrow="SUBJECT RECORD"
      title={publicId ? publicId.toUpperCase() : "Subject"}
      description="The subject record template will show identity status (never a social-media verification badge), first/last documented dates, incidents, evidence and identity-claim history."
      panelTitle="Subject record template"
      panelBody="Deferred to Phase 0B. The static layout is designed to keep identity claims visually distinct from underlying evidence."
    />
  );
};
export default SubjectDetailPage;
