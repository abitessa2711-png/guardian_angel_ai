import React from 'react';

// Crisp Vector Ashoka Lion Capital (State Emblem of India)
export function AshokaEmblem({ className = "w-8 h-8 text-white" }) {
  return (
    <svg className={className} viewBox="0 0 100 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Central Lion Head */}
      <path d="M50 8C43 8 38 13 38 20C38 23.5 39.5 26.5 42 28.5C39 31 38 34.5 38 38C38 43 42 47 48 48.5V52H52V48.5C58 47 62 43 62 38C62 34.5 61 31 58 28.5C60.5 26.5 62 23.5 62 20C62 13 57 8 50 8Z" opacity="0.95" />
      
      {/* Left Lion Head Profile */}
      <path d="M28 20C23 20 19 24 19 29C19 32 20.5 34.5 23 36C20.5 38 19 41 19 44C19 48.5 22.5 52 27 53.5V57H31V53C35 52 38 49 38 45C38 42 36.5 39.5 34 38C36 36.5 37 34 37 31C37 25 33 20 28 20Z" opacity="0.85" />
      
      {/* Right Lion Head Profile */}
      <path d="M72 20C77 20 81 24 81 29C81 32 79.5 34.5 77 36C79.5 38 81 41 81 44C81 48.5 77.5 52 73 53.5V57H69V53C65 52 62 49 62 45C62 42 63.5 39.5 66 38C64 36.5 63 34 63 31C63 25 67 20 72 20Z" opacity="0.85" />

      {/* Mane Details & Chest Details */}
      <path d="M44 32C44 35 46.5 37 50 37C53.5 37 56 35 56 32C56 29 53.5 27 50 27C46.5 27 44 29 44 32Z" fill="#ffffff" />
      <circle cx="50" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="47" cy="18" r="1.2" fill="#0f172a" />
      <circle cx="53" cy="18" r="1.2" fill="#0f172a" />

      {/* Abacus / Base Platform */}
      <rect x="15" y="58" width="70" height="7" rx="1.5" opacity="0.9" />

      {/* Ashoka Chakra Wheel on Abacus */}
      <circle cx="50" cy="61.5" r="3" fill="none" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="58.5" x2="50" y2="64.5" stroke="#0f172a" strokeWidth="0.5" />
      <line x1="47" y1="61.5" x2="53" y2="61.5" stroke="#0f172a" strokeWidth="0.5" />

      {/* Flanking Animals on Abacus */}
      <rect x="25" y="59.5" width="8" height="4" rx="1" fill="#0f172a" opacity="0.6" />
      <rect x="67" y="59.5" width="8" height="4" rx="1" fill="#0f172a" opacity="0.6" />

      {/* Bell Capital / Lotus Base */}
      <path d="M22 66C22 66 26 78 50 78C74 78 78 66 78 66H22Z" opacity="0.85" />
      
      {/* Plinth Base */}
      <rect x="18" y="79" width="64" height="4" rx="1" opacity="0.9" />
      <rect x="14" y="84" width="72" height="5" rx="1" opacity="0.95" />

      {/* Satyameva Jayate Inscription */}
      <text x="50" y="98" fontSize="6.5" textAnchor="middle" fill="currentColor" fontFamily="'Arial', sans-serif" fontWeight="bold" letterSpacing="0.8">
        सत्यमेव जयते
      </text>
    </svg>
  );
}

// Public Safety Shield Emblem for Sidebar Bottom
export function PublicSafetySeal({ className = "w-7 h-7 text-blue-400" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L6 12V22C6 33.1 13.7 43.4 24 46C34.3 43.4 42 33.1 42 22V12L24 4Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 10L10 16V23C10 31.5 16 39.5 24 41.8C32 39.5 38 31.5 38 23V16L24 10Z" fill="#0f172a" stroke="#93c5fd" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="7" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M24 18V30M18 24H30" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.5" fill="#60a5fa" />
    </svg>
  );
}
