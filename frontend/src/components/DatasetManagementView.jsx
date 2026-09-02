import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  FileVideo, 
  Image, 
  FileSpreadsheet, 
  Tag, 
  CheckCircle2, 
  Search, 
  Plus, 
  Layers,
  FolderOpen,
  Download
} from 'lucide-react';

export const INITIAL_DATASETS = [
  {
    id: 'DS-WOMEN-01',
    name: 'Tamil Nadu Women Distress & Expression Benchmark',
    type: 'Video Clips & Bounding Boxes',
    category: 'Women Distress',
    samples: 4820,
    classes: 7,
    version: 'v2.4',
    status: 'Ready for Training',
    size: '18.4 GB',
    lastUpdated: '12 May 2025'
  },
  {
    id: 'DS-HARASS-02',
    name: 'Urban CCTV Harassment & Trailing Sequences',
    type: 'Multi-Camera Trajectory CSV + MP4',
    category: 'Harassment / Stalking',
    samples: 2350,
    classes: 5,
    version: 'v1.8',
    status: 'Ready for Training',
    size: '12.1 GB',
    lastUpdated: '10 May 2025'
  },
  {
    id: 'DS-STRUGGLE-03',
    name: 'Physical Altercation & Struggle Pose Annotations',
    type: '2D/3D Pose Keypoints (COCO Format)',
    category: 'Physical Struggle',
    samples: 1980,
    classes: 4,
    version: 'v1.2',
    status: 'Annotating (84% Complete)',
    size: '6.8 GB',
    lastUpdated: '08 May 2025'
  },
  {
    id: 'DS-ISOLATED-04',
    name: 'Subway & Low-Light Solo Pedestrian Night Dataset',
    type: 'Thermal & Enhanced RGB Imagery',
    category: 'Normal vs Vulnerable',
    samples: 3400,
    classes: 3,
    version: 'v2.0',
    status: 'Ready for Training',
    size: '9.5 GB',
    lastUpdated: '04 May 2025'
  }
];

export const ANNOTATION_LABELS = [
  { id: 'NORMAL', label: 'NORMAL', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'FEAR', label: 'FEAR', color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'DISTRESS', label: 'DISTRESS', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'FOLLOWING', label: 'FOLLOWING', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'STALKING', label: 'STALKING', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'CHASING', label: 'CHASING', color: 'bg-red-200 text-red-900 border-red-400' },
  { id: 'AGGRESSIVE', label: 'AGGRESSIVE', color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'PHYSICAL_STRUGGLE', label: 'PHYSICAL STRUGGLE', color: 'bg-rose-200 text-rose-900 border-rose-400' },
  { id: 'SUSPICIOUS', label: 'SUSPICIOUS', color: 'bg-amber-100 text-amber-800 border-amber-300' },
];

export default function DatasetManagementView() {
  const [datasets, setDatasets] = useState(INITIAL_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState(INITIAL_DATASETS[0]);
  const [selectedLabel, setSelectedLabel] = useState('FEAR');
  const [annotationSaved, setAnnotationSaved] = useState(false);

  const handleApplyAnnotation = () => {
    setAnnotationSaved(true);
    setTimeout(() => setAnnotationSaved(false), 2000);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>AI Dataset Management & Frame Annotation Studio</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Upload surveillance footage, bounding box metadata, and assign Ground Truth behavioral labels for AI model training.</p>
        </div>

        <button 
          onClick={() => alert('Dataset upload dialog initialized')}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Footage Batch</span>
        </button>
      </div>

      {/* Dataset Ingestion & Category Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Training Clips</span>
          <span className="text-xl font-bold text-slate-900 font-mono">12,550 Frames</span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">4 Production Datasets</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Ground Truth Classes</span>
          <span className="text-xl font-bold text-purple-700 font-mono">9 Key Classes</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Pose, Emotion & Vectors</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Annotated Coverage</span>
          <span className="text-xl font-bold text-blue-700 font-mono">94.2%</span>
          <span className="text-[11px] text-blue-600 block mt-0.5">Verified by Cyber Cell</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Storage Footprint</span>
          <span className="text-xl font-bold text-slate-900 font-mono">46.8 GB</span>
          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">Encrypted NVMe Array</span>
        </div>
      </div>

      {/* Main Grid: Dataset Table (7 cols) & Live Annotation Workspace (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Datasets Catalog (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Surveillance Training Datasets
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">COCO & Pascal VOC Formats</span>
          </div>

          <div className="divide-y divide-slate-100">
            {datasets.map(ds => {
              const isSelected = selectedDataset.id === ds.id;

              return (
                <div
                  key={ds.id}
                  onClick={() => setSelectedDataset(ds)}
                  className={`p-3.5 flex items-start justify-between cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{ds.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-bold">{ds.version}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">Type: {ds.type}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                      <span>Samples: <strong className="text-slate-800">{ds.samples.toLocaleString()}</strong></span>
                      <span>Classes: <strong className="text-slate-800">{ds.classes}</strong></span>
                      <span>Size: <strong className="text-slate-800">{ds.size}</strong></span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800">
                      {ds.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">{ds.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Frame Annotation Tool (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Frame Annotation Studio</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedDataset.name}</h4>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Frame #0421
              </span>
            </div>

            {/* Video Frame Canvas Preview */}
            <div className="mt-3 relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-300">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop" 
                alt="Annotation frame"
                className="w-full h-full object-cover brightness-95"
              />
              
              {/* Annotation Bounding Box Preview */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-28 h-32 border-2 border-red-500 bg-red-500/15 rounded flex items-start p-1 shadow-lg">
                  <span className="bg-red-600 text-white font-bold text-[9px] px-1 py-0.5 rounded">
                    LABEL: {selectedLabel}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-0.5 rounded">
                1920x1080 • RGB
              </div>
            </div>

            {/* Ground Truth Label Selector Chips */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Assign Ground Truth Behavioral Label
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ANNOTATION_LABELS.map(tag => {
                  const isSelected = selectedLabel === tag.id;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedLabel(tag.id)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : `${tag.color} hover:opacity-80`
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {annotationSaved && (
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Annotation Saved to Manifest</span>
              </span>
            )}
            {!annotationSaved && <span className="text-[11px] text-slate-400">Shortcut: Press [Enter] to save</span>}

            <button
              onClick={handleApplyAnnotation}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
            >
              Save Ground Truth Label
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
