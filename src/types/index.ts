export type MainSection =
  | 'dashboard'
  | 'interfaces'
  | 'firewall-and-nat'
  | 'protection-and-ips'
  | 'dns-and-dhcp'
  | 'diagnostics'
  | 'system-settings';

export type ActiveModal =
  | null
  | 'lag-bond'
  | 'vlan-provision'
  | 'dns-override'
  | 'encrypted-dns'
  | 'dns-leak'
  | 'geo-ip-perimeter'
  | 'geoip-perimeter'
  | 'packet-trajectory'
  | 'mtr-diagnostics'
  | 'iperf-benchmark'
  | 'packet-capture'
  | 'bgp-explorer'
  | 'arp-ndp-cache'
  | 'arp-ndp';

export interface BgpPeer {
  id: string;
  name: string;
  asn: string;
  ip: string;
  interface: string;
  type: string;
  status: 'ESTAB' | 'ACTIVE' | 'IDLE';
  pfxReceived: string;
  pfxActive: string;
  holdTime: string;
  keepalive: string;
  rtt: string;
  uptime: string;
  loadPercent: number;
}

export interface BgpRoute {
  prefix: string;
  status: '* > best' | '* backup' | '! Blackhole';
  isBest: boolean;
  isBlackhole?: boolean;
  nextHop: string;
  interface: string;
  peerAsn: string;
  peerName: string;
  metric: number | string;
  localPref: number;
  asPath: string[];
  origin: 'i' | 'e' | '?';
  communities: string[];
  description?: string;
}

export interface NeighborEntry {
  id: string;
  type?: 'IPv4' | 'IPv6';
  protocol?: 'IPv4' | 'IPv6';
  state: 'PERMANENT' | 'REACHABLE' | 'STALE' | 'FAILED' | 'DELAY' | 'PROBE';
  ip: string;
  hostname: string;
  mac: string;
  vendor: string;
  vendorIcon?: string;
  interface: string;
  lastConfirmed?: string;
  updated?: string;
  flags?: string[];
  isStaticPin?: boolean;
}

export interface CapturedPacket {
  no: number;
  timeOffset: string;
  source: string;
  destination: string;
  protocol: 'DNS' | 'TCP' | 'TLSv1.3' | 'UDP' | 'ICMP' | 'XDP_DROP';
  length: number;
  info: string;
  isDrop?: boolean;
  hexPreview?: string[];
  asciiPreview?: string[];
  dissection?: {
    frame: string;
    ethernet: string;
    ip: string;
    transport: string;
    application?: string;
  };
}

export interface MtrHop {
  hopNumber: number;
  ip: string;
  hostname: string;
  asn: string;
  asnName: string;
  lossPercent: number;
  sent: number;
  received: number;
  lastMs: number;
  avgMs: number;
  bestMs: number;
  worstMs: number;
  stdDevMs: number;
  spectrumPercent: number;
}
