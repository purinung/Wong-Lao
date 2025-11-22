
import React from 'react';
import { AppTheme } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, currentTheme, onThemeChange }) => {
  
  const themes: { id: AppTheme; label: string; icon: string; desc: string; color: string }[] = [
    { 
      id: 'NORMAL', 
      label: 'Neon Party', 
      icon: '✨', 
      desc: 'แสงสีสวยงาม บรรยากาศร้านเหล้า (Default)',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600'
    },
    { 
      id: 'DARK', 
      label: 'OLED Dark', 
      icon: '🌑', 
      desc: 'ดำสนิท ถนอมสายตา ประหยัดแบต',
      color: 'bg-black border border-gray-800'
    },
    { 
      id: 'LIGHT', 
      label: 'Daylight', 
      icon: '☀️', 
      desc: 'สว่าง คมชัด สำหรับที่แสงเยอะ',
      color: 'bg-gray-200 text-black'
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm p-6 bg-[#111] border border-white/10 rounded-3xl shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center mb-6">
           <h2 className="text-2xl font-bold text-white">Settings</h2>
           <p className="text-gray-500 text-xs">ปรับแต่งบรรยากาศ</p>
        </div>

        {/* Theme Options */}
        <div className="space-y-3">
           {themes.map((t) => (
             <button
               key={t.id}
               onClick={() => onThemeChange(t.id)}
               className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                 currentTheme === t.id 
                 ? 'ring-2 ring-blue-500 bg-white/5' 
                 : 'bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100'
               }`}
             >
                <div className="flex items-center space-x-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-xl ${t.color}`}>
                      {t.icon}
                   </div>
                   <div className="text-left">
                      <div className={`font-bold ${currentTheme === t.id ? 'text-white' : 'text-gray-300'}`}>
                        {t.label}
                      </div>
                      <div className="text-[10px] text-gray-500">{t.desc}</div>
                   </div>
                </div>
                {currentTheme === t.id && (
                   <div className="text-blue-500">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                       <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                     </svg>
                   </div>
                )}
             </button>
           ))}
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
