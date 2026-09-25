import React, { useState } from 'react';

interface DnsOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DnsOverrideModal: React.FC<DnsOverrideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fqdn, setFqdn] = useState('vaultwarden.lab.internal');
  const [zoneScope, setZoneScope] = useState('Local Private (.internal)');
  const [description, setDescription] = useState(
    'Primary Password Vault Internal Endpoint (Bypasses hairpin WAN NAT)'
  );
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'TXT' | 'PTR'>('A');
  const [ipv4, setIpv4] = useState('192.168.20.80');
  const [ipv6, setIpv6] = useState('fd00:fr40::80');
  const [ttl, setTtl] = useState('60s');

  const [autoPtr, setAutoPtr] = useState(true);
  const [dhcpSync, setDhcpSync] = useState(true);
  const [spoofGuard, setSpoofGuard] = useState(true);
  const [interceptPolicy, setInterceptPolicy] = useState('local');
  const [rebindGuard, setRebindGuard] = useState(true);

  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [dryRunStatus, setDryRunStatus] = useState<string | null>(null);
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePing = () => {
    setPingStatus('pinging');
    setTimeout(() => {
      setPingStatus('0.24ms RTT (Up)');
      setTimeout(() => setPingStatus(null), 2500);
    }, 700);
  };

  const handleDryRun = () => {
    setDryRunStatus('digging');
    setTimeout(() => {
      setDryRunStatus('192.168.20.80 [NOERROR] in 0.12ms');
      setTimeout(() => setDryRunStatus(null), 3000);
    }, 800);
  };

  const handleCommit = () => {
    setCommitStatus('committing');
    setTimeout(() => {
      setCommitStatus('committed');
      setTimeout(() => {
        setCommitStatus(null);
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#070f19]/80 backdrop-blur-md">
      <div className="relative w-full max-w-[880px] my-auto bg-[#141c27] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-[#dbe3f2] border border-[#2d3541]">
        {/* Subtle top neon cyan accent line */}
        <div className="w-full h-0.5 bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#4edea3]" />

        {/* Modal Header */}
        <div className="p-5 bg-[#18202b] flex flex-col gap-2 border-b border-[#2d3541]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-['Geist'] text-lg font-bold text-[#dbe3f2]">FR_OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shadow-[0_0_6px_rgba(76,215,246,0.8)]" />
              </div>
              <div className="h-4 w-px bg-[#2d3541]" />
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#232a36] text-[#4edea3] font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                <span>eBPF DNS-FILTER REWRITE HOOK ACTIVE</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#232a36] hover:bg-[#323a46] text-[#869397] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-1">
            <div>
              <h2 className="font-['Geist'] text-sm md:text-base font-semibold text-[#dbe3f2]">
                Provision DNS Static Override & Host Record{' '}
                <span className="text-[#869397] font-mono text-xs font-normal">
                  // COREDNS_LOCAL_ZONE_V4_V6
                </span>
              </h2>
              <p className="font-mono text-[11px] text-[#bcc9cd]">
                RESOLVER: CoreDNS 1.11 / Unbound (Local Split-Horizon & Reverse PTR Sync)
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#869397]">
              <span>NAMESPACE:</span>
              <span className="font-bold text-[#4cd7f6]">zone.lab.internal</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[720px] overflow-y-auto">
          {/* Section 01 */}
          <div className="bg-[#18202b] rounded-lg p-4 space-y-3 border border-[#2d3541]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold font-mono text-xs">01 //</span>
                <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Host Record FQDN & Domain Scope
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-mono text-[10px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                VALID RFC-1123 SYNTAX
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 flex flex-col gap-1">
                <label className="font-mono text-[11px] text-[#bcc9cd] uppercase flex items-center justify-between">
                  <span>Fully Qualified Domain Name (FQDN)</span>
                  <span className="text-[#869397] text-[9px]">e.g. host.domain.tld</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 material-symbols-outlined text-[16px] text-[#4cd7f6]">
                    dns
                  </span>
                  <input
                    type="text"
                    value={fqdn}
                    onChange={(e) => setFqdn(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded bg-[#0c141f] text-[#dbe3f2] font-mono text-xs border border-[#2d3541] focus:outline-none focus:border-[#4cd7f6]"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-1">
                <label className="font-mono text-[11px] text-[#bcc9cd] uppercase">Zone Scope</label>
                <select
                  value={zoneScope}
                  onChange={(e) => setZoneScope(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#0c141f] text-[#dbe3f2] font-mono text-xs border border-[#2d3541] focus:outline-none cursor-pointer"
                >
                  <option>Local Private (.internal)</option>
                  <option>Split-Horizon Public Hijack</option>
                  <option>Wildcard (*.apps.lab.internal)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] text-[#bcc9cd] uppercase">
                Administrative Description & Routing Intent
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-[#0c141f] text-[#dbe3f2] font-mono text-xs border border-[#2d3541] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 02 */}
          <div className="bg-[#18202b] rounded-lg p-4 space-y-3 border border-[#2d3541]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold font-mono text-xs">02 //</span>
                <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Target Allocation & Record Types
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-[#869397]">PROTOCOL:</span>
                <span className="text-[#4cd7f6] font-bold">Dual-Stack IPv4/v6</span>
              </div>
            </div>

            {/* Record Type Selector Tabs */}
            <div className="flex flex-wrap gap-1 p-1 rounded bg-[#0c141f] border border-[#2d3541]">
              {(['A', 'AAAA', 'CNAME', 'TXT', 'PTR'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRecordType(t)}
                  className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                    recordType === t
                      ? 'bg-[#06b6d4] text-[#00424f] shadow-sm'
                      : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  {t === 'A' ? 'A (IPv4)' : t === 'AAAA' ? 'AAAA (IPv6)' : t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#bcc9cd] uppercase">
                  <span>Primary IPv4 Target</span>
                  <div className="flex items-center gap-1.5 lowercase">
                    <button onClick={() => setIpv4('192.168.1.180')} className="text-[#4cd7f6] hover:underline">From DHCP</button>
                    <span className="text-[#869397]">·</span>
                    <button onClick={() => setIpv4('192.168.20.81')} className="text-[#4cd7f6] hover:underline">Next Free</button>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={ipv4}
                    onChange={(e) => setIpv4(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#0c141f] text-[#4edea3] font-mono text-sm border border-[#2d3541] focus:outline-none tracking-wider pr-28"
                  />
                  <button
                    onClick={handlePing}
                    className="absolute right-1 px-2.5 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] hover:text-white font-mono text-[10px] flex items-center gap-1 border border-[#2d3541]"
                  >
                    <span className="material-symbols-outlined text-[12px] text-[#4edea3]">wifi_tethering</span>
                    <span>{pingStatus || 'ICMP Ping'}</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#bcc9cd] uppercase">
                  <span>Dual-Stack IPv6 Target (AAAA)</span>
                  <span className="text-[#4edea3]">Active Link-Local/ULA</span>
                </div>
                <input
                  type="text"
                  value={ipv6}
                  onChange={(e) => setIpv6(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#0c141f] text-[#4cd7f6] font-mono text-sm border border-[#2d3541] focus:outline-none tracking-wider"
                />
              </div>
            </div>

            {/* TTL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#2d3541]/40">
              <span className="font-mono text-[11px] text-[#bcc9cd] uppercase">Record Time-To-Live (TTL):</span>
              <div className="flex items-center gap-1 font-mono text-xs">
                {['60s', '300s', '3600s', 'Custom'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTtl(val)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      ttl === val
                        ? 'bg-[#4cd7f6] text-[#003640] font-bold'
                        : 'bg-[#232a36] text-[#bcc9cd] hover:text-white'
                    }`}
                  >
                    {val === '60s' ? '60s (Fast Failover)' : val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 03 */}
          <div className="bg-[#18202b] rounded-lg p-4 space-y-2 border border-[#2d3541]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#4cd7f6] font-bold font-mono text-xs">03 //</span>
              <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                Reverse DNS (PTR) & DHCP Synchronization
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <label className="flex items-start gap-2.5 p-2 rounded bg-[#141c27] border border-[#2d3541] cursor-pointer hover:bg-[#232a36] transition-colors">
                <input
                  type="checkbox"
                  checked={autoPtr}
                  onChange={(e) => setAutoPtr(e.target.checked)}
                  className="mt-1 accent-[#4cd7f6] w-4 h-4 rounded"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#dbe3f2]">Auto-Generate PTR</span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">Syncs in-addr.arpa and ip6.arpa automatically.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded bg-[#141c27] border border-[#2d3541] cursor-pointer hover:bg-[#232a36] transition-colors">
                <input
                  type="checkbox"
                  checked={dhcpSync}
                  onChange={(e) => setDhcpSync(e.target.checked)}
                  className="mt-1 accent-[#4cd7f6] w-4 h-4 rounded"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#dbe3f2]">Kea DHCP Lease Sync</span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">Binds reservation to MAC address of storage-san-01.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded bg-[#141c27] border border-[#2d3541] cursor-pointer hover:bg-[#232a36] transition-colors">
                <input
                  type="checkbox"
                  checked={spoofGuard}
                  onChange={(e) => setSpoofGuard(e.target.checked)}
                  className="mt-1 accent-[#4cd7f6] w-4 h-4 rounded"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#dbe3f2]">eBPF Spoof Guard</span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">Hardware-offloaded drop for rogue override injections.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 04 */}
          <div className="bg-[#18202b] rounded-lg p-4 space-y-3 border border-[#2d3541]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold font-mono text-xs">04 //</span>
                <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Interception Policy & Security Shield
                </span>
              </div>
              <span className="text-[#869397] font-mono text-[10px] uppercase">RFC-6761 Compliant</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <label
                onClick={() => setInterceptPolicy('local')}
                className={`p-2.5 rounded border cursor-pointer flex items-center gap-2 transition-colors ${
                  interceptPolicy === 'local' ? 'bg-[#232a36] border-[#4cd7f6]' : 'bg-[#141c27] border-[#2d3541]'
                }`}
              >
                <input
                  type="radio"
                  name="intercept_policy"
                  checked={interceptPolicy === 'local'}
                  onChange={() => setInterceptPolicy('local')}
                  className="accent-[#4cd7f6]"
                />
                <span className="font-mono text-xs text-[#dbe3f2]">Local IP (Authoritative)</span>
              </label>

              <label
                onClick={() => setInterceptPolicy('wan_fallback')}
                className={`p-2.5 rounded border cursor-pointer flex items-center gap-2 transition-colors ${
                  interceptPolicy === 'wan_fallback' ? 'bg-[#232a36] border-[#4cd7f6]' : 'bg-[#141c27] border-[#2d3541]'
                }`}
              >
                <input
                  type="radio"
                  name="intercept_policy"
                  checked={interceptPolicy === 'wan_fallback'}
                  onChange={() => setInterceptPolicy('wan_fallback')}
                  className="accent-[#4cd7f6]"
                />
                <span className="font-mono text-xs text-[#bcc9cd]">WAN Forward Fallback</span>
              </label>

              <label
                onClick={() => setInterceptPolicy('sinkhole')}
                className={`p-2.5 rounded border cursor-pointer flex items-center gap-2 transition-colors ${
                  interceptPolicy === 'sinkhole' ? 'bg-[#232a36] border-[#4cd7f6]' : 'bg-[#141c27] border-[#2d3541]'
                }`}
              >
                <input
                  type="radio"
                  name="intercept_policy"
                  checked={interceptPolicy === 'sinkhole'}
                  onChange={() => setInterceptPolicy('sinkhole')}
                  className="accent-[#4cd7f6]"
                />
                <span className="font-mono text-xs text-[#bcc9cd]">Null-Route (0.0.0.0)</span>
              </label>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded bg-[#141c27] border border-[#2d3541]">
              <input
                type="checkbox"
                id="rebind_guard"
                checked={rebindGuard}
                onChange={(e) => setRebindGuard(e.target.checked)}
                className="accent-[#4cd7f6] w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="rebind_guard" className="font-mono text-xs text-[#dbe3f2] cursor-pointer">
                Enforce strict DNS Rebinding protection (Drops unauthenticated public IP redirect reflections)
              </label>
            </div>
          </div>

          {/* Section 05: CoreDNS Syntax */}
          <div className="bg-[#070f19] rounded-lg p-3.5 space-y-1 font-mono text-xs leading-relaxed border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1 border-b border-[#2d3541]/40 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
                <span className="text-[#869397] ml-1">/etc/coredns/zones/db.lab.internal (Hot-Stage Preview)</span>
              </div>
              <span className="text-[#4edea3]">SYNTAX CHECK: PASSED</span>
            </div>
            <pre className="text-[#bcc9cd] pt-1 overflow-x-auto text-[11px]">
              <span className="text-[#869397]">; Zonefile dynamic record generation for node-01.lab.internal</span>
              {'\n'}
              <span className="text-[#4cd7f6] font-bold">{fqdn}.</span>   <span className="text-[#4edea3]">60</span>   IN   <span className="text-[#06b6d4] font-bold">A</span>      <span className="text-[#4edea3] font-bold">{ipv4}</span>
              {'\n'}
              <span className="text-[#4cd7f6] font-bold">{fqdn}.</span>   <span className="text-[#4edea3]">60</span>   IN   <span className="text-[#06b6d4] font-bold">AAAA</span>   <span className="text-[#4cd7f6]">{ipv6}</span>
              {'\n'}
              <span className="text-[#869397]">; Auto-synced in-addr.arpa Reverse PTR entry</span>
              {'\n'}
              <span className="text-[#4cd7f6] font-bold">80.20.168.192.in-addr.arpa.</span> <span className="text-[#4edea3]">60</span>   IN   <span className="text-[#06b6d4] font-bold">PTR</span>    <span className="text-white font-bold">{fqdn}.</span>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#18202b] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2d3541]">
          <div className="flex items-center gap-2 text-[#869397] font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
            <span>Hotload CoreDNS in-memory tree & eBPF conntrack lookup table</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDryRun}
              className="px-4 py-1.5 rounded bg-[#141c27] border border-[#2d3541] hover:bg-[#18202b] text-[#4cd7f6] font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">play_circle</span>
              <span>{dryRunStatus || 'Dry-Run (dig @127.0.0.1)'}</span>
            </button>
            <button
              onClick={handleCommit}
              className="px-5 py-1.5 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold transition-all shadow-[0_0_16px_rgba(6,182,212,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                {commitStatus === 'committing' ? 'sync' : 'add_task'}
              </span>
              <span>
                {commitStatus === 'committing'
                  ? 'Reloading CoreDNS...'
                  : commitStatus === 'committed'
                  ? 'Record Committed!'
                  : 'Commit Record & Reload'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
