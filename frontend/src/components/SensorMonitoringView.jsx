import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Wifi, 
  Zap, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

export default function SensorMonitoringView({ isDemoActive = false, demoStep = 0 }) {
  const { t, language } = useLanguage();

  // Simulated live sensor stream data state
  const [tempHistory, setTempHistory] = useState([
    { time: '10:00', temp: 31.2, humidity: 55, gas: 110, safeLimit: 38 },
    { time: '10:05', temp: 31.8, humidity: 54, gas: 115, safeLimit: 38 },
    { time: '10:10', temp: 32.1, humidity: 53, gas: 120, safeLimit: 38 },
    { time: '10:15', temp: 32.6, humidity: 52, gas: 128, safeLimit: 38 },
    { time: '10:20', temp: 33.0, humidity: 50, gas: 135, safeLimit: 38 },
    { time: '10:25', temp: 33.8, humidity: 48, gas: 150, safeLimit: 38 },
    { time: '10:30', temp: 34.5, humidity: 46, gas: 180, safeLimit: 38 }
  ]);

  const [currentTemp, setCurrentTemp] = useState(33.2);
  const [currentHumidity, setCurrentHumidity] = useState(52);
  const [currentGas, setCurrentGas] = useState(135);
  const [esp32Status, setEsp32Status] = useState('ONLINE');

  useEffect(() => {
    if (isDemoActive) {
      if (demoStep >= 5 && demoStep < 13) {
        setCurrentTemp(44.5);
        setCurrentHumidity(32);
        setCurrentGas(620);
      } else if (demoStep >= 2 && demoStep < 5) {
        setCurrentTemp(38.0);
        setCurrentHumidity(42);
        setCurrentGas(280);
      } else {
        setCurrentTemp(32.0);
        setCurrentHumidity(54);
        setCurrentGas(110);
      }
    } else {
      const interval = setInterval(() => {
        const randTemp = +(31.5 + Math.random() * 2.5).toFixed(1);
        const randHum = Math.floor(48 + Math.random() * 8);
        const randGas = Math.floor(100 + Math.random() * 45);
        setCurrentTemp(randTemp);
        setCurrentHumidity(randHum);
        setCurrentGas(randGas);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setTempHistory(prev => [
          ...prev.slice(-14),
          { time: timeStr, temp: randTemp, humidity: randHum, gas: randGas, safeLimit: 38 }
        ]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isDemoActive, demoStep]);

  const getTempStatus = (val) => {
    if (val >= 40) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' };
    if (val >= 35) return { label: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40' };
    return { label: 'NORMAL', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  };

  const getHumStatus = (val) => {
    if (val < 35 || val > 75) return { label: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40' };
    return { label: 'NORMAL', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  };

  const getGasStatus = (val) => {
    if (val >= 500) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' };
    if (val >= 250) return { label: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40' };
    return { label: 'NORMAL', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  };

  const tStatus = getTempStatus(currentTemp);
  const hStatus = getHumStatus(currentHumidity);
  const gStatus = getGasStatus(currentGas);

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-sky-400" />
            <span>{t('sensors')}</span>
          </h2>
          <p className="text-2xs text-slate-400 mt-0.5">
            {t('esp32_gateway')} & Multi-Zone Environmental Telemetry Feed
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-3 md:mt-0 text-2xs">
          <span className="flex items-center space-x-1.5 bg-slate-900 border border-surveillance-border px-2.5 py-1 rounded text-slate-300">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            <span>GATEWAY: ESP32-MESH-V2 (192.168.4.1)</span>
          </span>
          <span className="flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-1 rounded text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{esp32Status}</span>
          </span>
        </div>
      </div>

      {/* 4 Core Sensor Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Ambient Temperature */}
        <div className={`p-4 rounded-lg border transition-all ${tStatus.bg} ${tStatus.border} shadow-cmd`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700">
                <Thermometer className={`h-5 w-5 ${tStatus.color}`} />
              </div>
              <div>
                <p className="text-2xs text-slate-400 font-bold uppercase">{t('temperature')}</p>
                <p className="text-xl font-black text-white">{currentTemp} <span className="text-xs font-normal text-slate-400">°C</span></p>
              </div>
            </div>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${tStatus.border} ${tStatus.color}`}>
              {tStatus.label}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[10px] text-slate-400">
            <span>{t('safe_range')}: &lt;35.0°C</span>
            <span className="text-red-400 font-bold">{t('critical_threshold')}: &gt;40.0°C</span>
          </div>
        </div>

        {/* 2. Relative Humidity */}
        <div className={`p-4 rounded-lg border transition-all ${hStatus.bg} ${hStatus.border} shadow-cmd`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700">
                <Droplets className={`h-5 w-5 ${hStatus.color}`} />
              </div>
              <div>
                <p className="text-2xs text-slate-400 font-bold uppercase">{t('humidity')}</p>
                <p className="text-xl font-black text-white">{currentHumidity} <span className="text-xs font-normal text-slate-400">% RH</span></p>
              </div>
            </div>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${hStatus.border} ${hStatus.color}`}>
              {hStatus.label}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[10px] text-slate-400">
            <span>{t('safe_range')}: 45–65%</span>
            <span className="text-amber-400 font-bold">DRY STATIC: &lt;35%</span>
          </div>
        </div>

        {/* 3. Volatile Gas Index */}
        <div className={`p-4 rounded-lg border transition-all ${gStatus.bg} ${gStatus.border} shadow-cmd`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700">
                <Wind className={`h-5 w-5 ${gStatus.color}`} />
              </div>
              <div>
                <p className="text-2xs text-slate-400 font-bold uppercase">{t('gas_level')}</p>
                <p className="text-xl font-black text-white">{currentGas} <span className="text-xs font-normal text-slate-400">PPM</span></p>
              </div>
            </div>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${gStatus.border} ${gStatus.color}`}>
              {gStatus.label}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[10px] text-slate-400">
            <span>{t('safe_range')}: &lt;200 PPM</span>
            <span className="text-red-400 font-bold">{t('critical_threshold')}: &gt;500 PPM</span>
          </div>
        </div>

        {/* 4. ESP32 Gateway Node Status */}
        <div className="p-4 rounded-lg border bg-surveillance-panel border-surveillance-border shadow-cmd">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700">
                <Cpu className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-2xs text-slate-400 font-bold uppercase">{t('esp32_gateway')}</p>
                <p className="text-base font-black text-white">ESP32-S3 MESH</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              ACTIVE
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[10px] text-slate-400">
            <span>{t('battery_level')}: 4.15V (Mains)</span>
            <span>RSSI: -54 dBm</span>
          </div>
        </div>

      </div>

      {/* Real-time Environmental Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        
        {/* Temperature History Chart */}
        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-white uppercase flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-sky-400" />
              <span>Thermal Profile Trend (°C vs Critical 38°C Limit)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Sampling: 3s</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempHistory}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[25, 50]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#1e2d4a', fontSize: '11px' }} />
                <Area type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" name="Temp (°C)" />
                <Line type="monotone" dataKey="safeLimit" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" name="Max Safety Limit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volatile Gas PPM Chart */}
        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-white uppercase flex items-center space-x-2">
              <Wind className="h-4 w-4 text-sky-400" />
              <span>Volatile Gas & Airborne Chemical Accumulation (PPM)</span>
            </h3>
            <span className="text-[10px] text-slate-400">MQ-135 Sensor</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempHistory}>
                <defs>
                  <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[0, 800]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#1e2d4a', fontSize: '11px' }} />
                <Area type="monotone" dataKey="gas" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#gasGradient)" name="Gas (PPM)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Sensor Node Matrix Table */}
      <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center space-x-2">
          <Activity className="h-4 w-4 text-sky-400" />
          <span>Multi-Node Telemetry Sensor Matrix (External IoT Nodes)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-2xs border-collapse">
            <thead>
              <tr className="border-b border-surveillance-border bg-slate-900/60 text-slate-400 uppercase">
                <th className="p-2.5">Node ID</th>
                <th className="p-2.5">Monitored Zone</th>
                <th className="p-2.5">Temp (°C)</th>
                <th className="p-2.5">Humidity (% RH)</th>
                <th className="p-2.5">Gas (PPM)</th>
                <th className="p-2.5">ESP32 Status</th>
                <th className="p-2.5">Safety Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/40">
                <td className="p-2.5 font-bold text-sky-400">NODE-01</td>
                <td className="p-2.5 text-white">Chemical Mixing Room 1 (External Duct)</td>
                <td className="p-2.5 font-bold text-slate-200">{currentTemp}°C</td>
                <td className="p-2.5">{currentHumidity}%</td>
                <td className="p-2.5">{currentGas} PPM</td>
                <td className="p-2.5 text-emerald-400 font-bold">ONLINE</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">NORMAL</span></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-2.5 font-bold text-sky-400">NODE-02</td>
                <td className="p-2.5 text-white">Raw Nitrate & Sulphur Store Gate</td>
                <td className="p-2.5 font-bold text-slate-200">30.8°C</td>
                <td className="p-2.5">58%</td>
                <td className="p-2.5">90 PPM</td>
                <td className="p-2.5 text-emerald-400 font-bold">ONLINE</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">NORMAL</span></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-2.5 font-bold text-sky-400">NODE-03</td>
                <td className="p-2.5 text-white">Pulverizer & Grinding Shed Outer Perch</td>
                <td className="p-2.5 font-bold text-slate-200">34.2°C</td>
                <td className="p-2.5">44%</td>
                <td className="p-2.5">180 PPM</td>
                <td className="p-2.5 text-emerald-400 font-bold">ONLINE</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">CAUTION</span></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-2.5 font-bold text-sky-400">NODE-04</td>
                <td className="p-2.5 text-white">Explosive Magazine Vault Entry Perimeter</td>
                <td className="p-2.5 font-bold text-slate-200">28.4°C</td>
                <td className="p-2.5">60%</td>
                <td className="p-2.5">40 PPM</td>
                <td className="p-2.5 text-emerald-400 font-bold">ONLINE</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">SECURE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
