export default function RecentOrders({ data }) {
  return (
    <div className="swiss-card overflow-hidden lg:col-span-4" data-testid="recent-orders-card">
      <div className="p-6 pb-3 flex items-center justify-between">
        <div>
          <div className="overline">Fig. 05 — Stream</div>
          <h3 className="font-display font-bold text-2xl text-slate-950 mt-1 tracking-tight">Recent Orders</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tab text-slate-500 uppercase tracking-widest">
          <span className="w-2 h-2 bg-emerald-500 animate-pulse" /> Sync · live
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              {["Date", "Order", "Product", "Category", "Region", "Qty", "Unit", "Revenue"].map((h) => (
                <th key={h} className="px-6 py-3 overline">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono-tab">
            {data.map((o, i) => (
              <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50/60" data-testid={`order-row-${i}`}>
                <td className="px-6 py-3 text-slate-500">{o.date.slice(0, 10)}</td>
                {/* <td className="px-6 py-3 text-slate-900">{o.id.slice(0, 8).toUpperCase()}</td> */}
                <td className="px-6 py-3 text-slate-900 font-semibold">{o.product}</td>
                <td className="px-6 py-3 text-slate-700">{o.category}</td>
                <td className="px-6 py-3 text-slate-700">{o.region}</td>
                <td className="px-6 py-3 text-slate-900">{o.qty}</td>
                <td className="px-6 py-3 text-slate-700">${o.unit_price.toFixed(2)}</td>
                <td className="px-6 py-3 font-bold text-slate-950">${o.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}