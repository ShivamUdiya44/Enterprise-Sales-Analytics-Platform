import { useMemo } from "react";
import useSWR from "swr";
import { API, fetcher } from "../services/api";

export default function useDashboardData(filters, granularity){
    const dateParams = useMemo(() => {
    const days = parseInt(filters.range, 10);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return { start_date: start.toISOString(), end_date: end.toISOString() };
  }, [filters.range]);

  const apiParams = useMemo(() => ({
    region: filters.region,
    category: filters.category,
    product: filters.product,
    ...dateParams,
  }), [filters, dateParams]);

const { data: options = { regions: ["All"], categories: ["All"], products: ["All"] } } =
    useSWR([`${API}/dashboard/filters`, {}], fetcher);

  const { data: kpis } = useSWR([`${API}/dashboard/kpis`, apiParams], fetcher);
  const { data: trendData, isLoading: trendLoading } = useSWR(
    [`${API}/dashboard/revenue-trend`, { ...apiParams, granularity }],
    fetcher
  );
  const { data: topProductsData } = useSWR(
    [`${API}/dashboard/top-products`, {
      region: apiParams.region, category: apiParams.category,
      start_date: apiParams.start_date, end_date: apiParams.end_date, limit: 8,
    }],
    fetcher
  );
  const { data: categoriesData } = useSWR(
    [`${API}/dashboard/categories`, {
      region: apiParams.region, start_date: apiParams.start_date, end_date: apiParams.end_date,
    }],
    fetcher
  );
  const { data: regionsData } = useSWR(
    [`${API}/dashboard/regions`, {
      category: apiParams.category, start_date: apiParams.start_date, end_date: apiParams.end_date,
    }],
    fetcher
  );
  const { data: ordersData } = useSWR(
    [`${API}/dashboard/recent-orders`, { ...apiParams, limit: 12 }],
    fetcher
  );

  const trend = trendData?.series ?? [];
  const topProducts = topProductsData?.items ?? [];
  const categories = categoriesData?.items ?? [];
  const regions = regionsData?.items ?? [];
  const orders = ordersData?.items ?? [];
  const loading = trendLoading;

  return {
        options,
        kpis,
        trend,
        categories,
        regions,
        topProducts,
        orders,
        loading,
    };
} 
 