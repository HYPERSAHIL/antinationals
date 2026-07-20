export const LegalNote = ({ variant = "default" }: { variant?: "default" | "warning" }) => {
  if (variant === "warning") {
    return (
      <div className="rounded-sm border border-status-disputed/40 bg-status-disputed/5 p-4">
        <p className="kicker text-status-disputed">Identity not verified</p>
        <p className="mt-2 text-sm text-foreground">
          Identity has not been independently verified. Do not attempt to identify, contact or confront this person.
          Inclusion in this archive documents an incident supported by the cited material; it does not by itself
          constitute a finding of criminal or civil liability.
        </p>
      </div>
    );
  }
  return (
    <div className="rule-top rule-bottom py-4">
      <p className="text-xs text-muted-foreground">
        Inclusion in this archive documents an incident or allegation supported by the cited material.
        It does not by itself constitute a finding of criminal or civil liability.
      </p>
    </div>
  );
};
