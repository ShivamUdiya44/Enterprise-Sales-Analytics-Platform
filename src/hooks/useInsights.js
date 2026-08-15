import { useMemo } from "react";
import useSWR from "swr";
import { API, fetcher } from "../services/api";
import { dateRangeFromDays } from "../utils/dateRange";

export default function useInsights(filters) {
  const dateParams = useMemo(() => dateRangeFromDays(filters.range), [filters.range]);

  const apiParams = useMemo(() => ({
    region: filters.region,
    category: filters.category,
    ...dateParams,
  }), [filters, dateParams]);

  const { data, isLoading } = useSWR([`${API}/insights`, apiParams], fetcher);

  return { items: data?.items ?? [], loading: isLoading };
}
