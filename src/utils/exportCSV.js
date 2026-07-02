export const exportCSV = (orders) => {
    const rows = [
      ["date", "order_id", "product", "category", "region", "qty", "unit_price", "revenue"],
      ...orders.map((o) => [o.date, o.id, o.product, o.category, o.region, o.qty, o.unit_price, o.revenue]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meridian-orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };