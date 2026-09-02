import React, { useState } from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  Layers, 
  Activity, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export const CONFUSION_MATRIX = [
  { actual: 'Fear', normal: 4, fear: 182, distress: 8, following: 2, aggressive: 1 },
  { actual: 'Distress', normal: 6, fear: 12, distress: 164, following: 3, aggressive: 2 },
  { actual: 'Following', normal: 3, fear: 1, distress: 4, following: 195, aggressive: 5 },
  { actual: 'Aggressive', normal: 1, fear: 2, distress: 3, following: 6, aggressive: 178 },
  { actual: 'Normal', normal: 340, fear: 5, distress: 4, following: 2, aggressive: 1 },
];

export const PER_CLASS_METRICS = [
  { className: 'Fear (Distress Emotion)', precision: '94.2%', recall: '92.4%', f1: '0.933', support: 197 },
  { className: 'Distress / Agitation', precision: '92.1%', recall: '87.7%', f1: '0.898', support: 187 },
  { className: 'Following / Stalking Path', precision: '95.6%', recall: '93.8%', f1: '0.947', support: 208 },
  { className: 'Aggressive Approach / Grab', precision: '96.2%', recall: '93.7%', f1: '0.949', support: 190 },
  { className: 'Normal Baseline Activity', precision: '97.4%', recall: '97.7%', f1: '0.975', support: 348 },
];

export default function ModelEvaluationView() {
  const [selectedModelVersion, setSelectedModelVersion] = useState('Guardian Angel v2.4 (Production)');

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <span>Model Performance Evaluation & Benchmarking</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Evaluation metrics, multi-class confusion matrix, and ROC/AUC validation curves.</p>
        </div>

        <select
          value={selectedModelVersion}
          onChange={(e) => setSelectedModelVersion(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
        >
          <option value="Guardian Angel v2.4 (Production)">Guardian Angel v2.4 (Active Production)</option>
          <option value="Guardian Angel v2.3 (Candidate)">Guardian Angel v2.3 (Candidate)</option>
          <option value="Baseline Model v1.0">Baseline Model v1.0</option>
        </select>
      </div>

      {/* Top 5 High-Level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Accuracy</span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-0.5 block">94.8%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">+2.4% over v2.3</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Precision (Macro)</span>
          <span className="text-2xl font-black text-blue-700 font-mono mt-0.5 block">95.1%</span>
          <span className="text-[10px] text-slate-500">Low False Alarm Rate</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Recall (Macro)</span>
          <span className="text-2xl font-black text-purple-700 font-mono mt-0.5 block">93.1%</span>
          <span className="text-[10px] text-slate-500">High Threat Sensitivity</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">F1-Score</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">0.938</span>
          <span className="text-[10px] text-slate-500">Harmonic Balance</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">ROC-AUC Score</span>
          <span className="text-2xl font-black text-orange-600 font-mono mt-0.5 block">0.972</span>
          <span className="text-[10px] text-orange-700 font-semibold">Excellent Discrimination</span>
        </div>
      </div>

      {/* Main Grid: Confusion Matrix (6 cols) & Per-Class Performance (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: 5x5 Multi-Class Confusion Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Multi-Class Confusion Matrix (Test Set: 1,130 Samples)
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Rows: Actual | Cols: Predicted</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px]">
                    <th className="p-2 text-left">Actual \ Pred</th>
                    <th className="p-2">Fear</th>
                    <th className="p-2">Distress</th>
                    <th className="p-2">Follow</th>
                    <th className="p-2">Aggr</th>
                    <th className="p-2">Normal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                  {CONFUSION_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-left text-slate-900 font-sans">{row.actual}</td>
                      <td className={`p-2 font-bold ${row.actual === 'Fear' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500'}`}>{row.fear}</td>
                      <td className={`p-2 font-bold ${row.actual === 'Distress' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500'}`}>{row.distress}</td>
                      <td className={`p-2 font-bold ${row.actual === 'Following' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500'}`}>{row.following}</td>
                      <td className={`p-2 font-bold ${row.actual === 'Aggressive' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500'}`}>{row.aggressive}</td>
                      <td className={`p-2 font-bold ${row.actual === 'Normal' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500'}`}>{row.normal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center font-medium">
            Highlighted diagonal entries represent correct true positive classifications.
          </div>
        </div>

        {/* Right: Per-Class Detailed Performance Table (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Per-Class Precision, Recall & F1-Score Breakdown
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px]">
                    <th className="p-2">Classification Class</th>
                    <th className="p-2">Precision</th>
                    <th className="p-2">Recall</th>
                    <th className="p-2">F1</th>
                    <th className="p-2">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {PER_CLASS_METRICS.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-semibold text-slate-900">{c.className}</td>
                      <td className="p-2 font-mono font-bold text-blue-700">{c.precision}</td>
                      <td className="p-2 font-mono font-bold text-purple-700">{c.recall}</td>
                      <td className="p-2 font-mono font-bold text-emerald-700">{c.f1}</td>
                      <td className="p-2 font-mono text-slate-500">{c.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Model Deployment Artifact: <strong className="font-mono text-slate-800">guardian_angel_v2.4.onnx</strong></span>
            <span className="text-emerald-700 font-bold">18ms Latency / Frame</span>
          </div>
        </div>

      </div>

    </div>
  );
}
