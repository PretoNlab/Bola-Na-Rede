export interface Player {
  id: string;
  name: string;
  position: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  age: number;
  overall: number;
  status: 'fit' | 'injured' | 'tired' | 'suspended';
  form?: number; // 0-100
  evolution?: number;
  marketValue: number; // Value in currency
}

export interface Team {
  id: string;
  name: string;
  shortName: string; // 3 letters
  city: string;
  logoColor1: string;
  logoColor2: string;
  attack: number;
  defense: number;
  roster: Player[];
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card_yellow' | 'card_red' | 'substitution' | 'injury' | 'whistle';
  teamId?: string; // If null, it's a general event like whistle
  playerId?: string;
  description: string;
}

export interface Match {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  events: MatchEvent[];
}

export type ScreenState = 'SPLASH' | 'TEAM_SELECT' | 'DASHBOARD' | 'SQUAD' | 'MATCH' | 'MARKET';