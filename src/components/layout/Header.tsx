import React from 'react';
import { MainSection, ActiveModal } from '../../types';
import { HexVaultLogo } from '../common/HexVaultLogo';

interface HeaderProps {
  activeSection: MainSection;
  onSelectSection: (section: MainSection) => void;
  onOpenSearch?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  onOpenSearch,
  onOpenCommandPalette,
  onOpenModal,
}) => {
  const triggerSearch = onOpenCommandPalette || onOpenSearch || (() => {});
  const sections: { id: MainSection; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'interfaces', label: 'Interfaces' },
    { id: 'firewall-and-nat', label: 'Firewall & NAT' },
    { id: 'protection-and-ips', label: 'Protection & IPS' },
    { id: 'dns-and-dhcp', label: 'DNS & DHCP' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'system-settings', label: 'System Settings' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#070f19]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.65)] border-b border-[#2d3541]/40">
      <div className="h-14 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand + Node Status + System Vital Gauges */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onSelectSection('dashboard')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <HexVaultLogo size="sm" version="v4.8.2" dotColor="primary" />
          </button>

          <div className="h-4 w-px bg-[#2d3541] hidden sm:block" />

          {/* Node Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18202b] text-[#4edea3] font-mono text-[11px] border border-[#2d3541]/60">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span className="font-semibold">node-01.lab.internal</span>
            <span className="text-[#bcc9cd] font-normal">[Online]</span>
          </div>

          {/* Vital Gauges */}
          <div className="hidden xl:flex items-center gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141c27] text-[#bcc9cd] border border-[#2d3541]/30">
              <span className="text-[#869397]">CPU</span>
              <span className="font-bold text-[#dbe3f2]">14%</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141c27] text-[#bcc9cd] border border-[#2d3541]/30">
              <span className="text-[#869397]">RAM</span>
              <span className="font-bold text-[#dbe3f2]">38%</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141c27] text-[#bcc9cd] border border-[#2d3541]/30">
              <span className="text-[#869397]">TEMP</span>
              <span className="font-bold text-[#4edea3]">41°C</span>
            </div>
          </div>
        </div>

        {/* Center: Main Section Navigation */}
        <nav className="hidden lg:flex items-center gap-1 font-['Geist'] text-xs">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#06b6d4] text-[#00424f] font-semibold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Engine Active Button + Quick Search + Alerts + User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onOpenModal('packet-trajectory')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]"
            title="Active Hardware Engine"
          >
            <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">
              security_update_good
            </span>
            <span className="font-semibold">Engine Active</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={triggerSearch}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141c27] hover:bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/50 cursor-pointer"
            title="Quick Command & Tool Search"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
              search
            </span>
            <span className="hidden md:inline text-[#869397]">Quick Search</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-[#18202b] font-mono text-[9px] text-[#869397] border border-[#2d3541]">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => onOpenModal('dns-leak')}
              className="relative p-1 rounded text-[#bcc9cd] hover:text-[#dbe3f2] hover:bg-[#232a36] transition-colors"
              title="View Telemetry Alerts & Audits"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#06b6d4] ring-2 ring-[#070f19] animate-pulse" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-1 pl-1">
            <div className="w-7 h-7 rounded-full bg-[#4cd7f6] flex items-center justify-center shadow-[0_0_8px_rgba(76,215,246,0.4)]">
              <span className="material-symbols-outlined text-[#003640] text-[16px]">
                person
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#869397] hover:text-white cursor-pointer hidden sm:block">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
