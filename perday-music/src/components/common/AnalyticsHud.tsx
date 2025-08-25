import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useEffect, useState } from 'react';

interface AnalyticsHudProps {
  grades?: number[];
  latencies?: number[];
}

export function AnalyticsHud({ grades = [], latencies = [] }: AnalyticsHudProps) {
  const [isFirstData, setIsFirstData] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if this is the first data point
  useEffect(() => {
    if (grades.length === 1 && latencies.length === 1 && !isFirstData) {
      setIsFirstData(true);
      setShowCelebration(true);
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [grades.length, latencies.length, isFirstData]);

  // Day 0: No data yet
  if (grades.length === 0 && latencies.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
        <div className="text-2xl font-bold text-white/60 mb-2">📊 Your Legacy Starts Tomorrow</div>
        <div className="text-sm text-white/40 mb-4">Lock in to start building your stats</div>
        
        {/* Ghosted out charts with pulsating animation */}
        <div className="grid md:grid-cols-2 gap-4 opacity-40">
          <div className="h-48 bg-gradient-to-r from-white/5 to-white/10 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/30 text-lg">Success Grades</div>
            </div>
          </div>
          
          <div className="h-48 bg-gradient-to-r from-white/5 to-white/10 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/30 text-lg">Start Latencies</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Day 1: First data point with celebration
  if (isFirstData && showCelebration) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 ring-1 ring-green-500/30 p-6 text-center animate-pulse">
        <div className="text-2xl font-bold text-green-400 mb-2">🎉 The First One's On The Board!</div>
        <div className="text-sm text-green-300 mb-4">Now do it again</div>
        
        {/* Animated first data point */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-48 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-green-400 text-lg font-bold">First Grade: {grades[0]}%</div>
            </div>
          </div>
          
          <div className="h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-400 text-lg font-bold">First Latency: {latencies[0]}ms</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

           // Regular charts for multiple data points
         const labels = grades.map((_, i) => `-${grades.length - i}d`);
         const lineOpt: echarts.EChartsOption = {
           backgroundColor: "transparent",
           grid: { top: 30, left: 40, right: 20, bottom: 30 },
           xAxis: { 
             type: "category", 
             data: labels, 
             axisLine: { lineStyle: { color: "#6C1AED22" } },
             axisLabel: { color: "#B2EBFF", fontSize: 10 }
           },
           yAxis: { 
             type: "value", 
             axisLine: { lineStyle: { color: "#6C1AED22" } }, 
             splitLine: { lineStyle: { color: "#1a1a2a" } },
             axisLabel: { color: "#B2EBFF", fontSize: 10 }
           },
           series: [{ 
             type: "line", 
             data: grades, 
             smooth: true, 
             areaStyle: { 
               opacity: .3,
               color: {
                 type: 'linear',
                 x: 0, y: 0, x2: 0, y2: 1,
                 colorStops: [
                   { offset: 0, color: 'rgba(108, 26, 237, 0.4)' },
                   { offset: 0.5, color: 'rgba(241, 109, 251, 0.2)' },
                   { offset: 1, color: 'rgba(178, 235, 255, 0.1)' }
                 ]
               }
             }, 
             lineStyle: { 
               width: 3,
               color: '#6C1AED'
             },
             itemStyle: {
               color: '#F16DFB',
               borderWidth: 2,
               borderColor: '#B2EBFF'
             }
           }]
         };
         const barOpt: echarts.EChartsOption = {
           backgroundColor: "transparent",
           grid: { top: 30, left: 40, right: 20, bottom: 30 },
           xAxis: { 
             type: "category", 
             data: labels,
             axisLine: { lineStyle: { color: "#55CBDC22" } },
             axisLabel: { color: "#B2EBFF", fontSize: 10 }
           },
           yAxis: { 
             type: "value",
             axisLine: { lineStyle: { color: "#55CBDC22" } },
             splitLine: { lineStyle: { color: "#1a1a2a" } },
             axisLabel: { color: "#B2EBFF", fontSize: 10 }
           },
           series: [{ 
             type: "bar", 
             data: latencies,
             itemStyle: {
               color: {
                 type: 'linear',
                 x: 0, y: 0, x2: 0, y2: 1,
                 colorStops: [
                   { offset: 0, color: '#55CBDC' },
                   { offset: 0.5, color: '#B2EBFF' },
                   { offset: 1, color: '#F16DFB' }
                 ]
               },
               borderRadius: [6, 6, 0, 0]
             }
           }]
         };

         return (
           <div className="rounded-2xl bg-gradient-to-br from-synth-violet/5 to-synth-aqua/5 ring-1 ring-synth-icy/20 p-6 shadow-xl backdrop-blur-sm">
             <div className="text-lg font-semibold text-synth-white mb-4">📊 Your Progress</div>
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <div className="text-sm font-medium text-synth-icy mb-2">Success Grades</div>
                 <ReactECharts style={{ height: 240 }} option={lineOpt} />
               </div>
               <div>
                 <div className="text-sm font-medium text-synth-icy mb-2">Start Latencies</div>
                 <ReactECharts style={{ height: 240 }} option={barOpt} />
               </div>
             </div>
             <div className="text-xs opacity-60 mt-4 text-center">Grades & latency (last 14 sessions)</div>
           </div>
         );
}
