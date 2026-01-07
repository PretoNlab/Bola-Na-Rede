import React, { useState, useEffect } from 'react';
import { Player, Team, Match, ScreenState, MatchResult, Fixture } from './types';
import { INITIAL_TEAMS, generateSchedule } from './data';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import SplashScreen from './screens/SplashScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import DashboardScreen from './screens/DashboardScreen';
import SquadScreen from './screens/SquadScreen';
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
  const [userSession, setUserSession] = useState<any>(null);

  // Initialize Supabase Session
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserSession(session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Check for local save on mount
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      setHasSave(true);
    }
  }, []);

  // Save game whenever critical state changes (Auto-save)
  useEffect(() => {
    if (userTeamId && currentScreen !== 'SPLASH' && currentScreen !== 'TEAM_SELECT' && currentScreen !== 'GAME_OVER') {
      saveGameData();
    }
  }, [teams, userTeamId, currentRound, funds, matchHistory, fixtures, currentScreen]);

  const getGameState = () => ({
    teams,
    userTeamId,
    currentRound,
    funds,
    matchHistory,
    fixtures,
    timestamp: Date.now()
  });

  const saveGameData = async () => {
    const stateToSave = getGameState();
    
    // 1. Local Save (Always works)
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    setHasSave(true);

    // 2. Cloud Save (If logged in)
    if (userSession && isSupabaseConfigured()) {
       const { error } = await supabase
        .from('game_saves')
        .upsert({ user_id: userSession.user.id, data: stateToSave });
       
       if (error) console.error('Cloud save failed', error);
    }
  };

  const handleManualSave = async () => {
    await saveGameData();
    toast.success(userSession ? "Jogo salvo na Nuvem e Local!" : "Jogo salvo Localmente!", { icon: '💾' });
  };

  const loadGameState = (parsed: any) => {
      // Ensure legacy compatibility
      const healedTeams = parsed.teams.map((t: Team) => ({
         ...t,
         roster: t.roster.map((p: Player) => ({
           ...p,
           marketValue: p.marketValue || (p.overall * p.overall * 200)
         }))
      }));
      
      setTeams(healedTeams);
      setUserTeamId(parsed.userTeamId);
      setCurrentRound(parsed.currentRound);
      setFunds(parsed.funds);
      setMatchHistory(parsed.matchHistory || []);
      
      if (!parsed.fixtures || parsed.fixtures.length === 0) {
         const newFixtures = generateSchedule(healedTeams);
         setFixtures(newFixtures);
      } else {
         setFixtures(parsed.fixtures);
      }

      setCurrentScreen('DASHBOARD');
  };

  const handleContinueGame = async () => {
    let loadedFromCloud = false;

    // Try cloud first if logged in
    if (userSession && isSupabaseConfigured()) {
       const { data, error } = await supabase
        .from('game_saves')
        .select('data')
        .eq('user_id', userSession.user.id)
        .single();
       
       if (data && data.data) {
          try {
             loadGameState(data.data);
             loadedFromCloud = true;
             toast.success("Jogo carregado da Nuvem!");
          } catch(e) {
             console.error(e);
          }
       }
    }

    // Fallback to local if no cloud save or not logged in
    if (!loadedFromCloud) {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          loadGameState(parsed);
          toast.success("Jogo carregado (Local)!");
        } catch (error) {
          toast.error("Erro ao carregar o jogo salvo.");
          console.error(error);
        }
      }
    }
  };

  const userTeam = teams.find(t => t.id === userTeamId);

  // Determine next opponent based on Schedule
  const nextMatchFixture = fixtures.find(f => f.round === currentRound && (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId));
  const nextOpponentId = nextMatchFixture 
    ? (nextMatchFixture.homeTeamId === userTeamId ? nextMatchFixture.awayTeamId : nextMatchFixture.homeTeamId)
    : null;
  const nextOpponent = teams.find(t => t.id === nextOpponentId);

  const handleStartCareer = () => {
    // Reset data for new career
    setTeams(INITIAL_TEAMS);
    const newFixtures = generateSchedule(INITIAL_TEAMS);
    setFixtures(newFixtures);
    setCurrentRound(1);
    setFunds(1200000);
    setMatchHistory([]);
    setUserTeamId(null);
    setCurrentScreen('TEAM_SELECT');
  };

  const handleResetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setHasSave(false);
    handleStartCareer();
  };

  const handleNewSeason = () => {
    // 1. Reset Stats, keep roster
    const resetTeams = teams.map(t => ({
      ...t,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
    }));
    setTeams(resetTeams);
    
    // 2. New Schedule
    const newFixtures = generateSchedule(resetTeams);
    setFixtures(newFixtures);
    
    // 3. Reset Round
    setCurrentRound(1);
    setMatchHistory([]); 
    
    setCurrentScreen('DASHBOARD');
    toast.success("Nova temporada iniciada!", { icon: '📅' });
  };
  
  const handleTeamSelect = (teamId: string) => {
    setUserTeamId(teamId);
    setCurrentScreen('DASHBOARD');
  };

  const handleSimulate = () => {
     if (nextOpponent) {
        setCurrentScreen('MATCH');
     } else {
        // Season Finished
        setCurrentScreen('CHAMPION');
     }
  };

  // MARKET LOGIC
  const handleBuyPlayer = (player: Player, fromTeamId: string, cost: number) => {
    if (!userTeamId) return;

    setFunds(prev => prev - cost);
    setTeams(prevTeams => {
       return prevTeams.map(t => {
          // Remove from source team
          if (t.id === fromTeamId) {
             return { ...t, roster: t.roster.filter(p => p.id !== player.id) };
          }
          // Add to user team
          if (t.id === userTeamId) {
             return { ...t, roster: [...t.roster, player] };
          }
          return t;
       });
    });
    toast.success(`${player.name} contratado!`, { icon: '✍️' });
  };

  const handleSellPlayer = (player: Player, value: number) => {
     if (!userTeamId) return;
     
     // Cannot sell if roster too small
     if (userTeam && userTeam.roster.length <= 15) {
        toast.error("Elenco muito pequeno para vender!");
        return;
     }

     setFunds(prev => prev + value);
     setTeams(prevTeams => {
        return prevTeams.map(t => {
           if (t.id === userTeamId) {
              return { ...t, roster: t.roster.filter(p => p.id !== player.id) };
           }
           return t;
        });
     });
     toast.success(`${player.name} vendido!`, { icon: '💸' });
  };

  // FINANCE LOGIC
  const handleLoan = (amount: number) => {
    setFunds(prev => prev + amount);
  };

  const calculateMatchResult = (home: Team, away: Team): { homeScore: number, awayScore: number } => {
     // Weighted random based on attack vs defense
     const homeAdvantage = 1.1; // 10% bonus for home team
     
     const homeAttack = (home.attack * homeAdvantage) + (Math.random() * 20);
     const awayAttack = away.attack + (Math.random() * 20);
     const homeDef = (home.defense * homeAdvantage) + (Math.random() * 20);
     const awayDef = away.defense + (Math.random() * 20);

     let hScore = 0;
     let aScore = 0;

     // Simple simulation logic
     if (homeAttack > awayDef) hScore += Math.floor(Math.random() * 4);
     if (awayAttack > homeDef) aScore += Math.floor(Math.random() * 3);
     
     return { homeScore: hScore, awayScore: aScore };
  };

  const handleMatchFinished = (userGoals: number, opponentGoals: number) => {
    const roundResults: MatchResult[] = [];
    
    // 1. Process User Match
    if (userTeam && nextOpponent) {
       roundResults.push({
          round: currentRound,
          homeTeamName: nextMatchFixture?.homeTeamId === userTeamId ? userTeam.name : nextOpponent.name,
          awayTeamName: nextMatchFixture?.homeTeamId === userTeamId ? nextOpponent.name : userTeam.name,
          homeScore: nextMatchFixture?.homeTeamId === userTeamId ? userGoals : opponentGoals,
          awayScore: nextMatchFixture?.homeTeamId === userTeamId ? opponentGoals : userGoals,
          isUserMatch: true
       });
    }

    // 2. Process ALL other matches in this round from Fixtures
    const currentRoundFixtures = fixtures.filter(f => f.round === currentRound);
    
    // Map to update teams
    const teamStatsUpdates: Record<string, { p: number, w: number, d: number, l: number, gf: number, ga: number }> = {};
    
    teams.forEach(t => {
       teamStatsUpdates[t.id] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
    });

    // Update with user result first
    if (userTeam && nextOpponent) {
       const isHome = nextMatchFixture?.homeTeamId === userTeamId;
       const uGoals = userGoals;
       const oGoals = opponentGoals;
       
       teamStatsUpdates[userTeam.id] = { 
          p: 1, w: uGoals > oGoals ? 1 : 0, d: uGoals === oGoals ? 1 : 0, l: uGoals < oGoals ? 1 : 0, gf: uGoals, ga: oGoals 
       };
       teamStatsUpdates[nextOpponent.id] = { 
          p: 1, w: oGoals > uGoals ? 1 : 0, d: oGoals === uGoals ? 1 : 0, l: oGoals < uGoals ? 1 : 0, gf: oGoals, ga: uGoals 
       };
    }

    // Simulate other games
    const updatedFixtures = fixtures.map(fixture => {
       if (fixture.round === currentRound) {
          // If it's the user match, mark as played
          if (fixture.homeTeamId === userTeamId || fixture.awayTeamId === userTeamId) {
             return { ...fixture, played: true, homeScore: fixture.homeTeamId === userTeamId ? userGoals : opponentGoals, awayScore: fixture.awayTeamId === userTeamId ? userGoals : opponentGoals };
          }
          
          // Simulate AI vs AI
          const homeT = teams.find(t => t.id === fixture.homeTeamId);
          const awayT = teams.find(t => t.id === fixture.awayTeamId);
          
          if (homeT && awayT) {
             const result = calculateMatchResult(homeT, awayT);
             
             // Store result for history
             roundResults.push({
                round: currentRound,
                homeTeamName: homeT.name,
                awayTeamName: awayT.name,
                homeScore: result.homeScore,
                awayScore: result.awayScore,
                isUserMatch: false
             });

             // Update stats accumulator
             teamStatsUpdates[homeT.id] = {
                p: 1, w: result.homeScore > result.awayScore ? 1 : 0, d: result.homeScore === result.awayScore ? 1 : 0, l: result.homeScore < result.awayScore ? 1 : 0, gf: result.homeScore, ga: result.awayScore
             };
             teamStatsUpdates[awayT.id] = {
                p: 1, w: result.awayScore > result.homeScore ? 1 : 0, d: result.awayScore === result.homeScore ? 1 : 0, l: result.awayScore < result.homeScore ? 1 : 0, gf: result.awayScore, ga: result.homeScore
             };

             return { ...fixture, played: true, homeScore: result.homeScore, awayScore: result.awayScore };
          }
       }
       return fixture;
    });

    setFixtures(updatedFixtures);
    
    // Apply stats updates to Teams state
    setTeams(prev => prev.map(t => {
       const update = teamStatsUpdates[t.id];
       if (update && update.p > 0) {
          const points = (t.points) + (update.w * 3) + update.d;
          return {
             ...t,
             played: t.played + update.p,
             won: t.won + update.w,
             drawn: t.drawn + update.d,
             lost: t.lost + update.l,
             gf: t.gf + update.gf,
             ga: t.ga + update.ga,
             points: points
          };
       }
       return t;
    }));
    
    setMatchHistory(prev => [...roundResults, ...prev]);

    // Deduct Salaries & Update Funds
    let currentFunds = funds;
    if (userTeam) {
       const salaryCost = Math.round(userTeam.roster.reduce((acc, p) => acc + p.marketValue, 0) * 0.005);
       currentFunds = funds - salaryCost;
       // Add ticket sales (basic simulation)
       if (nextMatchFixture?.homeTeamId === userTeamId) {
          currentFunds += Math.floor(Math.random() * 50000) + 20000;
       }
       setFunds(currentFunds);
    }

    // Sort table
    setTeams(prev => [...prev].sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga)));
    setCurrentRound(r => r + 1);
    
    // BANKRUPTCY CHECK
    if (currentFunds < -500000) {
       setCurrentScreen('GAME_OVER');
       localStorage.removeItem(SAVE_KEY); // Delete save on game over
       setHasSave(false);
       return;
    }

    // Check if season is over (if rounds exceeded fixtures rounds)
    const totalRounds = (teams.length - 1) * 2;
    if (currentRound >= totalRounds) {
      setCurrentScreen('CHAMPION');
    } else {
      setCurrentScreen('DASHBOARD');
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-background text-white font-sans overflow-hidden">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      {currentScreen === 'SPLASH' && (
        <SplashScreen 
          onStart={handleStartCareer} 
          onContinue={handleContinueGame}
          hasSave={hasSave}
        />
      )}
      
      {currentScreen === 'TEAM_SELECT' && (
        <TeamSelectionScreen 
          teams={teams} 
          onSelect={handleTeamSelect} 
          onBack={() => setCurrentScreen('SPLASH')} 
        />
      )}
      
      {currentScreen === 'DASHBOARD' && userTeam && (
        <DashboardScreen 
          team={userTeam} 
          nextOpponent={nextOpponent || teams[0]}
          standings={teams}
          round={currentRound}
          funds={funds}
          onOpenSquad={() => setCurrentScreen('SQUAD')}
          onOpenMarket={() => setCurrentScreen('MARKET')}
          onOpenFinance={() => setCurrentScreen('FINANCE')}
          onOpenCalendar={() => setCurrentScreen('CALENDAR')}
          onOpenLeague={() => setCurrentScreen('LEAGUE')}
          onOpenNews={() => setCurrentScreen('NEWS')}
          onOpenSettings={() => setCurrentScreen('SETTINGS')}
          onSimulate={handleSimulate}
        />
      )}
      
      {currentScreen === 'SQUAD' && userTeam && (
        <SquadScreen 
          team={userTeam} 
          onBack={() => setCurrentScreen('DASHBOARD')} 
        />
      )}
      
      {currentScreen === 'MARKET' && userTeam && (
         <MarketScreen 
            userTeam={userTeam}
            allTeams={teams}
            funds={funds}
            onBack={() => setCurrentScreen('DASHBOARD')}
            onBuy={handleBuyPlayer}
            onSell={handleSellPlayer}
         />
      )}

      {currentScreen === 'FINANCE' && userTeam && (
        <FinanceScreen
          team={userTeam}
          funds={funds}
          onBack={() => setCurrentScreen('DASHBOARD')}
          onLoan={handleLoan}
        />
      )}

      {currentScreen === 'LEAGUE' && (
        <LeagueScreen
          teams={teams}
          userTeamId={userTeamId}
          onBack={() => setCurrentScreen('DASHBOARD')}
        />
      )}

      {currentScreen === 'CALENDAR' && (
        <CalendarScreen
          history={matchHistory}
          currentRound={currentRound}
          onBack={() => setCurrentScreen('DASHBOARD')}
        />
      )}

      {currentScreen === 'NEWS' && (
        <NewsScreen
          history={matchHistory}
          currentRound={currentRound}
          onBack={() => setCurrentScreen('DASHBOARD')}
        />
      )}

      {currentScreen === 'SETTINGS' && (
        <SettingsScreen
          onBack={() => setCurrentScreen('DASHBOARD')}
          onSave={handleManualSave}
          onReset={handleResetGame}
          session={userSession}
        />
      )}

      {currentScreen === 'CHAMPION' && userTeam && (
        <ChampionScreen
           champion={teams[0]}
           userTeam={userTeam}
           onNewSeason={handleNewSeason}
           onQuit={() => setCurrentScreen('SPLASH')}
        />
      )}

      {currentScreen === 'GAME_OVER' && (
         <GameOverScreen 
            reason="A diretoria optou pela sua demissão devido à má gestão financeira. O clube decretou falência técnica."
            onRestart={handleStartCareer}
         />
      )}

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