
export interface Player {
  id: string;
  name: string;
  position: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  age: number;
  overall: number;
  status: 'fit' | 'injured' | 'tired' | 'suspended';
  form?: number;
  evolution?: number;
  marketValue: number;
  goals: number;
  assists: number;
}

export type FormationType = '4-4-2' | '4-3-3' | '3-5-2' | '5-4-1' | '4-5-1' | '5-3-2';
export type PlayingStyle = 'Ultra-Defensivo' | 'Defensivo' | 'Equilibrado' | 'Ofensivo' | 'Tudo-ou-Nada';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  logoColor1: string;
  logoColor2: string;
  attack: number;
  defense: number;
  roster: Player[];
  lineup: string[];
  formation: FormationType;
  style: PlayingStyle;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  moral: number;
  division: 1 | 2;
  prestige?: number;
  trophies?: number;
  ticketPrice?: number;
}

export interface MatchResult {
  round: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  isUserMatch: boolean;
  revenue?: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'whistle' | 'message';
  teamId?: string;
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
