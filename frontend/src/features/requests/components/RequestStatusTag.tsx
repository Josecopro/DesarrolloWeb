import { Tag } from "@/features/common/components/Tag";
import { type RequestStatus, requestStatusLabel } from "../domain/types";

const variant = { new: "secondary", in_progress: "primary", closed: "success" } as const;

export function RequestStatusTag({ status }: { status: RequestStatus }) {
  return <Tag variant={variant[status]}>{requestStatusLabel[status]}</Tag>;
}

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
