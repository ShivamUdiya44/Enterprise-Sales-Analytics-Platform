import { useMemo } from "react";
import useSWR from "swr";
import { API, fetcher } from "../services/api";
import { dateRangeFromDays } from "../utils/dateRange";

export default function useEmployeeData(filters) {
  const dateParams = useMemo(() => dateRangeFromDays(filters.range), [filters.range]);

  const apiParams = useMemo(() => ({
    department: filters.department,
    region: filters.region,
    ...dateParams,
  }), [filters, dateParams]);

  const { data: filterOptions = { regions: ["All"] } } =
    useSWR([`${API}/dashboard/filters`, {}], fetcher);

  const { data: performanceData, isLoading } = useSWR(
    [`${API}/employees/performance`, apiParams],
    fetcher
  );
  const { data: departmentsData } = useSWR(
    [`${API}/employees/departments`, { start_date: apiParams.start_date, end_date: apiParams.end_date }],
    fetcher
  );

  const departments = departmentsData?.items ?? [];
  const options = {
    regions: filterOptions.regions,
    departments: ["All", ...departments.map((d) => d.department)],
  };

  return {
    options,
    performance: performanceData?.items ?? [],
    topPerformers: performanceData?.top_performers ?? [],
    bottomPerformers: performanceData?.bottom_performers ?? [],
    departments,
    loading: isLoading,
  };
}
