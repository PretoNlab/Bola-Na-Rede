
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
  const isWindowOpen = useMemo(() => (currentRound >= 1 && currentRound <= 5) || (currentRound >= 10 && currentRound <= 14), [currentRound]);

  const nextOpponent = useMemo(() => {
    if (!userTeamId || !fixtures.length) return null;
    const fixture = fixtures.find(f => f.round === currentRound && (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId));
    if (!fixture) return null;
    const opponentId = fixture.homeTeamId === userTeamId ? fixture.awayTeamId : fixture.homeTeamId;
    return teams.find(t => t.id === opponentId) || null;
  }, [userTeamId, currentRound, fixtures, teams]);

  const generateRoundNews = (round: number) => {
    const newsList: NewsItem[] = [];
    if (Math.random() > 0.7) {
      newsList.push({
        id: Math.random().toString(36),
        round,
        title: "Patrocínio Pontual",
        body: "Uma marca local quer estampar o calção por um jogo. Aceitar?",
        category: 'FINANCE',
        isRead: false,
        choices: [
          { label: "Aceitar (R$ 50k)", impact: { funds: 50000, moral: -2, newsText: "Torcida achou o uniforme feio, mas o caixa agradece." } },
          { label: "Recusar", impact: { moral: 2, newsText: "Tradição mantida. A torcida gostou da postura." } }
        ]
      });
    }
    setNews(prev => [...newsList, ...prev]);
  };

  const handleNewsChoice = (newsId: string, impact: any) => {
    if (impact.funds) setFunds(f => f + impact.funds);
    if (impact.moral && userTeamId) {
       setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, moral: Math.min(100, Math.max(0, t.moral + impact.moral)) } : t));
    }
    setNews(prev => prev.map(n => n.id === newsId ? { ...n, isRead: true, choices: undefined, body: impact.newsText || n.body } : n));
    toast.success("Decisão tomada!");
  };

  const handleMatchFinished = (userGoals: number, opponentGoals: number, events: MatchEvent[]) => {
    const roundResults: MatchResult[] = [];
    let roundRevenue = 0;
    const teamUpdates = [...teams];

    fixtures.forEach(fix => {
      if (fix.round === currentRound) {
        const hTeam = teamUpdates.find(t => t.id === fix.homeTeamId)!;
        const aTeam = teamUpdates.find(t => t.id === fix.awayTeamId)!;
        const isUserMatch = fix.homeTeamId === userTeamId || fix.awayTeamId === userTeamId;

        const hScore = isUserMatch ? (fix.homeTeamId === userTeamId ? userGoals : opponentGoals) : Math.floor(Math.random() * 4);
        const aScore = isUserMatch ? (fix.homeTeamId === userTeamId ? opponentGoals : userGoals) : Math.floor(Math.random() * 4);

        hTeam.played += 1; aTeam.played += 1;
        hTeam.gf += hScore; hTeam.ga += aScore;
        aTeam.gf += aScore; aTeam.ga += hScore;

        if (hScore > aScore) { hTeam.won += 1; hTeam.points += 3; hTeam.moral = Math.min(100, hTeam.moral + 5); }
        else if (hScore === aScore) { hTeam.drawn += 1; aTeam.drawn += 1; hTeam.points += 1; aTeam.points += 1; }
        else { aTeam.won += 1; aTeam.points += 3; aTeam.moral = Math.min(100, aTeam.moral + 5); hTeam.moral = Math.max(0, hTeam.moral - 5); }

        roundResults.push({ round: currentRound, homeTeamName: hTeam.name, awayTeamName: aTeam.name, homeScore: hScore, awayScore: aScore, isUserMatch });
        if (fix.homeTeamId === userTeamId) roundRevenue = hTeam.stadiumCapacity * 0.4 * 50; // Receita simplificada
      }
    });

    const finalFunds = funds + roundRevenue - (userTeam?.roster.length || 0) * 1500;
    setFunds(finalFunds);
    setTeams(teamUpdates);
    setMatchHistory(prev => [...roundResults, ...prev]);
    
    if (finalFunds < -500000) {
      setGameOverReason("O clube entrou em colapso financeiro. A diretoria não aceita mais as suas dívidas.");
      setCurrentScreen('GAME_OVER');
      return;
    }

    const nextR = currentRound + 1;
    if (nextR > 18) {
      setCurrentScreen('CHAMPION');
    } else {
      setCurrentRound(nextR);
      generateRoundNews(nextR);
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleNextSeason = () => {
    // 1. Calcular Classificação Final
    const standingsA = [...teams].filter(t => t.division === 1).sort((a,b) => b.points - a.points || (b.gf-b.ga) - (a.gf-a.ga));
    const standingsB = [...teams].filter(t => t.division === 2).sort((a,b) => b.points - a.points || (b.gf-b.ga) - (a.gf-a.ga));

    const relegatedIds = standingsA.slice(-2).map(t => t.id);
    const promotedIds = standingsB.slice(0, 2).map(t => t.id);

    // 2. Atualizar Times (Promoção/Rebaixamento, Idade, Evolução e Reset)
    const updatedTeams = teams.map(team => {
      let newDiv = team.division;
      if (relegatedIds.includes(team.id)) newDiv = 2;
      if (promotedIds.includes(team.id)) newDiv = 1;

      const updatedRoster = team.roster.map(player => {
        const isYoung = player.age < 23;
        const isOld = player.age > 30;
        let ovrChange = 0;
        
        if (isYoung && Math.random() > 0.4) ovrChange = Math.floor(Math.random() * 3);
        else if (isOld && Math.random() > 0.5) ovrChange = -Math.floor(Math.random() * 2);

        return {
          ...player,
          age: player.age + 1,
          overall: Math.min(99, Math.max(40, player.overall + ovrChange)),
          goals: 0,
          assists: 0,
          energy: 100,
          yellowCards: 0,
          isSuspended: false
        };
      });

      return {
        ...team,
        division: newDiv,
        played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
        roster: updatedRoster,
        moral: 70 // Reset de moral para nova temporada
      };
    });

    setTeams(updatedTeams);
    setSeason(s => s + 1);
    setCurrentRound(1);
    setMatchHistory([]);
    setFixtures(generateSchedule(updatedTeams));
    setCurrentScreen('DASHBOARD');
    toast.success(`Temporada ${season + 1} iniciada!`, { icon: '🗓️' });
  };

  const handleRestart = () => {
    setTeams(INITIAL_TEAMS);
    setCurrentRound(1);
    setSeason(2026);
    setFunds(1200000);
    setMatchHistory([]);
    setNews([]);
    setCurrentScreen('SPLASH');
  };

  const getChampion = () => {
    const div1 = teams.filter(t => t.division === 1).sort((a,b) => b.points - a.points || (b.gf-b.ga) - (a.gf-a.ga))[0];
    return div1;
  };

  return (
    <div className="w-full h-full min-h-screen bg-background text-white font-sans overflow-hidden">
      <Toaster position="top-center" />
      
      {currentScreen === 'SPLASH' && <SplashScreen onStart={() => { setFixtures(generateSchedule(INITIAL_TEAMS)); setCurrentScreen('TEAM_SELECT'); }} onContinue={() => setCurrentScreen('DASHBOARD')} hasSave={false} />}
      {currentScreen === 'TEAM_SELECT' && <TeamSelectionScreen teams={teams} onSelect={(id) => { setUserTeamId(id); generateRoundNews(1); setCurrentScreen('DASHBOARD'); }} onBack={() => setCurrentScreen('SPLASH')} />}
      
      {userTeam && currentScreen === 'DASHBOARD' && (
        <DashboardScreen 
          team={userTeam} nextOpponent={nextOpponent || teams[0]} standings={teams} round={currentRound} funds={funds} onboardingComplete={true} isWindowOpen={isWindowOpen} news={news}
          onCompleteOnboarding={() => {}} onOpenSquad={() => setCurrentScreen('SQUAD')} onOpenMarket={() => setCurrentScreen('MARKET')} onOpenFinance={() => setCurrentScreen('FINANCE')} onOpenCalendar={() => setCurrentScreen('CALENDAR')} onOpenLeague={() => setCurrentScreen('LEAGUE')} onOpenNews={() => setCurrentScreen('NEWS')} onOpenSettings={() => setCurrentScreen('SETTINGS')} onSimulate={() => setCurrentScreen('MATCH')} onOpenTactics={() => setCurrentScreen('TACTICS')}
        />
      )}

      {userTeam && currentScreen === 'MATCH' && nextOpponent && <MatchScreen homeTeam={userTeam} awayTeam={nextOpponent} round={currentRound} onFinish={handleMatchFinished} />}
      {currentScreen === 'NEWS' && <NewsScreen news={news} onBack={() => setCurrentScreen('DASHBOARD')} onRead={() => {}} onChoice={handleNewsChoice} />}
      {currentScreen === 'LEAGUE' && <LeagueScreen teams={teams} userTeamId={userTeamId} onBack={() => setCurrentScreen('DASHBOARD')} />}
      {currentScreen === 'SQUAD' && userTeam && <SquadScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} onRenew={() => {}} />}
      {currentScreen === 'TACTICS' && userTeam && <TacticsScreen team={userTeam} onBack={() => setCurrentScreen('DASHBOARD')} onSave={(f,s,l) => { setTeams(prev => prev.map(t => t.id === userTeamId ? {...t, formation: f, style: s, lineup: l} : t)); setCurrentScreen('DASHBOARD'); }} />}
      {currentScreen === 'FINANCE' && userTeam && <FinanceScreen team={userTeam} funds={funds} ticketPrice={50} onUpdateTicketPrice={() => {}} onBack={() => setCurrentScreen('DASHBOARD')} onLoan={(amt) => setFunds(f => f + amt)} onExpandStadium={() => {}} />}
      {currentScreen === 'MARKET' && userTeam && <MarketScreen userTeam={userTeam} allTeams={teams} funds={funds} isWindowOpen={isWindowOpen} offers={[]} logs={[]} onBack={() => setCurrentScreen('DASHBOARD')} onBuy={(p, tid, c) => { setTeams(prev => prev.map(t => t.id === userTeamId ? {...t, roster: [...t.roster, p]} : t.id === tid ? {...t, roster: t.roster.filter(x => x.id !== p.id)} : t)); setFunds(f => f - c); }} onLoanPlayer={() => {}} onSell={() => {}} onAcceptOffer={() => {}} onDeclineOffer={() => {}} />}
      {currentScreen === 'SETTINGS' && <SettingsScreen onBack={() => setCurrentScreen('DASHBOARD')} onSave={() => {}} onReset={handleRestart} session={null} onLoadCloud={() => {}} />}
      {currentScreen === 'GAME_OVER' && <GameOverScreen reason={gameOverReason} onRestart={handleRestart} />}
      {currentScreen === 'CHAMPION' && userTeam && <ChampionScreen champion={getChampion()} userTeam={userTeam} onNewSeason={handleNextSeason} onQuit={handleRestart} teams={teams} />}
    </div>
  );
}
