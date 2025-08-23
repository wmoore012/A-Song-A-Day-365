import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export function AnalyticsHud({ grades, latencies }: { grades: number[]; latencies: number[] }) {
  const labels = grades.map((_, i) => `-${grades.length - i}d`);
  const lineOpt: echarts.EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: 20, left: 30, right: 10, bottom: 20 },
    xAxis: { type: "category", data: labels, axisLine: { lineStyle: { color: "#405" } } },
    yAxis: { type: "value", axisLine: { lineStyle: { color: "#405" } }, splitLine: { lineStyle: { color: "#1a1a2a" } } },
    series: [{ type: "line", data: grades, smooth: true, areaStyle: { opacity: .15 }, lineStyle: { width: 3 } }]
  };
  const barOpt: echarts.EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: 20, left: 30, right: 10, bottom: 20 },
    xAxis: { type: "category", data: labels },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: latencies }]
  };
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
      <div className="grid md:grid-cols-2 gap-4">
        <ReactECharts style={{ height: 220 }} option={lineOpt} />
        <ReactECharts style={{ height: 220 }} option={barOpt} />
      </div>
      <div className="text-xs opacity-60 mt-2">Grades & latency (last 14 sessions)</div>
    </div>
  );
}
