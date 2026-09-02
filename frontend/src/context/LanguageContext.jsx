import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Header & Brand
    title: "PYROGUARDIAN AI",
    subtitle: "INDUSTRIAL SAFETY & PREDICTIVE RISK COMMAND PLATFORM (FIREWORKS MSME)",
    tagline: "Designed for Government & MSME Safety Operations",
    active_tamil_tag: "வருமுன் காப்போம்",
    
    // Navigation Menu Items
    command_center: "Command Center",
    live_monitoring: "Live Monitoring",
    cctv: "16 CCTV Monitor Wall",
    risk_analysis: "AI Risk Analysis",
    ai_vision: "AI Vision & PPE",
    sensors: "Sensor Monitoring",
    worker_safety: "Worker Safety",
    incidents: "Incident Management",
    alerts: "Alerts & Notifications",
    factory_map: "Factory / Zone Map",
    heatmap: "Zone Hazard Map",
    reports: "Reports & Analytics",
    risk_history: "AI Risk History",
    system_health: "System Health",
    settings: "System Settings",
    project_overview: "Project Architecture",
    users: "User Access Control",
    cameras: "Camera Node Config",
    area_focus: "Zone Focus Vision",
    dashboard: "Operations Overview",
    live_surveillance: "Real-Time Tracking",

    // System Status & Header Badges
    system_status: "SYSTEM STATUS",
    secure: "SAFE / NORMAL",
    warning: "CAUTION / ELEVATED",
    critical: "CRITICAL HAZARD",
    factory_status: "FACTORY STATUS",
    network_status: "NETWORK STATUS",
    sensor_connectivity: "SENSORS CONNECTED",
    build: "BUILD",
    build_version: "PG-AI-MSME-2026-v2.4",
    online_nodes: "ONLINE SENSORS",
    offline: "OFFLINE",
    live_core_online: "AI ENGINE ONLINE",
    core_disconnected: "AI CORE OFFLINE",
    live_feed: "LIVE CCTV",
    safe_external_observation: "EXTERNAL SAFE OBSERVATION POINT",

    // Key Environmental Metrics
    temperature: "Ambient Temperature",
    humidity: "Relative Humidity",
    gas_level: "Volatile Gas (PPM)",
    air_quality: "Air Quality Index",
    worker_count: "Workers Detected",
    restricted_zone_entries: "Restricted Zone Breaches",
    ppe_compliance: "PPE Compliance",
    active_alerts: "Active Alerts",
    sensor_health: "Sensor Node Health",
    overall_risk_score: "Overall Risk Index",
    risk_level: "Current Risk Level",
    last_updated: "Last Telemetry Sync",

    // Risk Analysis Factors
    temp_anomaly: "Thermal Anomaly",
    humidity_variation: "Dry Humidity Hazard",
    worker_density: "Worker Density Surge",
    restricted_activity: "Restricted Zone Activity",
    ppe_violation: "PPE Non-Compliance",
    predicted_risk: "Predicted Risk (Next 15m)",
    current_risk: "Current Risk",
    previous_risk: "Baseline Risk",
    contributing_factors: "Contributing Risk Factors",
    preventive_action: "Recommended Preventive Action",
    early_warning_note: "Predictive early warning based on observable telemetry and historical patterns.",

    // Sensor Thresholds
    safe_range: "Safe Range",
    warning_threshold: "Warning Limit",
    critical_threshold: "Critical Threshold",
    esp32_gateway: "ESP32 IoT Gateway Node",
    battery_level: "Battery Voltage",
    last_communication: "Last Heartbeat",

    // Incident Lifecycle
    incident_lifecycle: "INCIDENT RESPONSE LIFECYCLE",
    stage_detected: "1. ANOMALY DETECTED",
    stage_alert: "2. ALERT GENERATED",
    stage_acknowledged: "3. SUPERVISOR ACKNOWLEDGED",
    stage_action: "4. ACTION TAKEN / VENTILATION",
    stage_resolved: "5. VERIFIED & RESOLVED",
    escalated: "ESCALATED",
    dispatched: "DISPATCHED",
    resolved: "RESOLVED",
    new_alert: "NEW ALARM",
    acknowledge: "ACKNOWLEDGE",
    dispatch_team: "DISPATCH RESPONSE TEAM",
    mark_resolved: "MARK RESOLVED",
    view_incident: "VIEW INCIDENT",
    assign_supervisor: "ASSIGN SUPERVISOR",
    add_notes: "ADD RESOLUTION LOG",

    // Simulator
    command_simulator: "PROTOTYPE SAFETY RESPONSE SIMULATOR",
    proactive_multi_sensor_hud: "MULTI-SENSOR COGNITIVE HUD",
    start_simulation: "START SIMULATION",
    stop_simulation: "STOP SIMULATION",
    step: "STEP",
    progress: "PROGRESS",
    automated_response: "AUTOMATED RESPONSE",
    exhaust_ventilation: "EXHAUST VENTILATION FANS",
    voice_siren: "ACOUSTIC VOICE SIREN",
    mobile_push: "SUPERVISOR MOBILE DISPATCH",
    cooling_active: "MIST COOLING SYSTEM ACTIVE",

    // CCTV & Vision Overlay
    realtime_telemetry: "REAL-TIME TELEMETRY",
    audio_level: "ACOUSTIC LEVEL",
    pedestrians: "WORKER COUNT",
    pose_status: "ACTIVITY STATUS",
    threat_score: "RISK SCORE",
    proactive_critical_alert: "CRITICAL THERMAL ALERT - AUTOMATIC RESPONSE TRIGGERED",
    live_cctv_feed_matrix: "LIVE 16-ZONE EXTERNAL SURVEILLANCE WALL (SAFE OBSERVATION)",
    wall_mode: "WALL MONITOR MODE",
    console_mode: "OPERATOR CONSOLE MODE",
    close_stream_focus: "CLOSE FOCUS ZOOM",
    node_status_offline: "NODE STATUS: SENSOR OFFLINE",
    unresolved_alerts: "Unresolved Hazards",
    critical_level_incidents: "CRITICAL SAFETY INCIDENTS",
    fps: "FPS",
    latency: "LATENCY",
    streaming_active: "STREAMING ACTIVE",

    // AI Cognitive Detection Status
    ai_object_detection_status: "AI VISION & SAFETY COMPLIANCE AUDIT",
    person_detection: "WORKER DETECTION",
    vehicle_detection: "MATERIAL VEHICLE TRANSIT",
    face_id_lock: "SUPERVISOR BADGE ID",
    weapon_detection: "STATIC SPARK / METAL TOOL DETECTION",
    fight_recognition: "UNSAFE MOVEMENT / PANIC GAIT",
    smoke_fire_engine: "OPTICAL SMOKE & FLAME SCAN",
    abandoned_object_finder: "UNATTENDED CHEMICAL PACKET",
    detected: "🟢 DETECTED",
    locked: "🟢 VERIFIED",
    weapon_alert: "🔴 METAL TOOL DETECTED",
    violence_alert: "🔴 PANIC MOVEMENT DETECTED",
    fire_alert: "🔴 THERMAL SMOKE DETECTED",
    abandoned_alert: "🟡 UNATTENDED MATERIAL",
    safe_clear: "🟢 SAFE COMPLIANT",
    clear: "🟢 CLEAR",
    off: "DISABLED",
    decision_engine: "DECISION ENGINE",
    ai_target_lock: "AI CONFIDENCE RATING",
    confidence: "CONF",

    // General Units & Labels
    sec: "s",
    min: "min",
    cam: "CAM",
    location: "LOCATION / ZONE",
    risk: "RISK",
    timestamp: "TIMESTAMP",
    status: "STATUS",
    actions: "ACTIONS",
    export_pdf: "EXPORT PDF",
    export_csv: "EXPORT CSV",
    print_report: "PRINT AUDIT",
    select_camera: "SELECT ZONE CAMERA",
    focused_feed: "FOCUSED ZONE TELEMETRY HUD",
    threat_console: "SAFETY LOGS CONSOLE",
    active_caps: "ONLINE"
  },
  ta: {
    // Header & Brand
    title: "பைரோகார்டியன் AI",
    subtitle: "பட்டாசு உற்பத்தி ஆலை தொழில்சார் பாதுகாப்பு கட்டுப்பாட்டு மையம்",
    tagline: "அரசு & குறு, சிறு, நடுத்தர தொழில்களுக்கான பாதுகாப்பு கட்டமைப்பு",
    active_tamil_tag: "வருமுன் காப்போம்",
    
    // Navigation Menu Items
    command_center: "கட்டுப்பாட்டு மையம்",
    live_monitoring: "நேரலை கண்காணிப்பு",
    cctv: "16 சிசிடிவி திரை சுவர்",
    risk_analysis: "AI அபாய பகுப்பாய்வு",
    ai_vision: "AI பார்வை & கவச உடை",
    sensors: "சுற்றுச்சூழல் உணரிகள்",
    worker_safety: "தொழிலாளர் பாதுகாப்பு",
    incidents: "விபத்து மேலாண்மை",
    alerts: "எச்சரிக்கைகள் & தகவல்கள்",
    factory_map: "தொழிற்சாலை மண்டல வரைபடம்",
    heatmap: "மண்டல ஆபத்து வரைபடம்",
    reports: "அறிக்கைகள் & பகுப்பாய்வு",
    risk_history: "AI வரலாற்று பதிவுகள்",
    system_health: "கட்டமைப்பு நலம்",
    settings: "அமைப்பு அமைப்புகள்",
    project_overview: "திட்ட கட்டமைப்பு விளக்கம்",
    users: "பயனர் கணக்குகள்",
    cameras: "கேமரா முனைகள்",
    area_focus: "மண்டல சிறப்பு பார்வை",
    dashboard: "செயல்பாட்டு பார்வை",
    live_surveillance: "நேரலை கண்காணிப்பு",

    // System Status & Header Badges
    system_status: "கட்டமைப்பு நிலை",
    secure: "பாதுகாப்பானது",
    warning: "எச்சரிக்கை நிலை",
    critical: "தீவிர அபாயம்",
    factory_status: "ஆலை நிலை",
    network_status: "இணைய இணைப்பு",
    sensor_connectivity: "உணரிகள் இணைப்பு",
    build: "பதிப்பு",
    build_version: "PG-AI-MSME-2026-v2.4",
    online_nodes: "இணைக்கப்பட்ட உணரிகள்",
    offline: "செயலிழப்பு",
    live_core_online: "AI இயங்குதளம் நேரலையில்",
    core_disconnected: "AI தளம் துண்டிக்கப்பட்டது",
    live_feed: "நேரலை சிசிடிவி",
    safe_external_observation: "பாதுகாப்பான வெளி கண்காணிப்பு முனை",

    // Key Environmental Metrics
    temperature: "சுற்றுப்புற வெப்பநிலை",
    humidity: "காற்றின் ஈரப்பதம்",
    gas_level: "எரியும் வாயு அளவு (PPM)",
    air_quality: "காற்றுத் தரம்",
    worker_count: "தொழிலாளர்கள் எண்ணிக்கை",
    restricted_zone_entries: "தடைசெய்யப்பட்ட பகுதி நுழைவு",
    ppe_compliance: "கவச உடை அணிதல் விகிதம்",
    active_alerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    sensor_health: "உணரி முனைகளின் நலம்",
    overall_risk_score: "ஒட்டுமொத்த அபாய குறியீடு",
    risk_level: "தற்போதைய அபாய நிலை",
    last_updated: "கடைசி தகவல் ஒத்திசைவு",

    // Risk Analysis Factors
    temp_anomaly: "வெப்பநிலை உயர்வு முரண்பாடு",
    humidity_variation: "அதிக உலர் ஈரப்பதம்",
    worker_density: "தொழிலாளர் அடர்த்தி அதிகரிப்பு",
    restricted_activity: "தடைசெய்யப்பட்ட பகுதி செயல்பாடு",
    ppe_violation: "கவச உடை விதிமீறல்",
    predicted_risk: "கணிக்கப்பட்ட அபாயம் (அடுத்த 15 நிமி)",
    current_risk: "தற்போதைய அபாயம்",
    previous_risk: "முந்தைய அடிப்படை அபாயம்",
    contributing_factors: "காரணிகள் பகுப்பாய்வு",
    preventive_action: "பரிந்துரைக்கப்படும் தடுப்பு நடவடிக்கை",
    early_warning_note: "உணரி தரவு மற்றும் முந்தைய வடிவங்களின் அடிப்படையிலான முன்னெச்சரிக்கை மட்டுமே.",

    // Sensor Thresholds
    safe_range: "பாதுகாப்பான வரம்பு",
    warning_threshold: "எச்சரிக்கை வரம்பு",
    critical_threshold: "தீவிர அபாய வரம்பு",
    esp32_gateway: "ESP32 IoT நுழைவாயில் முனை",
    battery_level: "மின்கல மின்னழுத்தம்",
    last_communication: "கடைசி தகவல் பதிவு",

    // Incident Lifecycle
    incident_lifecycle: "விபத்து மறுமொழி சுழற்சி",
    stage_detected: "1. முரண்பாடு கண்டறிதல்",
    stage_alert: "2. எச்சரிக்கை உருவாக்கம்",
    stage_acknowledged: "3. மேற்பார்வையாளர் ஏற்பு",
    stage_action: "4. நடவடிக்கை / காற்றோட்டம்",
    stage_resolved: "5. சரிபார்க்கப்பட்டு முடிவு",
    escalated: "தீவிரப்படுத்தப்பட்டது",
    dispatched: "அனுப்பப்பட்டது",
    resolved: "தீர்க்கப்பட்டது",
    new_alert: "புதிய எச்சரிக்கை",
    acknowledge: "ஏற்றுக்கொள்",
    dispatch_team: "மீட்புக் குழுவை அனுப்பு",
    mark_resolved: "முடிந்ததாகக் குறி",
    view_incident: "விவரம் காண்க",
    assign_supervisor: "மேற்பார்வையாளரை நியமி",
    add_notes: "குறிப்பு சேர்",

    // Simulator
    command_simulator: "பாதுகாப்பு நடவடிக்கை மாதிரி சிமுலேட்டர்",
    proactive_multi_sensor_hud: "பல்-உணரி கட்டுப்பாட்டு பார்வை",
    start_simulation: "சிமுலேட்டர் தொடங்கு",
    stop_simulation: "நிறுத்து",
    step: "படி",
    progress: "முன்னேற்றம்",
    automated_response: "தானியங்கி பாதுகாப்பு நடவடிக்கை",
    exhaust_ventilation: "வெளியேற்றும் விசிறிகள் இயக்கம்",
    voice_siren: "குரல் ஒலி எச்சரிக்கை",
    mobile_push: "மேற்பார்வையாளர் மொபைல் தகவல்",
    cooling_active: "குளிர்விக்கும் அமைப்பு இயக்கம்",

    // CCTV & Vision Overlay
    realtime_telemetry: "நேரலை அளவீடுகள்",
    audio_level: "ஒலி அளவு",
    pedestrians: "தொழிலாளர் எண்ணிக்கை",
    pose_status: "செயல்பாட்டு நிலை",
    threat_score: "அபாய குறியீடு",
    proactive_critical_alert: "தீவிர வெப்ப அபாய எச்சரிக்கை - தானியங்கி காற்றோட்டம் இயக்கப்பட்டது",
    live_cctv_feed_matrix: "16-மண்டல வெளி கண்காணிப்பு சிசிடிவி சுவர்",
    wall_mode: "கண்காணிப்புச் சுவர் முறை",
    console_mode: "கன்சோல் மேலாண்மை முறை",
    close_stream_focus: "சிறப்பு பார்வையை மூடு",
    node_status_offline: "முனை செயலிழந்துள்ளது",
    unresolved_alerts: "தீர்க்கப்படாத எச்சரிக்கைகள்",
    critical_level_incidents: "தீவிர பாதுகாப்பு நிகழ்வுகள்",
    fps: "FPS",
    latency: "தாமதம்",
    streaming_active: "நேரலை இயங்குகிறது",

    // AI Cognitive Detection Status
    ai_object_detection_status: "AI பார்வை & பாதுகாப்பு தணிக்கை",
    person_detection: "தொழிலாளர் கண்டறிதல்",
    vehicle_detection: "வாகன நகர்வு",
    face_id_lock: "மேற்பார்வையாளர் அடையாள அட்டை",
    weapon_detection: "உலோக கருவி / தீப்பொறி அபாயம்",
    fight_recognition: "பதற்றமான ஓட்டம் / நெரிசல்",
    smoke_fire_engine: "புகை & தீப்பிழம்பு கண்டறிதல்",
    abandoned_object_finder: "கவனிக்கப்படாத வேதிப்பொருள் பாக்கெட்",
    detected: "🟢 கண்டறியப்பட்டது",
    locked: "🟢 சரிபார்க்கப்பட்டது",
    weapon_alert: "🔴 உலோக கருவி கண்டறியப்பட்டது",
    violence_alert: "🔴 பதற்ற இயக்கம் கண்டறியப்பட்டது",
    fire_alert: "🔴 வெப்ப புகை கண்டறியப்பட்டது",
    abandoned_alert: "🟡 கவனிக்கப்படாத பொருள்",
    safe_clear: "🟢 பாதுகாப்பானது",
    clear: "🟢 தெளிவானது",
    off: "முடக்கப்பட்டது",
    decision_engine: "முடிவெடுக்கும் தளம்",
    ai_target_lock: "AI நம்பகத்தன்மை குறியீடு",
    confidence: "நம்பகம்",

    // General Units & Labels
    sec: "விநாடி",
    min: "நிமிடம்",
    cam: "கேமரா",
    location: "மண்டலம் / பகுதி",
    risk: "அபாயம்",
    timestamp: "நேரம்",
    status: "நிலை",
    actions: "நடவடிக்கைகள்",
    export_pdf: "PDF பதிவிறக்கு",
    export_csv: "CSV பதிவிறக்கு",
    print_report: "அச்சிடு",
    select_camera: "மண்டல கேமராவைத் தேர்ந்தெடு",
    focused_feed: "சிறப்பு பார்வை விவரங்கள்",
    threat_console: "பாதுகாப்பு பதிவுகள்",
    active_caps: "நேரலையில்"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('pyroguardian_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('pyroguardian_lang', language);
  }, [language]);

  const t = (key) => {
    if (!translations[language]) return key;
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
