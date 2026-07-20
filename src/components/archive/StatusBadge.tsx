import { cn } from "@/lib/utils";

type VStatus = "verified" | "corroborated" | "partially_verified" | "unverified" | "disputed" | "corrected";
type IStatus = "verified" | "corroborated" | "unconfirmed";

const vLabels: Record<VStatus, string> = {
  verified: "Verified",
  corroborated: "Corroborated",
  partially_verified: "Partially verified",
  unverified: "Unverified",
  disputed: "Disputed",
  corrected: "Corrected",
};

const vColors: Record<VStatus, string> = {
  verified: "bg-status-verified/15 text-status-verified border-status-verified/30",
  corroborated: "bg-status-corroborated/15 text-status-corroborated border-status-corroborated/30",
  partially_verified: "bg-status-partial/15 text-status-partial border-status-partial/30",
  unverified: "bg-status-unverified/15 text-status-unverified border-status-unverified/30",
  disputed: "bg-status-disputed/15 text-status-disputed border-status-disputed/30",
  corrected: "bg-status-corrected/15 text-status-corrected border-status-corrected/30",
};

export const VerificationBadge = ({ status, className }: { status: VStatus | string | null | undefined; className?: string }) => {
  const s = (status || "unverified") as VStatus;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em]",
      vColors[s] || vColors.unverified,
      className
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {vLabels[s] || "Unverified"}
    </span>
  );
};

const iLabels: Record<IStatus, string> = {
  verified: "Identity verified",
  corroborated: "Identity corroborated",
  unconfirmed: "Identity unconfirmed",
};

const iColors: Record<IStatus, string> = {
  verified: "bg-status-verified/15 text-status-verified border-status-verified/30",
  corroborated: "bg-status-corroborated/15 text-status-corroborated border-status-corroborated/30",
  unconfirmed: "bg-status-unverified/15 text-status-unverified border-status-unverified/30",
};

export const IdentityBadge = ({ status, className }: { status: IStatus | string | null | undefined; className?: string }) => {
  const s = (status || "unconfirmed") as IStatus;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em]",
      iColors[s] || iColors.unconfirmed,
      className
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {iLabels[s] || "Identity unconfirmed"}
    </span>
  );
};
