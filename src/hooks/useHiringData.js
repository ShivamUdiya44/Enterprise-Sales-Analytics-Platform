import { useMemo } from "react";
import useSWR from "swr";
import { API, fetcher } from "../services/api";

export default function useHiringData(filters) {
  const apiParams = useMemo(() => ({
    applied_role: filters.role,
    department: filters.department,
    min_score: filters.minScore || undefined,
  }), [filters]);

  const { data, isLoading } = useSWR(
    [`${API}/employees/candidates/ranking`, apiParams],
    fetcher
  );

  // Unfiltered, so the role dropdown doesn't shrink to just the
  // currently-selected role once a filter is applied.
  const { data: allData } = useSWR(
    [`${API}/employees/candidates/ranking`, {}],
    fetcher
  );

  const items = data?.items ?? [];
  const roles = ["All", ...new Set((allData?.items ?? []).map((c) => c.applied_role))];

  return { items, roles, loading: isLoading };
}
