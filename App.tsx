
import React, { useState, useEffect, useMemo } from 'react';
import { Team, Player, ScreenState, MatchResult, Fixture, MatchEvent, NewsItem, TransferOffer, TransferLog } from './types';
import { INITIAL_TEAMS, generateSchedule } from './data';
import SplashScreen from './screens/SplashScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import DashboardScreen from './screens/DashboardScreen';
import SquadScreen from './screens/SquadScreen';
import TacticsScreen from './screens/TacticsScreen';
import MatchScreen from './screens/MatchScreen';
import MarketScreen from './screens/MarketScreen';
import FinanceScreen from './screens/FinanceScreen';
import LeagueScreen from './screens/LeagueScreen';
import CalendarScreen from './screens/CalendarScreen';
import NewsScreen from './screens/NewsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChampionScreen from './screens/ChampionScreen';
import GameOverScreen from './screens/GameOverScreen';
import { Toaster, toast } from 'react-hot-toast';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('SPLASH');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [funds, setFunds] = useState(1200000);
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gameOverReason, setGameOverReason] = useState("");
  const [season, setSeason] = useState(2026);

  const userTeam = useMemo(() => teams.find(t => t.id === userTeamId), [teams, userTeamId]);

  const standingsA = useMemo(() => {
    return [...teams]
      .filter(t => t.division === 1)
      .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
  }, [teams]);

  const isWindowOpen = useMemo(() => (currentRound >= 1 && currentRound <= 5) || (currentRound >= 10 && currentRound <= 14), [currentRound]);

  const nextOpponent = useMemo(() => {
    if (!userTeamId || !fixtures.length) return null;
    const fixture = fixtures.find(f => f.round === currentRound && (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId));
    if (!fixture) return null;
    const opponentId = fixture.homeTeamId === userTeamId ? fixture.awayTeamId : fixture.homeTeamId;
    return teams.find(t => t.id === opponentId) || null;
  }, [userTeamId, currentRound, fixtures, teams]);

  const handleMatchFinished = (userGoals: number, opponentGoals: number, events: MatchEvent[]) => {
    const roundResults: MatchResult[] = [];
    let roundRevenue = 0;
    
    // Deep clone teams and rosters to ensure reactivity for scores and scorers
    const updatedTeams = teams.map(team => {
      const match = fixtures.find(f => f.round === currentRound && (f.homeTeamId === team.id || f.awayTeamId === team.id));
      if (!match) return team;

      const isHome = match.homeTeamId === team.id;
      const isUserMatch = match.homeTeamId === userTeamId || match.awayTeamId === userTeamId;
      
      let goalsScored = isUserMatch ? (isHome ? userGoals : opponentGoals) : Math.floor(Math.random() * 4);
      let goalsConceded = isUserMatch ? (isHome ? opponentGoals : userGoals) : Math.floor(Math.random() * 4);

      // Clone team and roster for immutability
      const newRoster = team.roster.map(p => ({ ...p }));
      const newTeam = { ...team, roster: newRoster };

      newTeam.played += 1;
      newTeam.gf += goalsScored;
      newTeam.ga += goalsConceded;

      if (goalsScored > goalsConceded) {
        newTeam.won += 1;
        newTeam.points += 3;
        newTeam.moral = Math.min(100, newTeam.moral + 5);
      } else if (goalsScored === goalsConceded) {
        newTeam.drawn += 1;
        newTeam.points += 1;
      } else {
        newTeam.lost += 1;
        newTeam.moral = Math.max(0, newTeam.moral - 5);
      }

      // Record goal scorers (using the cloned roster)
      if (goalsScored > 0) {
        for (let i = 0; i < goalsScored; i++) {
          const lineupPlayers = newTeam.roster.filter(p => newTeam.lineup.includes(p.id));
          if (lineupPlayers.length > 0) {
            const weights = lineupPlayers.map(p => (p.position === 'ATA' ? 6 : p.position === 'MEI' ? 3 : 1));
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            let chosenIdx = 0;
            for (let j = 0; j < weights.length; j++) {
              random -= weights[j];
              if (random <= 0) { chosenIdx = j; break; }
            }
            lineupPlayers[chosenIdx].goals += 1;
          }
        }
      }

      if (isHome) {
         const awayT = teams.find(t => t.id === match.awayTeamId)!;
         const finalAwayScore = isUserMatch ? (match.homeTeamId === userTeamId ? opponentGoals : userGoals) : goalsConceded;
         roundResults.push({
            round: currentRound,
            homeTeamName: newTeam.name,
            awayTeamName: awayT.name,
            homeScore: goalsScored,
            awayScore: finalAwayScore,
            isUserMatch
         });
         
         if (newTeam.id === userTeamId) {
            roundRevenue = newTeam.stadiumCapacity * 0.4 * 50;
         }
      }

      return newTeam;
    });

    const finalFunds = funds + roundRevenue - (userTeam?.roster.length || 0) * 1500;
    setFunds(finalFunds);
    setTeams(updatedTeams);
    setMatchHistory(prev => [...roundResults, ...prev]);
    
    if (finalFunds < -500000) {
      setGameOverReason("O clube entrou em colapso financeiro absoluto.");
      setCurrentScreen('GAME_OVER');
      return;
    }

    const nextR = currentRound + 1;
    if (nextR > 18) {
      setCurrentScreen('CHAMPION');
    } else {
      setCurrentRound(nextR);
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleRestart = () => {
    setTeams(INITIAL_TEAMS);
    setCurrentRound(1);
    setSeason(2026);
    setFunds(1200000);
    setMatchHistory([]);
    setCurrentScreen('SPLASH');
  };

  return (
    <div className="w-full h-full min-h-screen bg-background text-white font-sans overflow-hidden">
      <Toaster position="top-center" />
      {currentScreen === 'SPLASH' && <SplashScreen onStart={() => { setFixtures(generateSchedule(INITIAL_TEAMS)); setCurrentScreen('TEAM_SELECT'); }} onContinue={() => setCurrentScreen('DASHBOARD')} hasSave={false} />}
      {currentScreen === 'TEAM_SELECT' && <TeamSelectionScreen teams={teams} onSelect={(id) => { setUserTeamId(id); setCurrentScreen('DASHBOARD'); }} onBack={() => setCurrentScreen('SPLASH')} />}
      {userTeam && currentScreen === 'DASHBOARD' && <DashboardScreen team={userTeam} nextOpponent={nextOpponent || teams[0]} standings={teams} round={currentRound} funds={funds} onboardingComplete={true} isWindowOpen={isWindowOpen} onCompleteOnboarding={() => {}} onOpenSquad={() => setCurrentScreen('SQUAD')} onOpenMarket={() => setCurrentScreen('MARKET')} onOpenFinance={() => setCurrentScreen('FINANCE')} onOpenCalendar={() => setCurrentScreen('CALENDAR')} onOpenLeague={() => setCurrentScreen('LEAGUE')} onOpenNews={() => setCurrentScreen('NEWS')} onOpenSettings={() => setCurrentScreen('SETTINGS')} onSimulate={() => setCurrentScreen('MATCH')} onOpenTactics={() => setCurrentScreen('TACTICS')} />}
      {userTeam && currentScreen === 'MATCH' && nextOpponent && <MatchScreen homeTeam={userTeam} awayTeam={nextOpponent} round={currentRound} onFinish={handleMatchFinished} />}
      {currentScreen === 'LEAGUE' && <LeagueScreen teams={teams} userTeamId={userTeamId} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'SQUAD' && userTeam && <SquadScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} onRenew={() => {}} />}
      {currentScreen === 'TACTICS' && userTeam && <TacticsScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} onSave={(f,s,l) => { setTeams(prev => prev.map(t => t.id === userTeamId ? {...t, formation: f, style: s, lineup: l} : t)); setCurrentScreen('DASHBOARD'); }} />}
      {currentScreen === 'FINANCE' && userTeam && <FinanceScreen team={userTeam} funds={funds} ticketPrice={50} onUpdateTicketPrice={() => {}} onBack={() => setCurrentScreen('DASHBOARD')} onLoan={(amt) => setFunds(f => f + amt)} onExpandStadium={() => {}} />}
      {currentScreen === 'MARKET' && userTeam && <MarketScreen userTeam={userTeam} allTeams={teams} funds={funds} isWindowOpen={isWindowOpen} offers={[]} logs={[]} onBack={() => setCurrentScreen('DASHBOARD')} onBuy={(p, tid, c) => { setTeams(prev => prev.map(t => t.id === userTeamId ? {...t, roster: [...t.roster, p]} : t.id === tid ? {...t, roster: t.roster.filter(x => x.id !== p.id)} : t)); setFunds(f => f - c); }} onLoanPlayer={() => {}} onSell={() => {}} onAcceptOffer={() => {}} onDeclineOffer={() => {}} />}
      {currentScreen === 'SETTINGS' && <SettingsScreen onBack={() => setCurrentScreen('DASHBOARD')} onSave={() => {}} onReset={handleRestart} session={null} onLoadCloud={() => {}} />}
      {currentScreen === 'GAME_OVER' && <GameOverScreen reason={gameOverReason} onRestart={handleRestart} />}
      {currentScreen === 'CHAMPION' && userTeam && <ChampionScreen champion={standingsA[0]} userTeam={userTeam} onNewSeason={() => {}} onQuit={handleRestart} teams={teams} />}
    </div>
  );
}
