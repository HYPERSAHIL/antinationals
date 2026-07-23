import { useParams } from "react-router-dom";
import { PlaceholderPage } from "./_PlaceholderPage";

const IncidentDetailPage = () => {
  const { slug } = useParams();
  return (
    <PlaceholderPage
      seoTitle={`Incident ${slug ?? ""}`.trim()}
      seoDescription="Incident record with evidence, subjects, sources and verification history."
      path={`/incidents/${slug ?? ""}`}
      eyebrow="INCIDENT RECORD"
      title={slug ? `Incident ${slug.toUpperCase()}` : "Incident"}
      description="The incident record template — factual summary, evidence timeline, subjects appearing and source references — is scheduled for Phase 0B."
      panelTitle="Incident record template"
      panelBody="The detail template will surface incident public ID, occurrence date, approximate location, neutral summary, evidence timeline, subject cross-references and correction history."
    />
  );
};
export default IncidentDetailPage;
