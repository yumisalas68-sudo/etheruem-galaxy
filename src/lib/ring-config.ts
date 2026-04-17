export interface RingConfig {
  name: string;
  radius: number;
  color: string;
  speed: number;
}

export const RING_CONFIGS: Record<string, RingConfig> = {
  Layer2: {
    name: 'Layer 2',
    radius: 40,
    color: '#4A90E2',
    speed: 0.0008
  },
  DeFi: {
    name: 'DeFi',
    radius: 70,
    color: '#7B68EE',
    speed: 0.0006
  },
  NFT: {
    name: 'NFT',
    radius: 100,
    color: '#FF6B9D',
    speed: 0.0004
  },
  Infrastructure: {
    name: 'Infrastructure',
    radius: 130,
    color: '#50C878',
    speed: 0.0003
  },
  Gaming: {
    name: 'Gaming',
    radius: 160,
    color: '#FFA500',
    speed: 0.0002
  },
  RWA: {
    name: 'RWA',
    radius: 190,
    color: '#FF4500',
    speed: 0.0002
  },
  Bridge: {
    name: 'Bridge',
    radius: 220,
    color: '#00CED1',
    speed: 0.0003
  },
  ZK: {
    name: 'ZK',
    radius: 250,
    color: '#9370DB',
    speed: 0.0004
  },
  DePIN: {
    name: 'DePIN',
    radius: 280,
    color: '#FFD700',
    speed: 0.0002
  },
  'Data & Analysis': {
    name: 'Data & Analysis',
    radius: 310,
    color: '#20B2AA',
    speed: 0.0003
  }
};

export const DEFAULT_RING: RingConfig = {
  name: 'Others',
  radius: 340,
  color: '#FFA500',
  speed: 0.0002
};

export function getRingConfig(tag: string): RingConfig {
  return RING_CONFIGS[tag] || DEFAULT_RING;
}
