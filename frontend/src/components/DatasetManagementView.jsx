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
  Download,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const BENCHMARK_DATASETS = [
  {
    id: 'DS-FER2013',
    name: 'FER-2013 (Facial Expression Recognition)',
    bestFor: 'Fear, Sad, Angry, Neutral facial expressions',
    source: 'Kaggle',
    sourceUrl: 'https://www.kaggle.com/datasets/pankaj4321/fer-2013-facial-expression-dataset',
    type: 'Grayscale 48x48 Images',
    samples: 35887,
    classes: 7,
    version: 'v1.0 (Standard)',
    status: 'Ready for Training',
    size: '287 MB',
    lastUpdated: 'Standard Benchmark'
  },
  {
    id: 'DS-CKPLUS',
    name: 'CK+ (Extended Cohn-Kanade Dataset)',
    bestFor: 'Facial expression training/evaluation & Action Units',
    source: 'Kaggle / PMC',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10280470/',
    type: 'Image Sequences & FACS AUs',
    samples: 593,
    classes: 8,
    version: 'v2.0',
    status: 'Ready for Training',
    size: '1.2 GB',
    lastUpdated: 'Research Standard'
  },
  {
    id: 'DS-UCF-CRIME',
    name: 'UCF-Crime Surveillance Dataset',
    bestFor: 'CCTV abnormal activities, Abuse, Assault, Fighting, Accidents',
    source: 'Kaggle + Official UCF',
    sourceUrl: 'https://www.kaggle.com/datasets/bypktt/ucf-crimes',
    type: 'Untrimmed Surveillance MP4',
    samples: 1900,
    classes: 13,
    version: 'v1.0',
    status: 'Ready for Training',
    size: '110 GB',
    lastUpdated: 'CCTV Standard'
  },
  {
    id: 'DS-RLVS',
    name: 'RLVS (Real-Life Violence Situations)',
    bestFor: 'Real-life violence detection & physical altercation',
    source: 'Kaggle / PMC',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13039427/',
    type: 'Annotated Video Clips (MP4)',
    samples: 2000,
    classes: 2,
    version: 'v1.0',
    status: 'Ready for Training',
    size: '4.8 GB',
    lastUpdated: 'Violence Benchmark'
  },
  {
    id: 'DS-VIOLENT-FLOWS',
    name: 'Violent-Flows (ViF)',
    bestFor: 'Crowd violence detection in public surveillance videos',
    source: 'Official Research / PMC',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13039427/',
    type: 'Crowd Surveillance Clips',
    samples: 246,
    classes: 2,
    version: 'v1.0',
    status: 'Ready for Training',
    size: '1.6 GB',
    lastUpdated: 'Research Benchmark'
  },
  {
    id: 'DS-SHANGHAITECH',
    name: 'ShanghaiTech Campus Dataset',
    bestFor: 'Real surveillance / anomaly detection & pedestrian behavior',
    source: 'Official GitHub / PMC',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13039427/',
    type: '13-Camera CCTV Streams',
    samples: 437,
    classes: 13,
    version: 'v1.2',
    status: 'Ready for Training',
    size: '38 GB',
    lastUpdated: 'Campus Surveillance'
  },
  {
    id: 'DS-IDD',
    name: 'Indian Driving Dataset (IDD)',
    bestFor: 'Road + person + animal + vehicle detection (Indian Traffic)',
    source: 'Kaggle (YOLO Format)',
    sourceUrl: 'https://www.kaggle.com/datasets/redzapdos123/indian-driving-dataset-detections-yolov11',
    type: 'High-Res Frames + YOLO Annotations',
    samples: 10000,
    classes: 34,
    version: 'v1.1',
    status: 'Ready for Training',
    size: '14.2 GB',
    lastUpdated: 'Indian Context Standard'
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
  { id: 'STRUGGLE', label: 'STRUGGLE', color: 'bg-rose-200 text-rose-900 border-rose-400' },
];

export default function DatasetManagementView() {
  const [datasets, setDatasets] = useState(BENCHMARK_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState(BENCHMARK_DATASETS[0]);
  const [selectedLabel, setSelectedLabel] = useState('FEAR');
  const [search, setSearch] = useState('');
  const [annotationSaved, setAnnotationSaved] = useState(false);

  const filteredDatasets = datasets.filter(ds => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return ds.name.toLowerCase().includes(q) ||
             ds.bestFor.toLowerCase().includes(q) ||
             ds.source.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApplyAnnotation = () => {
    setAnnotationSaved(true);
    setTimeout(() => setAnnotationSaved(false), 2000);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>AI Dataset Management & Benchmark Research Repository</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Integrates standard international & national benchmark datasets for facial emotion, CCTV violence, stalking, and anomaly detection.</p>
        </div>

        <button 
          onClick={() => alert('Dataset Import dialog: Upload CCTV footage, video clips, or CSV annotations')}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Custom Dataset</span>
        </button>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Integrated Benchmarks</span>
          <span className="text-xl font-bold text-slate-900 font-mono">7 Research Datasets</span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Kaggle, UCF & PMC Sources</span>
        </div>
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Training Samples</span>
          <span className="text-xl font-bold text-purple-700 font-mono">51,063 Samples</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Images, Frames & Video Clips</span>
        </div>
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Annotation Coverage</span>
          <span className="text-xl font-bold text-blue-700 font-mono">8 Core Classes</span>
          <span className="text-[11px] text-blue-600 block mt-0.5">Fear, Distress, Stalking, Struggle</span>
        </div>
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Storage Footprint</span>
          <span className="text-xl font-bold text-slate-900 font-mono">170.1 GB</span>
          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">Encrypted NVMe Array</span>
        </div>
      </div>

      {/* Main Grid: Datasets Catalog (7 cols) & Live Annotation Studio (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Datasets Catalog (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Standard Benchmark Datasets
            </h4>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter datasets..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {filteredDatasets.map(ds => {
              const isSelected = selectedDataset.id === ds.id;

              return (
                <div
                  key={ds.id}
                  onClick={() => setSelectedDataset(ds)}
                  className={`p-3.5 flex items-start justify-between cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{ds.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-bold">{ds.version}</span>
                    </div>
                    
                    {/* Best For */}
                    <p className="text-[11px] text-blue-900 font-semibold">
                      <strong>Best For:</strong> {ds.bestFor}
                    </p>

                    {/* Source citation */}
                    <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                      <span>Source: <strong>{ds.source}</strong></span>
                      <a 
                        href={ds.sourceUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-0.5">
                      <span>Type: <strong className="text-slate-700">{ds.type}</strong></span>
                      <span>Samples: <strong className="text-slate-700">{ds.samples.toLocaleString()}</strong></span>
                      <span>Classes: <strong className="text-slate-700">{ds.classes}</strong></span>
                      <span>Size: <strong className="text-slate-700">{ds.size}</strong></span>
                    </div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800">
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
        <div className="lg:col-span-5 bg-white rounded border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dataset Annotation Studio</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedDataset.name}</h4>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Sample #0142
              </span>
            </div>

            {/* Video Frame Canvas Preview */}
            <div className="mt-3 relative aspect-video bg-slate-950 rounded overflow-hidden border border-slate-300">
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
                {selectedDataset.type} • RGB
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
                <span>Annotation Saved to Dataset Manifest</span>
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
