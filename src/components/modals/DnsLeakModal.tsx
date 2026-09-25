import React, { useState } from 'react';

interface DnsLeakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DnsLeakModal: React.FC<DnsLeakModalProps> = ({ isOpen, onClose }) => {
  const [isRunningProbes, setIsRunningProbes] = useState(false);
  const [probeProgress, setProbeProgress] = useState(60);

  if (!isOpen) return null;

  const handleRunProbes = () => {
    setIsRunningProbes(true);
    setProbeProgress(15);
    setTimeout(() => {
      setProbeProgress(35);
      setTimeout(() => {
        setProbeProgress(60);
        setIsRunningProbes(false);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070f19]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto bg-[#141c27] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#2d3541] max-h-[94vh] text-[#dbe3f2]">
        {/* Header */}
        <div className="flex flex-col gap-2 p-5 bg-[#070f19] border-b border-[#2d3541] shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-[#232a36] px-2.5 py-1 rounded-lg border border-[#2d3541]">
                <svg className="w-5 h-5 text-[#4cd7f6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="12 2 21 7.5 21 16.5 12 22 3 16.5 3 7.5" fill="none" stroke="currentColor" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                  <path d="M12 2v4M21 7.5l-3.5 2M21 16.5l-3.5-2M12 22v-4M3 16.5l3.5-2M3 7.5l3.5 2" strokeLinecap="round" />
                </svg>
                <div className="flex items-baseline">
                  <span className="font-['Geist'] text-sm font-bold text-[#dbe3f2]">FR_OS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] ml-1 shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
                </div>
              </div>

              <div className="h-4 w-px bg-[#2d3541]" />

              <div className="flex items-center gap-2">
                <h2 className="font-['Geist'] text-base md:text-lg font-semibold text-[#dbe3f2]">
                  DNS Leak Test & Resolver Telemetry Diagnostics
                </h2>
                <span className="hidden md:inline-flex items-center font-mono text-[10px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-2 py-0.5 rounded border border-[#2d3541] uppercase tracking-wider">
                  EBPF_DNS_LEAK_INSPECTOR // RFC_8484_853
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#18202b] hover:bg-[#232a36] text-[#869397] hover:text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.7)]" />
              </span>
              <span className="text-[#4edea3] font-bold">
                NO LEAKS DETECTED // 100% ENCRYPTED PIPELINE
              </span>
            </div>
            <span className="text-[#bcc9cd] text-[11px]">
              RESOLVER: <strong className="text-white">CoreDNS 1.11 forward-tls</strong> / <strong className="text-white">Unbound DoH</strong> / <strong className="text-white">Quad9 Anycast</strong>
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1 bg-[#0c141f]">
          {/* SECTION 01: VERDICT & SCORE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="uppercase text-[#869397] tracking-wider">01 // Overall Leak Verdict & Security Score</span>
              <span className="text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded font-bold">PASSED VERIFIED</span>
            </div>

            <div className="bg-[#141c27] rounded-xl p-5 flex flex-col lg:flex-row gap-5 border border-[#2d3541] shadow-lg">
              {/* Verdict Card */}
              <div className="flex flex-col justify-between p-4 bg-[#18202b] rounded-lg min-w-[260px] gap-3 border border-[#2d3541]">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#4edea3] uppercase font-bold">Security Audit Passed</span>
                  <span className="bg-[#4edea3]/15 text-[#4edea3] px-2 py-0.5 rounded font-bold text-[10px]">
                    GRADE A+ PRIVACY
                  </span>
                </div>
                <div className="my-1">
                  <div className="font-mono text-2xl font-bold text-[#dbe3f2] leading-tight">ZERO CLEARTEXT</div>
                  <div className="font-mono text-2xl font-bold text-[#4edea3] leading-tight">LEAKS DETECTED</div>
                </div>
                <p className="font-mono text-xs text-[#bcc9cd]">
                  Synthetic multi-zone queries encapsulated within high-cipher transport rings.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 font-mono">
                <div className="bg-[#0c141f] p-3.5 rounded-lg border border-[#2d3541] flex flex-col justify-between">
                  <span className="text-[10px] text-[#869397] uppercase">ISP Hijack / Interception</span>
                  <div className="text-sm text-[#dbe3f2] font-bold mt-1">0% (NONE)</div>
                  <span className="text-[11px] text-[#4cd7f6] mt-1">Port 53 UDP/TCP eBPF Trapped & Rerouted</span>
                </div>

                <div className="bg-[#0c141f] p-3.5 rounded-lg border border-[#2d3541] flex flex-col justify-between">
                  <span className="text-[10px] text-[#869397] uppercase">DNSSEC Validation</span>
                  <div className="text-sm text-[#4edea3] font-bold mt-1">ENFORCING</div>
                  <span className="text-[11px] text-[#bcc9cd] mt-1">100% AD Cryptographic Signatures</span>
                </div>

                <div className="bg-[#0c141f] p-3.5 rounded-lg border border-[#2d3541] flex flex-col justify-between">
                  <span className="text-[10px] text-[#869397] uppercase">EDNS Client Subnet (ECS)</span>
                  <div className="text-sm text-[#4edea3] font-bold mt-1">STRIPPED</div>
                  <span className="text-[11px] text-[#bcc9cd] mt-1">Zero Client GeoIP Subnet Exposure</span>
                </div>

                <div className="bg-[#0c141f] p-3.5 rounded-lg border border-[#2d3541] flex flex-col justify-between">
                  <span className="text-[10px] text-[#869397] uppercase">Transparent DNS Proxy</span>
                  <div className="text-sm text-[#dbe3f2] font-bold mt-1">NOT DETECTED</div>
                  <span className="text-[11px] text-[#4edea3] mt-1">No middleboxes or ISP caches discovered</span>
                </div>
              </div>

              {/* Probes Rate */}
              <div className="flex flex-col justify-between min-w-[210px] bg-[#0c141f] p-4 rounded-lg border border-[#2d3541] gap-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#869397]">DIAGNOSTIC CYCLE</span>
                  <span className="text-[#4cd7f6] font-bold">{probeProgress}/60 PROBES</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#dbe3f2]">
                    <span>Coverage Rate</span>
                    <span className="text-[#4edea3] font-bold">{(probeProgress / 60 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#18202b] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4edea3] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(78,222,163,0.5)]"
                      style={{ width: `${(probeProgress / 60) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunProbes}
                  className="w-full px-3 py-2 bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isRunningProbes ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  <span>{isRunningProbes ? 'Probing...' : 'Run Deep Multi-Probe'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 02: DETECTED SERVERS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="uppercase text-[#869397] tracking-wider">02 // Detected Upstream Resolver Servers & ASN Discovery</span>
              <span className="text-[#bcc9cd]">3 Active Responders</span>
            </div>

            <div className="bg-[#141c27] rounded-xl overflow-hidden border border-[#2d3541]">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-[#18202b] text-[#869397] text-[10px] uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Responder Node / IP</th>
                    <th className="px-4 py-2.5">Protocol & Port</th>
                    <th className="px-4 py-2.5 text-center">Latency</th>
                    <th className="px-4 py-2.5">ASN & Operator</th>
                    <th className="px-4 py-2.5 text-right">Tunnel Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3541]/40">
                  <tr className="hover:bg-[#18202b]/60 transition-colors">
                    <td className="px-4 py-2.5 text-[#dbe3f2] font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                      <span>9.9.9.9</span>
                      <span className="text-[10px] text-[#bcc9cd] bg-[#232a36] px-1.5 py-0.5 rounded">Anycast CH</span>
                    </td>
                    <td className="px-4 py-2.5 text-[#4cd7f6]">DoT (TLS 1.3 / Port 853)</td>
                    <td className="px-4 py-2.5 text-center font-bold text-white">11.2 ms</td>
                    <td className="px-4 py-2.5 text-[#bcc9cd]">AS19281 QUAD9</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-[10px] bg-[#4edea3]/15 text-[#4edea3] px-2 py-0.5 rounded font-bold">
                        PRIMARY ENCRYPTED [ACTIVE]
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#18202b]/60 transition-colors">
                    <td className="px-4 py-2.5 text-[#dbe3f2] font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
                      <span>149.112.112.112</span>
                      <span className="text-[10px] text-[#bcc9cd] bg-[#232a36] px-1.5 py-0.5 rounded">Secondary</span>
                    </td>
                    <td className="px-4 py-2.5 text-[#4cd7f6]">DoT (TLS 1.3 / Port 853)</td>
                    <td className="px-4 py-2.5 text-center font-bold text-white">13.8 ms</td>
                    <td className="px-4 py-2.5 text-[#bcc9cd]">AS19281 QUAD9</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-[10px] bg-[#4cd7f6]/15 text-[#4cd7f6] px-2 py-0.5 rounded font-bold">
                        BACKUP ENCRYPTED [STANDBY]
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#18202b]/60 transition-colors">
                    <td className="px-4 py-2.5 text-[#dbe3f2] font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#d0bcff]" />
                      <span>127.0.0.1#5335</span>
                      <span className="text-[10px] text-[#bcc9cd] bg-[#232a36] px-1.5 py-0.5 rounded">Unbound Recursive</span>
                    </td>
                    <td className="px-4 py-2.5 text-[#d0bcff]">Internal IPC / Socket</td>
                    <td className="px-4 py-2.5 text-center font-bold text-[#4edea3]">0.18 ms</td>
                    <td className="px-4 py-2.5 text-[#bcc9cd]">LOCALHOST // KERNEL</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-[10px] bg-[#232a36] text-[#bcc9cd] px-2 py-0.5 rounded font-bold">
                        IN-MEMORY CACHE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-[#0c141f] border-t border-[#2d3541] flex items-start gap-2.5 text-xs font-mono text-[#bcc9cd]">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px] shrink-0">verified_user</span>
                <p>
                  <strong className="text-white">Forensic Integrity Guaranteed:</strong> No ISP DNS servers (e.g. Magyar Telekom, Vodafone, Comcast) observed answering requests. All outbound egress queries strictly confined to authenticated TLS tunnels.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 03: ATTACK PROBE MATRIX */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="uppercase text-[#869397] tracking-wider">03 // Active Attack & Interception Probe Matrix</span>
              <span className="text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded font-bold">4 OF 4 SECURED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-[#869397] uppercase">Probe 03-A</span>
                    <h3 className="text-xs font-bold text-[#dbe3f2]">Port 53 UDP/TCP Hijacking Test</h3>
                  </div>
                  <span className="bg-[#4edea3]/15 text-[#4edea3] px-2 py-0.5 rounded font-bold text-[10px]">DEFENDED</span>
                </div>
                <p className="text-[11px] text-[#bcc9cd]">
                  Kernel XDP redirect to <code className="text-[#4cd7f6]">127.0.0.1:53</code> active. All raw unencrypted egress attempts intercepted.
                </p>
              </div>

              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-[#869397] uppercase">Probe 03-B</span>
                    <h3 className="text-xs font-bold text-[#dbe3f2]">DNS Rebinding Prevention</h3>
                  </div>
                  <span className="bg-[#4edea3]/15 text-[#4edea3] px-2 py-0.5 rounded font-bold text-[10px]">BLOCKED</span>
                </div>
                <p className="text-[11px] text-[#bcc9cd]">
                  127.0.0.0/8 and RFC1918 private IPv4/IPv6 responses systematically refused when resolved against public FQDN payloads.
                </p>
              </div>

              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-[#869397] uppercase">Probe 03-C</span>
                    <h3 className="text-xs font-bold text-[#dbe3f2]">IPv6 Dual-Stack DNS Leak</h3>
                  </div>
                  <span className="bg-[#4edea3]/15 text-[#4edea3] px-2 py-0.5 rounded font-bold text-[10px]">SEALED</span>
                </div>
                <p className="text-[11px] text-[#bcc9cd]">
                  IPv6 DoH/DoT operational via <code className="text-[#4cd7f6]">2620:fe::fe</code>. SLAAC stateless DNS broadcast is suppressed.
                </p>
              </div>

              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-[#869397] uppercase">Probe 03-D</span>
                    <h3 className="text-xs font-bold text-[#dbe3f2]">Browser DoH Canary Probe</h3>
                  </div>
                  <span className="bg-[#4cd7f6]/15 text-[#4cd7f6] px-2 py-0.5 rounded font-bold text-[10px]">MANAGED</span>
                </div>
                <p className="text-[11px] text-[#bcc9cd]">
                  <code className="text-[#4cd7f6]">use-application-dns.net</code> returns NXDOMAIN. Router security policy is sovereign.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 04: REAL-TIME SPARKLINE METRICS */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase text-[#869397] tracking-wider">04 // Real-Time Query Latency & Resolution Jitter</span>
              <span className="text-[#bcc9cd]">Average Resolution: 7.9 ms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#869397]">Plain UDP 53</span>
                  <span className="bg-[#93000a]/20 text-[#ffb4ab] px-1.5 py-0.5 rounded font-bold text-[9px]">BLOCKED</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white">18.4</span>
                  <span className="text-[10px] text-[#869397]">ms baseline</span>
                </div>
                <span className="text-[10px] text-[#ffb4ab]">Unencrypted packets dropped</span>
              </div>

              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#869397]">DoT (Quad9 TLS 1.3)</span>
                  <span className="bg-[#4edea3]/20 text-[#4edea3] px-1.5 py-0.5 rounded font-bold text-[9px]">OPTIMAL 0-RTT</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#4edea3]">11.2</span>
                  <span className="text-[10px] text-[#869397]">ms</span>
                </div>
                <span className="text-[10px] text-[#4edea3]">Session tickets active</span>
              </div>

              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#869397]">DoH (Cloudflare H2)</span>
                  <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] px-1.5 py-0.5 rounded font-bold text-[9px]">STANDBY</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#4cd7f6]">14.6</span>
                  <span className="text-[10px] text-[#869397]">ms</span>
                </div>
                <span className="text-[10px] text-[#bcc9cd]">Multiplexed keepalive</span>
              </div>

              <div className="bg-[#141c27] rounded-xl p-3.5 border border-[#2d3541] flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#869397]">Local Cache Hit</span>
                  <span className="bg-[#4edea3]/20 text-[#4edea3] px-1.5 py-0.5 rounded font-bold text-[9px]">92.4% RATIO</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white">0.2</span>
                  <span className="text-[10px] text-[#869397]">ms</span>
                </div>
                <span className="text-[10px] text-[#4edea3]">In-memory LRU unbuffered</span>
              </div>
            </div>
          </div>

          {/* SECTION 05: CLI STREAM */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase text-[#869397] tracking-wider">05 // Live Probe Log & CLI Verification Stream</span>
              <span className="text-[#4edea3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                RING BUFFER REALTIME
              </span>
            </div>

            <div className="bg-[#070f19] rounded-xl p-4 space-y-1.5 border border-[#2d3541] text-xs">
              <div className="text-[#4cd7f6] flex items-center gap-2">
                <span className="text-[#869397]">$</span>
                <span>fr-diag dns-leak-test --targets 60 --entropy high --verify-dnssec</span>
              </div>
              <div className="text-[#bcc9cd] pl-4">
                &gt; [PROBE 01..15] querying unique random prefix *.leak-test.fr-os.internal -&gt; Answered by: <span className="text-white font-semibold">9.9.9.9 (Quad9 Anycast)</span>
              </div>
              <div className="text-[#4edea3] pl-4">
                &gt; [PROBE 16..30] testing plain UDP:53 egress attempt -&gt; <span className="bg-[#4edea3]/10 px-1 rounded">TRAPPED by eBPF filter rule</span>
              </div>
              <div className="text-[#bcc9cd] pl-4">
                &gt; [PROBE 31..45] evaluating EDNS0 Client Subnet padding -&gt; <span className="text-[#4cd7f6] font-semibold">ECS stripped</span>, payload: 512 bytes
              </div>
              <div className="text-[#bcc9cd] pl-4">
                &gt; [PROBE 46..60] DNSSEC validation check on dnssec-failed.org -&gt; <span className="text-[#4edea3] font-semibold">SERVFAIL returned</span> (Bogus)
              </div>
              <div className="text-[#4edea3] font-bold pt-1">
                # [RESULT] PASS: 0 leaks, 0 ISP transparent proxies, 100% cryptographic integrity verified.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#070f19] border-t border-[#2d3541] shrink-0 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="material-symbols-outlined text-[16px] text-[#869397]">history</span>
            <span>Last audited: <strong className="text-white">Just now</strong> (cycle: 15m)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="px-3 py-1.5 rounded-lg bg-[#18202b] hover:bg-[#232a36] text-[#dbe3f2] border border-[#2d3541] transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export PCAP / JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#18202b] hover:bg-[#232a36] text-[#bcc9cd] hover:text-white transition-colors"
            >
              Close Diagnostics
            </button>
            <button
              onClick={handleRunProbes}
              className="px-4 py-1.5 rounded-lg bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">autorenew</span>
              <span>Re-Run Full Test Suite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
