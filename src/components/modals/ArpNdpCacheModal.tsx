import React, { useState } from 'react';
import { NEIGHBOR_ENTRIES } from '../../data/mockData';
import { NeighborEntry } from '../../types';

interface ArpNdpCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArpNdpCacheModal: React.FC<ArpNdpCacheModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [protocolFilter, setProtocolFilter] = useState<'ALL' | 'IPv4' | 'IPv6'>('ALL');
  const [stateFilter, setStateFilter] = useState<'ALL' | 'REACHABLE' | 'PERMANENT' | 'STALE' | 'DELAY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [interfaceFilter, setInterfaceFilter] = useState('ALL');
  const [selectedEntry, setSelectedEntry] = useState<NeighborEntry | null>(NEIGHBOR_ENTRIES[0]);
  const [neighbors, setNeighbors] = useState<NeighborEntry[]>(NEIGHBOR_ENTRIES);
  const [isFlushing, setIsFlushing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredNeighbors = neighbors.filter((n) => {
    if (protocolFilter !== 'ALL' && n.protocol !== protocolFilter) return false;
    if (stateFilter !== 'ALL' && n.state !== stateFilter) return false;
    if (interfaceFilter !== 'ALL' && n.interface !== interfaceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.ip.toLowerCase().includes(q) ||
        n.mac.toLowerCase().includes(q) ||
        n.vendor.toLowerCase().includes(q) ||
        n.hostname?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFlushCache = () => {
    setIsFlushing(true);
    setTimeout(() => {
      // Keep static/permanent entries, revalidate dynamic ones
      setNeighbors((prev) =>
        prev.map((item) =>
          item.state === 'PERMANENT' ? item : { ...item, state: 'PROBE' }
        )
      );
      setIsFlushing(false);
      setNotification('ARP/NDP dynamic cache flushed. Soliciting ARP probe revalidation.');
      setTimeout(() => setNotification(null), 4000);
    }, 600);
  };

  const handleClearStale = () => {
    setNeighbors((prev) => prev.filter((item) => item.state !== 'STALE'));
    setNotification('Removed stale neighbor cache entries.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendGratuitousArp = (ip: string, mac: string) => {
    setNotification(`Broadcasting Gratuitous ARP for ${ip} [${mac}] across all trunks...`);
    setTimeout(() => setNotification(null), 3000);
  };

  const getStateBadgeColor = (state: string) => {
    switch (state) {
      case 'REACHABLE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PERMANENT':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'STALE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DELAY':
      case 'PROBE':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl max-h-[94vh] flex flex-col bg-[#0b131e] border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-950/50 overflow-hidden font-mono text-slate-300">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gradient-to-r from-[#070e17] via-[#0c1826] to-[#070e17] border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
              <span className="material-symbols-outlined text-[19px]">account_tree</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                  FR_OS L2/L3 Neighbor Discovery Table
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded">
                  RFC 4861 NDP • RFC 826 ARP
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Linux Kernel Netlink AF_NETLINK neighbor cache • Hardware XDP L2 forwarding table
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleClearStale}
              className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors flex items-center gap-1.5"
              title="Delete stale ARP cache entries"
            >
              <span className="material-symbols-outlined text-sm text-amber-400">cleaning_services</span>
              Clear Stale
            </button>
            <button
              onClick={handleFlushCache}
              disabled={isFlushing}
              className="px-3 py-1 text-xs rounded border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className={`material-symbols-outlined text-sm ${isFlushing ? 'animate-spin' : ''}`}>
                cached
              </span>
              {isFlushing ? 'Flushing...' : 'Flush Cache'}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/60 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="px-5 py-2 bg-cyan-950/90 border-b border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-cyan-400">info</span>
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-5 py-3 bg-[#08101a] border-b border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-lg bg-[#0e1927] border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Neighbors</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-white">{neighbors.length}</span>
              <span className="text-[11px] text-slate-400">active entries</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0e1927] border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">IPv4 ARP</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-cyan-400">
                {neighbors.filter((n) => n.protocol === 'IPv4').length}
              </span>
              <span className="text-[11px] text-slate-400">RFC 826</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0e1927] border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">IPv6 NDP</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-indigo-400">
                {neighbors.filter((n) => n.protocol === 'IPv6').length}
              </span>
              <span className="text-[11px] text-slate-400">RFC 4861</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0e1927] border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Reachable / Permanent</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-emerald-400">
                {neighbors.filter((n) => n.state === 'REACHABLE' || n.state === 'PERMANENT').length}
              </span>
              <span className="text-[11px] text-emerald-500/80">healthy L2</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0e1927] border border-slate-800 flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">eBPF TC Ingress Filter</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-cyan-300">PASS (0 drop)</span>
              <span className="text-[10px] text-cyan-500">Anti-Spoof ON</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 bg-[#0d1724] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Protocol */}
            <div className="flex rounded border border-slate-700 bg-slate-900/60 p-0.5">
              {(['ALL', 'IPv4', 'IPv6'] as const).map((proto) => (
                <button
                  key={proto}
                  onClick={() => setProtocolFilter(proto)}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium transition-all ${
                    protocolFilter === proto
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {proto}
                </button>
              ))}
            </div>

            {/* State filter */}
            <div className="flex rounded border border-slate-700 bg-slate-900/60 p-0.5">
              {(['ALL', 'REACHABLE', 'PERMANENT', 'STALE', 'DELAY'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStateFilter(st)}
                  className={`px-2 py-1 text-[11px] rounded transition-all ${
                    stateFilter === st
                      ? 'bg-slate-700 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Interface filter */}
            <select
              value={interfaceFilter}
              onChange={(e) => setInterfaceFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-900 text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Interfaces</option>
              <option value="eth0">eth0 (WAN Uplink)</option>
              <option value="eth1">eth1 (LAN Primary)</option>
              <option value="bond0">bond0 (Core LAG)</option>
              <option value="vlan10">vlan10 (Management)</option>
              <option value="vlan20">vlan20 (DMZ)</option>
            </select>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search IP, MAC, Vendor or Hostname..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-900/80 border border-slate-700 rounded text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Main Body (Table on left, Detail Drawer on right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Neighbors Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-[#09111c] border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 select-none z-10">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">IP Address</th>
                  <th className="py-2.5 px-3 font-semibold">MAC Address</th>
                  <th className="py-2.5 px-3 font-semibold">Vendor / OUI</th>
                  <th className="py-2.5 px-3 font-semibold">Interface</th>
                  <th className="py-2.5 px-3 font-semibold">State</th>
                  <th className="py-2.5 px-3 font-semibold">Age</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[12px]">
                {filteredNeighbors.map((entry) => {
                  const isSelected = selectedEntry?.ip === entry.ip;
                  return (
                    <tr
                      key={entry.ip}
                      onClick={() => setSelectedEntry(entry)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400 text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              entry.state === 'REACHABLE' || entry.state === 'PERMANENT'
                                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                                : entry.state === 'STALE'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-cyan-300">{entry.ip}</div>
                            {entry.hostname && (
                              <div className="text-[10px] text-slate-500 font-sans">{entry.hostname}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {entry.mac}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/60">
                          {entry.vendor}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-cyan-400 font-medium">{entry.interface}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded border ${getStateBadgeColor(
                            entry.state
                          )}`}
                        >
                          {entry.state}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {entry.updated}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendGratuitousArp(entry.ip, entry.mac);
                          }}
                          className="px-2 py-0.5 text-[10px] rounded bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-200 transition-colors"
                          title="Broadcast ARP request to update MAC cache"
                        >
                          GARP
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredNeighbors.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-3xl mb-2 text-slate-600">travel_explore</span>
                <p>No neighbor cache entries found matching criteria.</p>
              </div>
            )}
          </div>

          {/* Right Detail Card */}
          {selectedEntry && (
            <div className="w-full lg:w-80 bg-[#08101a] border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-cyan-400">info</span>
                  Neighbor Diagnostics
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{selectedEntry.protocol}</span>
              </div>

              <div className="space-y-3 font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">IP Address</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">{selectedEntry.ip}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Hardware (MAC)</div>
                  <div className="text-xs text-slate-300 bg-slate-900/80 p-1.5 rounded border border-slate-800 mt-0.5">
                    {selectedEntry.mac}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">NIC Vendor</div>
                  <div className="text-xs text-slate-200 mt-0.5">{selectedEntry.vendor}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Assigned Interface</div>
                  <div className="text-xs text-indigo-400 font-semibold mt-0.5">{selectedEntry.interface}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Cache State Flags</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getStateBadgeColor(
                        selectedEntry.state
                      )}`}
                    >
                      {selectedEntry.state}
                    </span>
                    <span className="text-[10px] text-slate-400">Last poll {selectedEntry.updated}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0b1420] border border-cyan-500/20 space-y-1.5 text-[11px]">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">shield</span>
                    Anti-ARP Poisoning / DAI
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Dynamic ARP Inspection (DAI) verified against DHCP Snooping binding table. No duplicate MAC
                    broadcast detected.
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => handleSendGratuitousArp(selectedEntry.ip, selectedEntry.mac)}
                  className="w-full py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950"
                >
                  <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                  Send Probe / GARP
                </button>
                <button
                  onClick={() => {
                    setNeighbors((prev) => prev.filter((n) => n.ip !== selectedEntry.ip));
                    setSelectedEntry(null);
                    setNotification(`Evicted ${selectedEntry.ip} from cache.`);
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="w-full py-1.5 px-3 rounded border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Evict Entry from Cache
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="px-5 py-2.5 bg-[#060c14] border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Kernel Netlink AF_NETLINK: OK</span>
            <span>•</span>
            <span>XDP L2 Direct Path: Active (Bypassing conntrack)</span>
            <span>•</span>
            <span>GARP Broadcast Interval: 30s</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Table synchronized with hardware switch core</span>
          </div>
        </div>
      </div>
    </div>
  );
};
