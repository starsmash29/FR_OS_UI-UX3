import React, { useState, useEffect } from 'react';
import { CAPTURED_PACKETS } from '../../data/mockData';
import { CapturedPacket } from '../../types';

interface PacketCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PacketCaptureModal: React.FC<PacketCaptureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [interfaceTap, setInterfaceTap] = useState('eth0');
  const [bpfFilter, setBpfFilter] = useState('tcp port 443 or (udp and port 53) or icmp');
  const [isStreaming, setIsStreaming] = useState(true);
  const [capturedPackets, setCapturedPackets] = useState<CapturedPacket[]>(CAPTURED_PACKETS);
  const [selectedPacket, setSelectedPacket] = useState<CapturedPacket>(CAPTURED_PACKETS[5]);
  const [packetCount, setPacketCount] = useState(38421);
  const [copiedHex, setCopiedHex] = useState(false);
  const [wiresharkActive, setWiresharkActive] = useState(false);

  useEffect(() => {
    if (!isOpen || !isStreaming) return;
    const interval = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 8 + 1));
    }, 600);
    return () => clearInterval(interval);
  }, [isOpen, isStreaming]);

  if (!isOpen) return null;

  const handleCopyHex = () => {
    const hex = `0000  00 15 5d 01 22 90 52 54  00 8a fe 11 08 00 45 00
0010  00 3c 2b 81 40 00 40 06  b8 1f c0 a8 01 91 8c 52
0020  79 04 c0 1e 01 bb d4 f7  3f 1a 80 18 01 f5 a2 b1
0030  16 03 01 02 00 01 00 01  fc 03 03 7b d1 c4 e8 22`;
    navigator.clipboard.writeText(hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const handleClearBuffer = () => {
    setCapturedPackets([]);
    setPacketCount(0);
    setTimeout(() => {
      setCapturedPackets(CAPTURED_PACKETS);
      setPacketCount(38421);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070f19]/85 backdrop-blur-md flex items-center justify-center p-2 lg:p-6 overflow-y-auto">
      <div className="relative w-full max-w-[1540px] bg-[#141c27] rounded-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden max-h-[96vh] my-auto border border-[#2d3541] text-[#dbe3f2]">
        {/* Top Highlight */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#4cd7f6] via-[#4edea3] to-[#06b6d4]" />

        {/* Modal Header */}
        <header className="bg-[#18202b] px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-[#2d3541]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-['Geist'] text-lg font-bold text-white">FR_OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Geist'] text-sm font-semibold text-white flex items-center gap-2">
                  Live Packet Capture & Dissector
                  <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-1.5 py-0.5 rounded border border-[#2d3541]">
                    RFC_1761_PCAP_STREAM
                  </span>
                </span>
                <span className="font-mono text-[10px] text-[#869397]">
                  KERNEL_RING // eBPF_AF_PACKET_V3_RX
                </span>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#232a36] text-[#4edea3] border border-[#2d3541]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
                <span>RUNNER: eBPF ZERO-COPY</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] border border-[#2d3541]">
                RING: 64 MB
              </div>
              <div className="px-2 py-0.5 rounded bg-[#232a36] text-[#869397] border border-[#2d3541]">
                NS: net.diag.pcap_live
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setWiresharkActive(!wiresharkActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-md cursor-pointer ${
                wiresharkActive
                  ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_rgba(78,222,163,0.5)]'
                  : 'bg-[#232a36] text-[#dbe3f2] hover:bg-[#323a46]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">sensors</span>
              <span>{wiresharkActive ? 'Wireshark Pipe: STREAMING' : 'Stream Live (Wireshark Pipe)'}</span>
            </button>

            <button
              onClick={handleClearBuffer}
              className="px-2.5 py-1.5 rounded-lg bg-[#232a36] text-[#bcc9cd] hover:text-white transition-colors border border-[#2d3541] flex items-center gap-1"
              title="Flush ring buffer"
            >
              <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#232a36] hover:bg-[#93000a]/40 text-[#869397] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#0c141f]">
          {/* Controls Bar */}
          <section className="bg-[#141c27] rounded-xl p-4 flex flex-col gap-3 border border-[#2d3541] font-mono text-xs shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Interface */}
              <div className="md:col-span-4 flex flex-col gap-1">
                <label className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">settings_ethernet</span>
                  Interface Tap
                </label>
                <div className="flex rounded-lg bg-[#070f19] p-1 border border-[#2d3541] text-xs">
                  {['eth0', 'vlan20', 'wg0', 'any'].map((iface) => (
                    <button
                      key={iface}
                      onClick={() => setInterfaceTap(iface)}
                      className={`flex-1 py-1 rounded transition-colors ${
                        interfaceTap === iface
                          ? 'bg-[#06b6d4] text-[#00424f] font-bold'
                          : 'text-[#bcc9cd] hover:text-white'
                      }`}
                    >
                      {iface === 'eth0' ? 'WAN (eth0)' : iface === 'vlan20' ? 'LAN (vlan20)' : iface === 'wg0' ? 'WG (wg0)' : 'All (any)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction */}
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#4edea3]">swap_vert</span>
                  Direction
                </label>
                <div className="flex rounded-lg bg-[#070f19] p-1 border border-[#2d3541] text-xs">
                  <button className="flex-1 py-1 rounded bg-[#232a36] text-white font-bold">Both (In/Out)</button>
                  <button className="flex-1 py-1 rounded text-[#bcc9cd] hover:text-white">Ingress</button>
                  <button className="flex-1 py-1 rounded text-[#bcc9cd] hover:text-white">Egress</button>
                </div>
              </div>

              {/* Snaplen */}
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#d0bcff]">memory</span>
                  Packet Slice / Ring
                </label>
                <select className="w-full bg-[#070f19] text-[#dbe3f2] rounded-lg px-2.5 py-1.5 border border-[#2d3541] outline-none cursor-pointer">
                  <option>Full Packet (1514 B / MTU)</option>
                  <option>Snaplen: 128 Bytes (Headers Only)</option>
                  <option>Circular Ring: 50,000 Pkts</option>
                </select>
              </div>

              {/* Stream toggle */}
              <div className="md:col-span-2 flex items-end gap-2 h-full justify-end">
                <button
                  type="button"
                  onClick={() => setIsStreaming(!isStreaming)}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isStreaming
                      ? 'bg-[#232a36] text-[#bcc9cd] hover:text-white border border-[#2d3541]'
                      : 'bg-[#4edea3] text-[#003824]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isStreaming ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isStreaming ? 'Pause' : 'Resume'}</span>
                </button>
              </div>
            </div>

            {/* BPF Filter Input */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-1">
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3 font-bold text-[#4cd7f6] select-none text-xs">BPF&gt;</span>
                <input
                  type="text"
                  value={bpfFilter}
                  onChange={(e) => setBpfFilter(e.target.value)}
                  className="w-full bg-[#070f19] text-[#dbe3f2] pl-12 pr-40 py-1.5 rounded-lg border border-[#2d3541] focus:outline-none focus:border-[#4cd7f6]"
                />
                <div className="absolute right-2 flex items-center gap-1 px-2 py-0.5 rounded bg-[#18202b] text-[10px] text-[#4edea3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                  <span>JIT VALID</span>
                </div>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1 flex-wrap text-[10px]">
                <span className="text-[#869397] uppercase">Presets:</span>
                <button
                  onClick={() => setBpfFilter('port 53')}
                  className="px-2 py-0.5 rounded bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6] border border-[#2d3541]"
                >
                  DNS (53)
                </button>
                <button
                  onClick={() => setBpfFilter('tcp[tcpflags] & (tcp-syn) != 0 and port 443')}
                  className="px-2 py-0.5 rounded bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6] border border-[#2d3541]"
                >
                  TLS Handshake
                </button>
                <button
                  onClick={() => setBpfFilter('port 5060 or portrange 10000-20000')}
                  className="px-2 py-0.5 rounded bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6] border border-[#2d3541]"
                >
                  VoIP SIP/RTP
                </button>
                <button
                  onClick={() => setBpfFilter('icmp or arp')}
                  className="px-2 py-0.5 rounded bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6] border border-[#2d3541]"
                >
                  ICMP & ARP
                </button>
                <button
                  onClick={() => setBpfFilter('tcp[tcpflags] & (tcp-rst) != 0')}
                  className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30"
                >
                  Drop Probes
                </button>
              </div>
            </div>
          </section>

          {/* KPI Strip */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#141c27] p-3 rounded-xl border border-[#2d3541] flex flex-col justify-between">
              <span className="text-[10px] text-[#869397] uppercase">Captured Packets</span>
              <div className="my-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">{packetCount.toLocaleString()}</span>
                <span className="text-[11px] text-[#4edea3]">pkts</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#bcc9cd]">
                <span>Rate: <strong className="text-[#4edea3]">1,420 pkts/s</strong></span>
                <span className="text-[#869397]">Peak: 4.1k/s</span>
              </div>
            </div>

            <div className="bg-[#141c27] p-3 rounded-xl border border-[#2d3541] flex flex-col justify-between">
              <span className="text-[10px] text-[#869397] uppercase">Throughput Stream</span>
              <div className="my-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">14.8</span>
                <span className="text-[11px] text-[#869397]">/ 64 MB</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#bcc9cd]">
                <span>Buffer: <strong className="text-[#4cd7f6]">23.1%</strong></span>
                <span className="text-[#4edea3]">4.82 Gbps WAN</span>
              </div>
            </div>

            <div className="bg-[#141c27] p-3 rounded-xl border border-[#2d3541] flex flex-col justify-between">
              <span className="text-[10px] text-[#869397] uppercase">Kernel Drops</span>
              <div className="my-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#4edea3]">0</span>
                <span className="text-[11px] text-[#4edea3]">pkts</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#bcc9cd]">
                <span>0.000% Loss</span>
                <span className="text-[#4cd7f6]">Zero-Copy Mode</span>
              </div>
            </div>

            <div className="bg-[#141c27] p-3 rounded-xl border border-[#2d3541] flex flex-col justify-between">
              <span className="text-[10px] text-[#869397] uppercase">Protocols Active</span>
              <div className="my-1 flex items-center gap-1.5 flex-wrap text-[10px]">
                <span className="px-1 rounded bg-[#232a36] text-[#4cd7f6]">TCP 74%</span>
                <span className="px-1 rounded bg-[#232a36] text-[#4edea3]">UDP 19%</span>
                <span className="px-1 rounded bg-[#232a36] text-[#d0bcff]">ICMP 5%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-[#4cd7f6] w-[74%] h-full" />
                <div className="bg-[#4edea3] w-[19%] h-full" />
                <div className="bg-[#d0bcff] w-[7%] h-full" />
              </div>
            </div>
          </section>

          {/* Split Table & Inspector Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[380px] font-mono">
            {/* Stream Table (7 cols) */}
            <div className="lg:col-span-7 bg-[#141c27] rounded-xl border border-[#2d3541] flex flex-col overflow-hidden">
              <div className="px-4 py-2 bg-[#18202b] border-b border-[#2d3541] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-['Geist'] text-xs font-semibold text-white">Live Stream Table</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#070f19] text-[#869397]">AUTOSCROLL: ON</span>
                </div>
                <span className="text-[#4edea3] text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" /> STREAMING
                </span>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[320px] select-none text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#070f19] text-[#869397] text-[10px] uppercase sticky top-0 border-b border-[#2d3541]">
                    <tr>
                      <th className="py-1.5 px-2.5 text-center w-12">No.</th>
                      <th className="py-1.5 px-2">Time</th>
                      <th className="py-1.5 px-2">Source</th>
                      <th className="py-1.5 px-2">Destination</th>
                      <th className="py-1.5 px-2 text-center">Proto</th>
                      <th className="py-1.5 px-2 text-right">Length</th>
                      <th className="py-1.5 px-3">Info / Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d3541]/40 text-[11px]">
                    {capturedPackets.map((pkt) => {
                      const isSelected = selectedPacket.no === pkt.no;
                      return (
                        <tr
                          key={pkt.no}
                          onClick={() => setSelectedPacket(pkt)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#06b6d4]/20 font-bold border-l-2 border-[#4cd7f6]'
                              : pkt.isDrop
                              ? 'bg-[#93000a]/15 text-[#ffb4ab]'
                              : 'hover:bg-[#18202b]'
                          }`}
                        >
                          <td className="py-1 px-2.5 text-center text-[#869397]">#{pkt.no}</td>
                          <td className="py-1 px-2 text-[#bcc9cd]">{pkt.timeOffset}</td>
                          <td className="py-1 px-2 text-[#4cd7f6] truncate max-w-[120px]">{pkt.source}</td>
                          <td className="py-1 px-2 text-white truncate max-w-[120px]">{pkt.destination}</td>
                          <td className="py-1 px-2 text-center">
                            <span className={`px-1 rounded text-[9px] font-bold ${
                              pkt.protocol === 'DNS'
                                ? 'bg-[#4edea3]/20 text-[#4edea3]'
                                : pkt.protocol === 'TCP'
                                ? 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                                : pkt.protocol === 'TLSv1.3'
                                ? 'bg-[#d0bcff]/20 text-[#d0bcff]'
                                : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                            }`}>
                              {pkt.protocol}
                            </span>
                          </td>
                          <td className="py-1 px-2 text-right text-[#869397]">{pkt.length} B</td>
                          <td className="py-1 px-3 text-[#bcc9cd] truncate max-w-[200px]">{pkt.info}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Layers Accordion + Hex/ASCII (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="bg-[#141c27] rounded-xl p-3 border border-[#2d3541] flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#2d3541] text-xs">
                  <span className="font-['Geist'] text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#d0bcff]">account_tree</span>
                    Packet Layers (#{selectedPacket.no})
                  </span>
                  <span className="text-[#869397] text-[10px]">L2/L3/L4/L7</span>
                </div>

                <div className="space-y-1 text-xs">
                  <details className="bg-[#18202b] rounded p-1.5 border border-[#2d3541]" open>
                    <summary className="cursor-pointer text-[#dbe3f2] font-semibold text-[11px] flex justify-between">
                      <span>Frame {selectedPacket.no}: {selectedPacket.length} bytes on wire</span>
                      <span className="text-[#869397]">eth0</span>
                    </summary>
                    <div className="mt-1 pl-2 text-[10px] text-[#869397] border-l border-[#2d3541] space-y-0.5">
                      <div>Arrival: Oct 24, 2024 16:42:09 UTC</div>
                      <div>Interface: 0 (eth0), HW Type: Ethernet (1)</div>
                    </div>
                  </details>

                  <details className="bg-[#18202b] rounded p-1.5 border border-[#2d3541]" open>
                    <summary className="cursor-pointer text-[#4cd7f6] font-semibold text-[11px] flex justify-between">
                      <span>IPv4, Src: {selectedPacket.source}, Dst: {selectedPacket.destination}</span>
                      <span className="text-[#869397]">TTL 64</span>
                    </summary>
                    <div className="mt-1 pl-2 text-[10px] text-[#bcc9cd] border-l border-[#4cd7f6]/40 space-y-0.5">
                      <div>Header: 20 bytes | Flags: 0x4000, Don't fragment</div>
                      <div>Protocol: {selectedPacket.protocol}</div>
                    </div>
                  </details>

                  <details className="bg-[#18202b] rounded p-1.5 border border-[#2d3541]" open>
                    <summary className="cursor-pointer text-[#d0bcff] font-semibold text-[11px] flex justify-between">
                      <span>Transport & Payload Inspection</span>
                      <span className="text-[#4edea3]">SNI: api.github.com</span>
                    </summary>
                    <div className="mt-1 pl-2 text-[10px] text-[#bcc9cd] border-l border-[#d0bcff]/40 space-y-0.5">
                      <div>Info: {selectedPacket.info}</div>
                      <div>JA4: t13d1516h2_8daaf6152771_...</div>
                    </div>
                  </details>
                </div>
              </div>

              {/* Hex / ASCII Box */}
              <div className="bg-[#141c27] rounded-xl p-3 border border-[#2d3541] flex flex-col flex-1">
                <div className="flex items-center justify-between pb-1 border-b border-[#2d3541] text-xs">
                  <span className="font-['Geist'] text-xs font-semibold text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">data_array</span>
                    Hex / ASCII Memory Dissector
                  </span>
                  <button
                    onClick={handleCopyHex}
                    className="text-[#869397] hover:text-white flex items-center gap-1 text-[10px]"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedHex ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedHex ? 'Copied' : 'Copy Hex'}</span>
                  </button>
                </div>

                <div className="mt-2 bg-[#070f19] p-2 rounded-lg border border-[#2d3541] font-mono text-[10px] leading-4 text-[#bcc9cd] overflow-x-auto flex-1">
                  <div className="flex gap-3">
                    <div className="text-[#869397] select-none space-y-0.5">
                      <div>0000</div>
                      <div>0010</div>
                      <div>0020</div>
                      <div>0030</div>
                    </div>
                    <div className="text-white space-y-0.5 tracking-wider">
                      <div>00 15 5d 01 22 90 52 54  00 8a fe 11 08 00 <span className="text-[#4cd7f6]">45 00</span></div>
                      <div><span className="text-[#4cd7f6]">00 3c 2b 81 40 00 40 06</span>  <span className="text-[#4edea3]">b8 1f c0 a8 01 91 8c 52</span></div>
                      <div><span className="text-[#4edea3]">79 04</span> <span className="text-[#d0bcff]">c0 1e 01 bb d4 f7</span>  <span className="text-[#d0bcff]">3f 1a 80 18 01 f5 a2 b1</span></div>
                      <div>16 03 01 02 00 01 00 01  fc 03 03 7b d1 c4 e8 22</div>
                    </div>
                    <div className="text-[#869397] border-l border-[#2d3541] pl-2 select-none space-y-0.5">
                      <div>..]..RT...E.</div>
                      <div>.&lt;.@.@.....R</div>
                      <div>y.....?.....</div>
                      <div>........{'{'}."</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-[#18202b] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#2d3541] font-mono text-xs">
          <div className="flex items-center gap-2 text-[#869397] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
            <span className="text-white">eBPF TPACKET_V3 ACTIVE</span>
            <span>|</span>
            <span>BPF: JIT-Compiled</span>
            <span>|</span>
            <span>Pipe: /tmp/fr_os_pcap.pipe</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1 rounded bg-[#232a36] text-[#bcc9cd] hover:text-white transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
