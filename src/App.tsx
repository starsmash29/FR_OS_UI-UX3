import React, { useState, useEffect } from 'react';
import { MainSection, ActiveModal } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { CommandPalette } from './components/modals/CommandPalette';

// All 12 specialized diagnostic & configuration modals
import { LagBondModal } from './components/modals/LagBondModal';
import { VlanProvisionModal } from './components/modals/VlanProvisionModal';
import { DnsOverrideModal } from './components/modals/DnsOverrideModal';
import { EncryptedDnsModal } from './components/modals/EncryptedDnsModal';
import { DnsLeakModal } from './components/modals/DnsLeakModal';
import { GeoIpPerimeterModal } from './components/modals/GeoIpPerimeterModal';
import { PacketTrajectoryModal } from './components/modals/PacketTrajectoryModal';
import { MtrDiagnosticsModal } from './components/modals/MtrDiagnosticsModal';
import { IperfBenchmarkModal } from './components/modals/IperfBenchmarkModal';
import { PacketCaptureModal } from './components/modals/PacketCaptureModal';
import { BgpExplorerModal } from './components/modals/BgpExplorerModal';
import { ArpNdpCacheModal } from './components/modals/ArpNdpCacheModal';

export default function App() {
  const [activeSection, setActiveSection] = useState<MainSection>('dashboard');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global hotkeys (Cmd+K / Ctrl+K for search, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (activeModal) {
          setActiveModal(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, activeModal]);

  const handleOpenModal = (modal: ActiveModal) => {
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#070e17] text-slate-200 antialiased font-sans select-none">
      {/* Top Header Bar */}
      <Header
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenModal={handleOpenModal}
      />

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          activeModal={activeModal}
          onOpenModal={handleOpenModal}
        />

        {/* Center Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#070e17] overflow-y-auto">
          <MainDashboard
            activeSection={activeSection}
            onOpenModal={handleOpenModal}
          />
        </main>
      </div>

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModal={(modal) => {
          setActiveModal(modal);
          setIsCommandPaletteOpen(false);
        }}
        onSelectSection={(section) => {
          setActiveSection(section);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* 1. Link Aggregation (LAG/Bond) Modal */}
      {activeModal === 'lag-bond' && (
        <LagBondModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 2. Provision VLAN Interface Modal */}
      {activeModal === 'vlan-provision' && (
        <VlanProvisionModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 3. DNS Host Overrides Modal */}
      {activeModal === 'dns-override' && (
        <DnsOverrideModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 4. Encrypted Upstream DNS Modal */}
      {activeModal === 'encrypted-dns' && (
        <EncryptedDnsModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 5. DNS Leak Test Modal */}
      {activeModal === 'dns-leak' && (
        <DnsLeakModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 6. Geo-IP Country Perimeter Modal */}
      {(activeModal === 'geoip-perimeter' || activeModal === 'geo-ip-perimeter') && (
        <GeoIpPerimeterModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 7. IP Geo-Lookup & Packet Trajectory Modal */}
      {activeModal === 'packet-trajectory' && (
        <PacketTrajectoryModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 8. MTR & Jitter Oscilloscope Diagnostics Modal */}
      {activeModal === 'mtr-diagnostics' && (
        <MtrDiagnosticsModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 9. iPerf3 Wire-Speed Benchmark Modal */}
      {activeModal === 'iperf-benchmark' && (
        <IperfBenchmarkModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 10. Live eBPF Packet Capture Modal */}
      {activeModal === 'packet-capture' && (
        <PacketCaptureModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 11. BGP Dynamic Routing Table & Peering Explorer Modal */}
      {activeModal === 'bgp-explorer' && (
        <BgpExplorerModal isOpen={true} onClose={handleCloseModal} />
      )}

      {/* 12. ARP & NDP Neighbor Discovery Modal */}
      {(activeModal === 'arp-ndp' || activeModal === 'arp-ndp-cache') && (
        <ArpNdpCacheModal isOpen={true} onClose={handleCloseModal} />
      )}
    </div>
  );
}
