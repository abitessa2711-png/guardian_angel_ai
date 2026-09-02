import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Pause, 
  CheckCircle2, 
  BarChart2, 
  Layers, 
  Zap, 
  Sliders, 
  Activity, 
  Info,
  TrendingUp,
  FileCheck,
  ExternalLink
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

export const DATASET_OPTIONS = [
  { id: 'FER-2013', name: 'FER-2013 (Facial Expressions - 35,887 samples)', bestFor: 'Fear, Sad, Angry, Neutral', source: 'Kaggle' },
  { id: 'CK+', name: 'CK+ (Facial Expression Benchmark - 593 sequences)', bestFor: 'FACS Action Units', source: 'Kaggle / PMC' },
  { id: 'UCF-Crime', name: 'UCF-Crime (Surveillance Anomalies & Assault - 1,900 clips)', bestFor: 'CCTV Abuse, Assault, Fighting', source: 'UCF / Kaggle' },
  { id: 'RLVS', name: 'RLVS (Real-Life Violence Situations - 2,000 clips)', bestFor: 'Real-Life Violence Detection', source: 'Kaggle / PMC' },
  { id: 'Violent-Flows', name: 'Violent-Flows ViF (Crowd Violence - 246 clips)', bestFor: 'Public Video Violence', source: 'PMC Research' },
  { id: 'ShanghaiTech', name: 'ShanghaiTech Campus (Surveillance Anomaly - 437 clips)', bestFor: 'Pedestrian Anomaly Detection', source: 'GitHub / PMC' },
  { id: 'IDD', name: 'Indian Driving Dataset IDD (Road + Pedestrians - 10,000 frames)', bestFor: 'Indian Traffic Conditions', source: 'Kaggle' },
];

export default function AITrainingEvaluationView() {
  const [modelArch, setModelArch] = useState('Guardian Angel YOLOv8-Pose + AffectNet v3');
  const [selectedDatasetId, setSelectedDatasetId] = useState('FER-2013');
  const [epochs, setEpochs] = useState(50);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState('0.001');
  const [isTraining, setIsTraining] = useState(false);
  const [currentTab, setCurrentTab] = useState('pipeline');

  const pipelineSteps = [
    { step: 1, name: 'Dataset Import', status: 'Completed' },
    { step: 2, name: 'Preprocessing', status: 'Completed' },
    { step: 3, name: 'Split (70/15/15)', status: 'Completed' },
    { step: 4, name: 'Model Training', status: 'Active', active: true },
    { step: 5, name: 'Evaluation', status: 'Pending' },
    { step: 6, name: 'Model Version', status: 'Pending' },
    { step: 7, name: 'Deploy Model', status: 'Pending' },
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>AI Model Training & Benchmark Evaluation Center</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">End-to-end deep learning training pipeline trained on FER-2013, CK+, UCF-Crime, RLVS, Violent-Flows, ShanghaiTech, and IDD benchmarks.</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setCurrentTab('pipeline')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'pipeline' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Training Pipeline
            </button>
            <button
              onClick={() => setCurrentTab('evaluation')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'evaluation' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evaluation & Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Demo / Research Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded text-xs flex items-center space-x-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Research Standard Notice:</strong> Training metrics and loss curves shown in this UI are <strong>demonstration/mock benchmarks</strong>. Production models undergo validation on statutory certified test splits.
        </span>
      </div>

      {/* 7-Step Training Pipeline Visualization */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
          Standard Training & Deployment Workflow
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {pipelineSteps.map((p) => (
            <div 
              key={p.step}
              className={`p-2.5 rounded border text-center flex flex-col justify-between space-y-1 ${
                p.active 
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 text-blue-900 font-bold' 
                  : p.status === 'Completed'
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="text-[10px] uppercase font-mono">Step {p.step}</span>
              <p className="text-xs font-bold leading-tight">{p.name}</p>
              <span className="text-[9px] uppercase font-mono font-bold">{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {currentTab === 'pipeline' ? (
        /* Training Configuration & Telemetry Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left: Hyperparameters Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                Hyperparameter Configurator
              </h4>

              <div className="space-y-3 mt-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model Architecture</label>
                  <select
                    value={modelArch}
                    onChange={(e) => setModelArch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Guardian Angel YOLOv8-Pose + AffectNet v3">Guardian Angel YOLOv8-Pose + AffectNet v3 (Recommended)</option>
                    <option value="MediaPipe BlazePose + Spatio-Temporal LSTM">MediaPipe BlazePose + Spatio-Temporal LSTM</option>
                    <option value="ResNet-50 Affective Classifier (FER/CK+)">ResNet-50 Affective Classifier (FER/CK+)</option>
                    <option value="SlowFast Dual-Path Violence Detector (UCF/RLVS)">SlowFast Dual-Path Violence Detector (UCF/RLVS)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Benchmark Research Dataset</label>
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    {DATASET_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} — ({opt.source})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Epochs</label>
                    <input 
                      type="number" 
                      value={epochs}
                      onChange={(e) => setEpochs(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-800 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batch Size</label>
                    <input 
                      type="number" 
                      value={batchSize}
                      onChange={(e) => setBatchSize(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-800 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Learning Rate</label>
                    <input 
                      type="text" 
                      value={learningRate}
                      onChange={(e) => setLearningRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-800 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex space-x-2">
              <button
                onClick={() => setIsTraining(!isTraining)}
                className={`w-full py-2 rounded text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer ${
                  isTraining ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTraining ? 'Pause Model Training Run' : 'Execute Model Training Job'}</span>
              </button>
            </div>
          </div>

          {/* Right: Live Training Telemetry (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Live Training Metrics (Demo / Simulated Job)
                </h4>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Dataset: {selectedDatasetId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Validation Accuracy</span>
                  <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block">94.8%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Training Loss</span>
                  <span className="text-base font-bold text-blue-700 font-mono mt-0.5 block">0.0234</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Precision</span>
                  <span className="text-base font-bold text-purple-700 font-mono mt-0.5 block">95.1%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Recall</span>
                  <span className="text-base font-bold text-purple-700 font-mono mt-0.5 block">93.1%</span>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Deployed Model Artifact:</span>
                <p className="font-mono text-[11px] text-slate-500">guardian_angel_yolov8_{selectedDatasetId.toLowerCase()}.onnx (18ms/frame)</p>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 text-center font-medium">
              Training checkpoints are automatically logged to the audit repository.
            </div>
          </div>

        </div>
      ) : (
        /* Evaluation & Confusion Matrix View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 5x5 Confusion Matrix (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Multi-Class Confusion Matrix (1,130 Test Samples)
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
              Diagonal cells reflect correct True Positive classifications.
            </div>
          </div>

          {/* Per-Class Performance Breakdown (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Per-Class Precision, Recall & F1 Benchmarks
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px]">
                      <th className="p-2">Class</th>
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
              <span className="text-slate-500 font-medium">ROC-AUC Score: <strong className="font-mono text-orange-700">0.972 (High Quality)</strong></span>
              <span className="text-emerald-700 font-bold">18ms Inference Latency</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
