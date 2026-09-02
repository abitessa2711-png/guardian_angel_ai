import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Layers, 
  Sliders,
  TrendingUp
} from 'lucide-react';

export const PAST_TRAINING_RUNS = [
  {
    runId: 'RUN-2025-04',
    modelName: 'Guardian Angel YOLOv8-Pose + AffectNet',
    dataset: 'Tamil Nadu Women Distress Benchmark v2.4',
    epochs: 50,
    batchSize: 32,
    learningRate: '0.001',
    finalAccuracy: '94.8%',
    finalLoss: '0.0234',
    status: 'Deployed in Production',
    date: '12 May 2025'
  },
  {
    runId: 'RUN-2025-03',
    modelName: 'MediaPipe BlazePose + Spatio-Temporal LSTM',
    dataset: 'Urban CCTV Harassment Sequences v1.8',
    epochs: 40,
    batchSize: 16,
    learningRate: '0.0005',
    finalAccuracy: '92.1%',
    finalLoss: '0.0381',
    status: 'Archived',
    date: '08 May 2025'
  },
  {
    runId: 'RUN-2025-02',
    modelName: 'ResNet-50 Micro-Expression Classifier',
    dataset: 'Tamil Nadu Women Distress Benchmark v2.0',
    epochs: 60,
    batchSize: 32,
    learningRate: '0.001',
    finalAccuracy: '90.4%',
    finalLoss: '0.0450',
    status: 'Archived',
    date: '28 Apr 2025'
  }
];

export default function AIModelTrainingView() {
  const [modelArch, setModelArch] = useState('YOLOv8-Pose + AffectNet v3');
  const [datasetSelect, setDatasetSelect] = useState('Tamil Nadu Women Distress & Expression Benchmark');
  const [epochs, setEpochs] = useState(50);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState('0.001');
  const [optimizer, setOptimizer] = useState('AdamW');
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(38);

  const pipelineSteps = [
    { step: 1, name: 'Dataset Selection', status: 'Completed' },
    { step: 2, name: 'Preprocessing & Augmentation', status: 'Completed' },
    { step: 3, name: 'Train / Val / Test Split (70/15/15)', status: 'Completed' },
    { step: 4, name: 'Model Training', status: 'Active', active: true },
    { step: 5, name: 'Model Evaluation', status: 'Pending' },
    { step: 6, name: 'Deployment', status: 'Pending' },
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>AI Model Training & Deployment Center</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Train, tune hyperparameters, and deploy deep learning computer vision models for women safety.</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 text-purple-800 text-xs px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-bold">
          <Zap className="w-4 h-4 text-purple-600 shrink-0" />
          <span>NVIDIA RTX 6000 Ada Server: Ready (24GB VRAM)</span>
        </div>
      </div>

      {/* Training Pipeline Workflow Diagram */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Deep Learning Pipeline Execution Workflow
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {pipelineSteps.map((p) => (
            <div 
              key={p.step}
              className={`p-3 rounded-lg border text-center flex flex-col justify-between space-y-1.5 ${
                p.active 
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 text-blue-900 font-bold' 
                  : p.status === 'Completed'
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 text-xs">
                <span>Step {p.step}</span>
                {p.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="text-xs font-semibold leading-tight">{p.name}</p>
              <span className="text-[10px] uppercase font-mono">{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Training Hyperparameters Form (6 cols) & Active Training Monitor (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Hyperparameters Form (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Model Training Configuration
            </h4>

            <div className="space-y-3 mt-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Model Architecture</label>
                <select
                  value={modelArch}
                  onChange={(e) => setModelArch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="YOLOv8-Pose + AffectNet v3">YOLOv8-Pose + AffectNet v3 (Recommended)</option>
                  <option value="MediaPipe BlazePose + Spatio-Temporal LSTM">MediaPipe BlazePose + Spatio-Temporal LSTM</option>
                  <option value="ResNet-50 Affective Classifier">ResNet-50 Affective Classifier</option>
                  <option value="Custom Vision Transformer (ViT-Base)">Custom Vision Transformer (ViT-Base)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Training Dataset</label>
                <select
                  value={datasetSelect}
                  onChange={(e) => setDatasetSelect(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="Tamil Nadu Women Distress & Expression Benchmark">Tamil Nadu Women Distress & Expression Benchmark (4,820 samples)</option>
                  <option value="Urban CCTV Harassment & Trailing Sequences">Urban CCTV Harassment & Trailing Sequences (2,350 samples)</option>
                  <option value="Physical Altercation & Struggle Pose Annotations">Physical Altercation & Struggle Pose Annotations (1,980 samples)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Epochs</label>
                  <input 
                    type="number" 
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-800 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batch Size</label>
                  <input 
                    type="number" 
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-800 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Learning Rate</label>
                  <input 
                    type="text" 
                    value={learningRate}
                    onChange={(e) => setLearningRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-800 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Optimizer</label>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="AdamW">AdamW (Weight Decay: 0.01)</option>
                    <option value="SGD">SGD with Momentum</option>
                    <option value="RMSprop">RMSprop</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dataset Split</label>
                  <div className="bg-slate-100 px-2.5 py-1.5 rounded border border-slate-200 font-mono text-xs font-bold text-slate-700">
                    70% Train / 15% Val / 15% Test
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex space-x-2">
            <button
              onClick={() => {
                setIsTraining(!isTraining);
                if (!isTraining) alert('Started training iteration on GPU node #0.');
              }}
              className={`w-full py-2 rounded text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer ${
                isTraining ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTraining ? 'Pause Model Training' : 'Launch Model Training Job'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Training Telemetry & Real-Time Loss (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real-time Training Monitor</span>
                <h4 className="text-sm font-bold text-slate-900">Job #TRAIN-2025-05</h4>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded animate-pulse">
                GPU LOAD: 88%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Epoch Progress: {currentEpoch} / {epochs}</span>
                <span className="text-blue-700 font-mono">76.0%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: '76%' }}></div>
              </div>
            </div>

            {/* Metrics Telemetry Grid */}
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
                <span className="text-[10px] text-slate-400 uppercase font-bold block">F1-Score</span>
                <span className="text-base font-bold text-purple-700 font-mono mt-0.5 block">0.938</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Time Remaining</span>
                <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">12m 45s</span>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Checkpoints Saved:</span>
              <p className="font-mono text-[11px] text-slate-500">checkpoint_epoch_35_acc_0.942.pt (Saved to NVMe)</p>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center font-medium">
            Training parameters and checkpoints are logged for regulatory audit.
          </div>
        </div>

      </div>

      {/* Training History Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Past Model Training Runs & Checkpoints
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Run ID</th>
                <th className="py-2.5 px-4">Model Architecture</th>
                <th className="py-2.5 px-4">Dataset</th>
                <th className="py-2.5 px-3">Epochs</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Loss</th>
                <th className="py-2.5 px-3">Deployment Status</th>
                <th className="py-2.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {PAST_TRAINING_RUNS.map(run => (
                <tr key={run.runId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{run.runId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{run.modelName}</td>
                  <td className="py-3 px-4 text-slate-600">{run.dataset}</td>
                  <td className="py-3 px-3 font-mono">{run.epochs}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">{run.finalAccuracy}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{run.finalLoss}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      run.status.includes('Deployed') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{run.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
