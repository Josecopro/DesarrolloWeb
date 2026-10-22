import type { Page } from "@/features/common/domain/types";
import { http } from "@/features/common/http";
import type { Scholarship } from "../domain/types";

export const scholarshipsService = {
  list: () => http.get<Page<Scholarship>>("/becas", { query: { limit: 100 } }),
};
