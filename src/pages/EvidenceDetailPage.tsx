import { useParams } from "react-router-dom";
import { PlaceholderPage } from "./_PlaceholderPage";

const EvidenceDetailPage = () => {
  const { id } = useParams();
  return (
    <PlaceholderPage
      seoTitle={`Evidence ${id ?? ""}`.trim()}
      seoDescription="Evidence record with source, provenance, archive status and verification history."
      path={`/evidence/${id ?? ""}`}
      eyebrow="EVIDENCE RECORD"
      title={id ? id.toUpperCase() : "Evidence"}
      description="Evidence template — source, original URL, capture date, preservation hash, archive status, related incident and subjects appearing — is scheduled for Phase 0B."
      panelTitle="Evidence record template"
      panelBody="Provenance and traceability will be visually central: source platform, original URL, published/captured/submitted dates, SHA-256 hash, archival status and verification history."
    />
  );
};
export default EvidenceDetailPage;
