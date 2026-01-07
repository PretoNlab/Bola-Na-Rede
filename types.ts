
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
  goals: number; // Added: career goals in current season
  assists: number; // Added: career assists in current season
}

export type FormationType = '4-4-2' | '4-3-3' | '3-5-2' | '5-4-1' | '4-5-1' | '5-3-2';
export type PlayingStyle = 'Ultra-Defensivo' | 'Defensivo' | 'Equilibrado' | 'Ofensivo' | 'Tudo-ou-Nada';

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
  lineup: string[]; // Array of player IDs (11 starters)
  formation: FormationType;
  style: PlayingStyle;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  moral: number; // 0-100
  division: 1 | 2; // Added to distinguish divisions
}

export interface MatchResult {
  round: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  isUserMatch: boolean;
  scorers?: { teamId: string, playerId: string }[]; // Optional: track scorers
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'whistle' | 'card' | 'commentary';
  teamId?: string;
  playerId?: string;
  description: string;
}

export interface Fixture {
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export type ScreenState = 'SPLASH' | 'TEAM_SELECT' | 'DASHBOARD' | 'SQUAD' | 'TACTICS' | 'MATCH' | 'MARKET' | 'FINANCE' | 'CALENDAR' | 'LEAGUE' | 'NEWS' | 'SETTINGS' | 'CHAMPION' | 'GAME_OVER';
