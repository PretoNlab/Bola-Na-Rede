
import React, { useState, useEffect, useMemo } from 'react';
import { Team, Player, ScreenState, MatchResult, Fixture, FormationType, PlayingStyle } from './types';
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
import { Toaster, toast } from 'react-hot-toast';

const SAVE_KEY = 'bolanarede_manager_v3';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('SPLASH');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [funds, setFunds] = useState(1200000);
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(50);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) setHasSave(true);
  }, []);

  const userTeam = useMemo(() => teams.find(t => t.id === userTeamId), [teams, userTeamId]);
  
  const nextMatchFixture = useMemo(() => 
    fixtures.find(f => f.round === currentRound && (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId)),
    [fixtures, currentRound, userTeamId]
  );

  const nextOpponent = useMemo(() => {
    if (!nextMatchFixture || !userTeamId) return null;
    const oppId = nextMatchFixture.homeTeamId === userTeamId ? nextMatchFixture.awayTeamId : nextMatchFixture.homeTeamId;
    return teams.find(t => t.id === oppId);
  }, [nextMatchFixture, userTeamId, teams]);

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

  const handleContinue = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTeams(data.teams);
        setUserTeamId(data.userTeamId);
        setCurrentRound(data.currentRound);
        setFunds(data.funds);
        setMatchHistory(data.matchHistory || []);
        setFixtures(data.fixtures);
        setOnboardingComplete(data.onboardingComplete);
        setTicketPrice(data.ticketPrice || 50);
        setCurrentScreen('DASHBOARD');
      } catch (e) {
        toast.error("Erro ao carregar save.");
      }
    }
  };

  const handleTeamSelect = (teamId: string) => {
    setUserTeamId(teamId);
    setCurrentScreen('DASHBOARD');
    saveGame(teamId, teams, 1, 1200000, [], fixtures, false, 50);
  };

  const saveGame = (id: string|null, t: Team[], r: number, f: number, h: MatchResult[], fix: Fixture[], onboard: boolean, price: number) => {
    const state = { userTeamId: id, teams: t, currentRound: r, funds: f, matchHistory: h, fixtures: fix, onboardingComplete: onboard, ticketPrice: price, timestamp: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    setHasSave(true);
  };

  const handleBuyPlayer = (player: Player, fromTeamId: string, cost: number) => {
    if (funds < cost) {
      toast.error("Sem verba!");
      return;
    }

    setTeams(prev => prev.map(t => {
      if (t.id === fromTeamId) {
        return { ...t, roster: t.roster.filter(p => p.id !== player.id), lineup: t.lineup.filter(id => id !== player.id) };
      }
      if (t.id === userTeamId) {
        return { ...t, roster: [...t.roster, player] };
      }
      return t;
    }));

    setFunds(f => f - cost);
    toast.success(`${player.name} contratado!`);
  };

  const handleSellPlayer = (player: Player, value: number) => {
    if (userTeam && userTeam.roster.length <= 15) {
      toast.error("Elenco muito curto para vender!");
      return;
    }

    setTeams(prev => prev.map(t => {
      if (t.id === userTeamId) {
        return { ...t, roster: t.roster.filter(p => p.id !== player.id), lineup: t.lineup.filter(id => id !== player.id) };
      }
      return t;
    }));

    setFunds(f => f + value);
    toast.success(`${player.name} vendido!`);
  };

  const handleMatchFinished = (userGoals: number, opponentGoals: number) => {
    const roundResults: MatchResult[] = [];
    const teamUpdates = [...teams];
    let roundRevenue = 0;

    const updatedFixtures = fixtures.map(fix => {
      if (fix.round === currentRound) {
        const isUserMatch = fix.homeTeamId === userTeamId || fix.awayTeamId === userTeamId;
        const hIdx = teamUpdates.findIndex(t => t.id === fix.homeTeamId);
        const aIdx = teamUpdates.findIndex(t => t.id === fix.awayTeamId);

        let hScore, aScore;
        if (isUserMatch) {
          hScore = fix.homeTeamId === userTeamId ? userGoals : opponentGoals;
          aScore = fix.homeTeamId === userTeamId ? opponentGoals : userGoals;
          
          // Revenue logic: If user is home, they get ticket money
          if (fix.homeTeamId === userTeamId) {
            const attendance = Math.floor(20000 * (1 - (ticketPrice / 200))); // Simula público baseado no preço
            roundRevenue = attendance * ticketPrice;
          }
        } else {
          hScore = Math.floor(Math.random() * 4);
          aScore = Math.floor(Math.random() * 3);
        }

        teamUpdates[hIdx].played += 1;
        teamUpdates[hIdx].gf += hScore;
        teamUpdates[hIdx].ga += aScore;
        if (hScore > aScore) { teamUpdates[hIdx].won += 1; teamUpdates[hIdx].points += 3; }
        else if (hScore === aScore) { teamUpdates[hIdx].drawn += 1; teamUpdates[hIdx].points += 1; }
        else teamUpdates[hIdx].lost += 1;

        teamUpdates[aIdx].played += 1;
        teamUpdates[aIdx].gf += aScore;
        teamUpdates[aIdx].ga += hScore;
        if (aScore > hScore) { teamUpdates[aIdx].won += 1; teamUpdates[aIdx].points += 3; }
        else if (aScore === hScore) { teamUpdates[aIdx].drawn += 1; teamUpdates[aIdx].points += 1; }
        else teamUpdates[aIdx].lost += 1;

        roundResults.push({
          round: currentRound,
          homeTeamName: teamUpdates[hIdx].name,
          awayTeamName: teamUpdates[aIdx].name,
          homeScore: hScore,
          awayScore: aScore,
          isUserMatch,
          revenue: isUserMatch && fix.homeTeamId === userTeamId ? roundRevenue : 0
        });

        return { ...fix, played: true, homeScore: hScore, awayScore: aScore };
      }
      return fix;
    });

    const wageCost = (userTeam?.roster.length || 0) * 1500;
    const finalFunds = funds + roundRevenue - wageCost;

    setTeams(teamUpdates);
    setFixtures(updatedFixtures);
    setMatchHistory(prev => [...roundResults, ...prev]);
    setFunds(finalFunds);
    
    if (currentRound >= 18) {
      setCurrentScreen('CHAMPION');
    } else {
      setCurrentRound(r => r + 1);
      setCurrentScreen('DASHBOARD');
    }
    
    saveGame(userTeamId, teamUpdates, currentRound + 1, finalFunds, [...roundResults, ...matchHistory], updatedFixtures, onboardingComplete, ticketPrice);
  };

  return (
    <div className="w-full h-full min-h-screen bg-background text-white font-sans overflow-hidden">
      <Toaster position="top-center" />
      
      {currentScreen === 'SPLASH' && (
        <SplashScreen onStart={handleStartCareer} onContinue={handleContinue} hasSave={hasSave} />
      )}

      {currentScreen === 'TEAM_SELECT' && (
        <TeamSelectionScreen teams={teams} onSelect={handleTeamSelect} onBack={() => setCurrentScreen('SPLASH')} />
      )}

      {userTeam && currentScreen === 'DASHBOARD' && (
        <DashboardScreen 
          team={userTeam} nextOpponent={nextOpponent || teams[0]} standings={teams} round={currentRound} funds={funds}
          onboardingComplete={onboardingComplete} onCompleteOnboarding={() => setOnboardingComplete(true)}
          onOpenSquad={() => setCurrentScreen('SQUAD')} onOpenMarket={() => setCurrentScreen('MARKET')} onOpenFinance={() => setCurrentScreen('FINANCE')}
          onOpenCalendar={() => setCurrentScreen('CALENDAR')} onOpenLeague={() => setCurrentScreen('LEAGUE')} onOpenNews={() => setCurrentScreen('NEWS')}
          onOpenSettings={() => setCurrentScreen('SETTINGS')} onSimulate={() => setCurrentScreen('MATCH')}
          onOpenTactics={() => setCurrentScreen('TACTICS')}
        />
      )}

      {userTeam && currentScreen === 'MATCH' && nextOpponent && (
        <MatchScreen homeTeam={userTeam} awayTeam={nextOpponent} round={currentRound} onFinish={handleMatchFinished} />
      )}

      {userTeam && currentScreen === 'SQUAD' && <SquadScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} />}
      
      {userTeam && currentScreen === 'TACTICS' && <TacticsScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} onSave={(f, s, l) => {
        setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, formation: f, style: s, lineup: l } : t));
        setCurrentScreen('DASHBOARD');
      }} />}
      
      {currentScreen === 'LEAGUE' && <LeagueScreen teams={teams} userTeamId={userTeamId} onBack={() => setCurrentScreen('DASHBOARD')} />}
      
      {currentScreen === 'FINANCE' && userTeam && (
        <FinanceScreen 
          team={userTeam} funds={funds} onBack={() => setCurrentScreen('DASHBOARD')} 
          onLoan={(amt) => setFunds(f => f + amt)} 
          ticketPrice={ticketPrice}
          onUpdateTicketPrice={setTicketPrice}
        />
      )}

      {currentScreen === 'MARKET' && userTeam && (
        <MarketScreen 
          userTeam={userTeam} allTeams={teams} funds={funds} onBack={() => setCurrentScreen('DASHBOARD')} 
          onBuy={handleBuyPlayer} 
          onSell={handleSellPlayer} 
        />
      )}

      {currentScreen === 'CALENDAR' && <CalendarScreen history={matchHistory} currentRound={currentRound} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'NEWS' && <NewsScreen history={matchHistory} currentRound={currentRound} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'SETTINGS' && <SettingsScreen onBack={() => setCurrentScreen('DASHBOARD')} onSave={() => {}} onReset={handleStartCareer} session={null} />}
      {currentScreen === 'CHAMPION' && userTeam && (
         <ChampionScreen champion={teams.sort((a,b) => b.points - a.points)[0]} userTeam={userTeam} onNewSeason={handleStartCareer} onQuit={() => setCurrentScreen('SPLASH')} />
      )}
    </div>
  );
}
