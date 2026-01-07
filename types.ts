
export interface Player {
  id: string;
  name: string;
  position: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  age: number;
  overall: number;
  energy: number;
  status: 'fit' | 'injured' | 'suspended';
  yellowCards: number;
  isSuspended?: boolean;
  marketValue: number;
  goals: number;
  assists: number;
  potential: number;
  contractRounds: number;
  isOnLoan?: boolean;
  originalTeamId?: string;
  isForSale?: boolean;
  isListedForLoan?: boolean;
  valueTrend?: 'up' | 'down' | 'stable';
}

export interface NewsChoice {
  label: string;
  impact: {
    funds?: number;
    moral?: number;
    newsText?: string;
  };
}

export interface NewsItem {
  id: string;
  round: number;
  title: string;
  body: string;
  category: 'FINANCE' | 'MORAL' | 'HEALTH' | 'MARKET' | 'BOARD';
  impactText?: string;
  isRead: boolean;
  choices?: NewsChoice[];
}

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
  stadiumCapacity: number;
}

export interface MatchResult {
  round: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  isUserMatch: boolean;
  events?: MatchEvent[];
}

export interface Fixture {
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'whistle' | 'card_yellow' | 'card_red' | 'injury' | 'commentary';
  teamId?: string;
  playerName?: string;
  description: string;
}

// Added missing TransferOffer interface
export interface TransferOffer {
  id: string;
  offeringTeamId: string;
  offeringTeamName: string;
  playerId: string;
  playerName: string;
  value: number;
  round: number;
}

// Added missing TransferLog interface
export interface TransferLog {
  id: string;
  round: number;
  playerName: string;
  fromTeamName: string;
  toTeamName: string;
  value: number;
  type: 'buy' | 'sell' | 'loan';
}

export type FormationType = '4-4-2' | '4-3-3' | '3-5-2' | '5-4-1' | '4-5-1' | '5-3-2';
export type PlayingStyle = 'Ultra-Defensivo' | 'Defensivo' | 'Equilibrado' | 'Ofensivo' | 'Tudo-ou-Nada';

export type ScreenState = 'SPLASH' | 'TEAM_SELECT' | 'DASHBOARD' | 'SQUAD' | 'TACTICS' | 'MATCH' | 'MARKET' | 'FINANCE' | 'CALENDAR' | 'LEAGUE' | 'NEWS' | 'SETTINGS' | 'CHAMPION' | 'GAME_OVER';
