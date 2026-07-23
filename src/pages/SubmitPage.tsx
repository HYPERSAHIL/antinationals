import { PlaceholderPage } from "./_PlaceholderPage";

const SubmitPage = () => (
  <PlaceholderPage
    seoTitle="Submit evidence"
    seoDescription="Submit publicly available evidence for review. Submissions do not automatically become verified facts."
    path="/submit"
    eyebrow="SUBMIT EVIDENCE"
    title="Submit evidence"
    description="A structured submission flow — photo/screenshot, original source, context, optional metadata and a good-faith confirmation — will be built in Phase 0B. Submissions never auto-publish and user-supplied claims never automatically become verified facts."
    panelTitle="Submission flow"
    panelBody="Phase 0B implements the six-step UI: upload, source type, source URL, description, optional metadata, good-faith confirmation. No real upload or persistence backend will be introduced in Phase 0."
  />
);
export default SubmitPage;
