import { useMemo } from "react";
import useSWR from "swr";
import { API, fetcher } from "../services/api";
import { dateRangeFromDays } from "../utils/dateRange";

export default function usePnlData(filters, granularity) {
  const dateParams = useMemo(() => dateRangeFromDays(filters.range), [filters.range]);

  const apiParams = useMemo(() => ({
    region: filters.region,
    ...dateParams,
  }), [filters, dateParams]);

  const { data: options = { regions: ["All"] } } =
    useSWR([`${API}/dashboard/filters`, {}], fetcher);

  const { data: summary, isLoading: summaryLoading } = useSWR(
    [`${API}/pnl/summary`, apiParams],
    fetcher
  );
  const { data: trendData, isLoading: trendLoading } = useSWR(
    [`${API}/pnl/trend`, { ...apiParams, granularity }],
    fetcher
  );
  const { data: expenseBreakdownData } = useSWR(
    [`${API}/pnl/expense-breakdown`, { region: apiParams.region, start_date: apiParams.start_date, end_date: apiParams.end_date }],
    fetcher
  );
  const { data: profitabilityData } = useSWR(
    [`${API}/pnl/profitability`, { dimension: "region", start_date: apiParams.start_date, end_date: apiParams.end_date }],
    fetcher
  );

  return {
    options,
    summary,
    trend: trendData?.series ?? [],
    expenseBreakdown: expenseBreakdownData?.items ?? [],
    profitability: profitabilityData?.items ?? [],
    loading: summaryLoading || trendLoading,
  };
}
