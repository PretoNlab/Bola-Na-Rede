
import React, { useState, useEffect } from 'react';
import { Player, Team, ScreenState, MatchResult, Fixture, FormationType, PlayingStyle } from './types';
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

const SAVE_KEY = 'bolanarede_save';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('SPLASH');
  
  // Game State
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [funds, setFunds] = useState(1200000); // 1.2M
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [hasSave, setHasSave] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Check for local save on mount
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      setHasSave(true);
      try {
        const parsed = JSON.parse(savedData);
        loadGameState(parsed);
      } catch (e) {}
    }
  }, []);

  // Save game whenever critical state changes
  useEffect(() => {
    if (userTeamId && !['SPLASH', 'TEAM_SELECT', 'GAME_OVER'].includes(currentScreen)) {
      saveGameData();
    }
  }, [teams, userTeamId, currentRound, funds, matchHistory, fixtures, currentScreen, onboardingComplete]);

  const saveGameData = async () => {
    const state = { teams, userTeamId, currentRound, funds, matchHistory, fixtures, onboardingComplete, timestamp: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    setHasSave(true);
  };

  const handleManualSave = async () => {
    await saveGameData();
    toast.success("Jogo salvo!", { icon: '💾' });
  };

  const loadGameState = (parsed: any) => {
      setTeams(parsed.teams);
      setUserTeamId(parsed.userTeamId);
      setCurrentRound(parsed.currentRound);
      setFunds(parsed.funds);
      setMatchHistory(parsed.matchHistory || []);
      setFixtures(parsed.fixtures || generateSchedule(parsed.teams));
      setOnboardingComplete(parsed.onboardingComplete || false);
      if (parsed.userTeamId) setCurrentScreen('DASHBOARD');
  };

  const handleContinueGame = async () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      loadGameState(JSON.parse(savedData));
      toast.success("Jogo carregado!");
    }
  };

  const userTeam = teams.find(t => t.id === userTeamId);

  const nextMatchFixture = fixtures.find(f => f.round === currentRound && (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId));
  const nextOpponentId = nextMatchFixture 
    ? (nextMatchFixture.homeTeamId === userTeamId ? nextMatchFixture.awayTeamId : nextMatchFixture.homeTeamId)
    : null;
  const nextOpponent = teams.find(t => t.id === nextOpponentId);

  const handleStartCareer = () => {
    setTeams(INITIAL_TEAMS);
    setFixtures(generateSchedule(INITIAL_TEAMS));
    setCurrentRound(1);
    setFunds(1200000);
    setMatchHistory([]);
    setUserTeamId(null);
    setOnboardingComplete(false);
    setCurrentScreen('TEAM_SELECT');
  };

  const handleResetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setHasSave(false);
    handleStartCareer();
  };

  const handleNewSeason = () => {
    const resetTeams = teams.map(t => ({
      ...t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
      roster: t.roster.map(p => ({ ...p, goals: 0, assists: 0 }))
    }));
    setTeams(resetTeams);
    setFixtures(generateSchedule(resetTeams));
    setCurrentRound(1);
    setMatchHistory([]); 
    setCurrentScreen('DASHBOARD');
    toast.success("Nova temporada iniciada!");
  };
  
  const handleTeamSelect = (teamId: string) => {
    setUserTeamId(teamId);
    setCurrentScreen('DASHBOARD');
  };

  const handleUpdateTactics = (formation: FormationType, style: PlayingStyle, lineup: string[]) => {
     if (!userTeamId) return;
     setTeams(prev => prev.map(t => {
        if (t.id === userTeamId) {
           return { ...t, formation, style, lineup };
        }
        return t;
     }));
     toast.success("Tática atualizada!", { icon: '📋' });
  };

  const handleBuyPlayer = (player: Player, fromTeamId: string, cost: number) => {
    if (!userTeamId) return;
    setTeams(prev => prev.map(t => {
      // Remover do time antigo
      if (t.id === fromTeamId) {
        return { ...t, roster: t.roster.filter(p => p.id !== player.id) };
      }
      // Adicionar no time do usuário
      if (t.id === userTeamId) {
        return { ...t, roster: [...t.roster, player] };
      }
      return t;
    }));
    setFunds(prev => prev - cost);
    toast.success(`${player.name} contratado!`, { icon: '🤝' });
  };

  const handleSellPlayer = (player: Player, value: number) => {
    if (!userTeamId) return;
    setTeams(prev => prev.map(t => {
      if (t.id === userTeamId) {
        return { 
          ...t, 
          roster: t.roster.filter(p => p.id !== player.id),
          lineup: t.lineup.filter(id => id !== player.id) 
        };
      }
      return t;
    }));
    setFunds(prev => prev + value);
    toast.success(`${player.name} vendido!`, { icon: '💰' });
  };

  const handleMatchFinished = (userGoals: number, opponentGoals: number, userMatchScorers?: {scorerId: string, assisterId?: string}[]) => {
    const roundResults: MatchResult[] = [];
    const teamUpdates: Record<string, Team> = {};
    teams.forEach(t => teamUpdates[t.id] = JSON.parse(JSON.stringify(t)));

    const updatedFixtures = fixtures.map(fixture => {
       if (fixture.round === currentRound) {
          const isUserMatch = fixture.homeTeamId === userTeamId || fixture.awayTeamId === userTeamId;
          const homeT = teamUpdates[fixture.homeTeamId];
          const awayT = teamUpdates[fixture.awayTeamId];
          
          let hScore, aScore;
          if (isUserMatch) {
             hScore = fixture.homeTeamId === userTeamId ? userGoals : opponentGoals;
             aScore = fixture.homeTeamId === userTeamId ? opponentGoals : userGoals;
             
             if (userMatchScorers && userTeamId) {
                userMatchScorers.forEach(s => {
                   const player = teamUpdates[userTeamId].roster.find(p => p.id === s.scorerId);
                   if (player) player.goals += 1;
                });
             }
          } else {
             const res = calculateMatchResult(homeT, awayT);
             hScore = res.homeScore;
             aScore = res.awayScore;
             
             const attributeStats = (team: Team, goals: number) => {
                const attackers = team.roster.filter(p => p.position === 'ATA' || p.position === 'MEI');
                for (let i = 0; i < goals; i++) {
                   const scorer = attackers[Math.floor(Math.random() * attackers.length)] || team.roster[0];
                   scorer.goals += 1;
                }
             };
             attributeStats(homeT, hScore);
             attributeStats(awayT, aScore);
          }

          roundResults.push({
             round: currentRound, homeTeamName: homeT.name, awayTeamName: awayT.name,
             homeScore: hScore, awayScore: aScore, isUserMatch
          });

          homeT.played += 1; homeT.gf += hScore; homeT.ga += aScore;
          if (hScore > aScore) { homeT.won += 1; homeT.points += 3; }
          else if (hScore === aScore) { homeT.drawn += 1; homeT.points += 1; }
          else homeT.lost += 1;

          awayT.played += 1; awayT.gf += aScore; awayT.ga += hScore;
          if (aScore > hScore) { awayT.won += 1; awayT.points += 3; }
          else if (aScore === hScore) { awayT.drawn += 1; awayT.points += 1; }
          else awayT.lost += 1;

          return { ...fixture, played: true, homeScore: hScore, awayScore: aScore };
       }
       return fixture;
    });

    setFixtures(updatedFixtures);
    setTeams(Object.values(teamUpdates).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga)));
    setMatchHistory(prev => [...roundResults, ...prev]);

    let currentFunds = funds;
    if (userTeam) {
       const salary = Math.round(userTeam.roster.reduce((acc, p) => acc + p.marketValue, 0) * 0.003);
       currentFunds = funds - salary;
       if (nextMatchFixture?.homeTeamId === userTeamId) currentFunds += Math.floor(Math.random() * 80000) + 40000;
       setFunds(currentFunds);
    }

    setCurrentRound(r => r + 1);
    
    if (currentFunds < -1000000) {
       setCurrentScreen('GAME_OVER');
       return;
    }

    if (currentRound >= 18) setCurrentScreen('CHAMPION');
    else setCurrentScreen('DASHBOARD');
  };

  const calculateMatchResult = (home: Team, away: Team) => {
     const homeStr = (home.attack + home.defense) / 2;
     const awayStr = (away.attack + away.defense) / 2;
     const roll = Math.random() * 20;
     let hScore = 0, aScore = 0;
     if (homeStr + roll > awayStr + 5) hScore = Math.floor(Math.random() * 4);
     if (awayStr + roll > homeStr + 5) aScore = Math.floor(Math.random() * 3);
     return { homeScore: hScore, awayScore: aScore };
  };

  return (
    <div className="w-full h-full min-h-screen bg-background text-white font-sans overflow-hidden">
      <Toaster position="top-center" />
      {currentScreen === 'SPLASH' && <SplashScreen onStart={handleStartCareer} onContinue={handleContinueGame} hasSave={hasSave} />}
      {currentScreen === 'TEAM_SELECT' && <TeamSelectionScreen teams={teams} onSelect={handleTeamSelect} onBack={() => setCurrentScreen('SPLASH')} />}
      {currentScreen === 'DASHBOARD' && userTeam && (
        <DashboardScreen 
          team={userTeam} nextOpponent={nextOpponent || teams[0]} standings={teams} round={currentRound} funds={funds}
          onboardingComplete={onboardingComplete} onCompleteOnboarding={() => setOnboardingComplete(true)}
          onOpenSquad={() => setCurrentScreen('SQUAD')} onOpenMarket={() => setCurrentScreen('MARKET')} onOpenFinance={() => setCurrentScreen('FINANCE')}
          onOpenCalendar={() => setCurrentScreen('CALENDAR')} onOpenLeague={() => setCurrentScreen('LEAGUE')} onOpenNews={() => setCurrentScreen('NEWS')}
          onOpenSettings={() => setCurrentScreen('SETTINGS')} onSimulate={() => setCurrentScreen('MATCH')}
          onOpenTactics={() => setCurrentScreen('TACTICS')}
        />
      )}
      {currentScreen === 'SQUAD' && userTeam && <SquadScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'TACTICS' && userTeam && <TacticsScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} onSave={handleUpdateTactics} />}
      {currentScreen === 'MARKET' && userTeam && <MarketScreen userTeam={userTeam} allTeams={teams} funds={funds} onBack={() => setCurrentScreen('DASHBOARD')} onBuy={handleBuyPlayer} onSell={handleSellPlayer} />}
      {currentScreen === 'FINANCE' && userTeam && <FinanceScreen team={userTeam} funds={funds} onBack={() => setCurrentScreen('DASHBOARD')} onLoan={(amt) => setFunds(f => f + amt)} />}
      {currentScreen === 'LEAGUE' && <LeagueScreen teams={teams} userTeamId={userTeamId} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'CALENDAR' && <CalendarScreen history={matchHistory} currentRound={currentRound} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'NEWS' && <NewsScreen history={matchHistory} currentRound={currentRound} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'SETTINGS' && <SettingsScreen onBack={() => setCurrentScreen('DASHBOARD')} onSave={handleManualSave} onReset={handleResetGame} session={null} />}
      {currentScreen === 'CHAMPION' && userTeam && <ChampionScreen champion={teams[0]} userTeam={userTeam} onNewSeason={handleNewSeason} onQuit={() => setCurrentScreen('SPLASH')} />}
      {currentScreen === 'GAME_OVER' && <GameOverScreen reason="Falência financeira severa." onRestart={handleStartCareer} />}
      {currentScreen === 'MATCH' && userTeam && nextOpponent && (
        <MatchScreen 
          homeTeam={nextMatchFixture?.homeTeamId === userTeamId ? userTeam : nextOpponent} 
          awayTeam={nextMatchFixture?.homeTeamId === userTeamId ? nextOpponent : userTeam} 
          round={currentRound} 
          onFinish={handleMatchFinished} 
        />
      )}
    </div>
  );
}
