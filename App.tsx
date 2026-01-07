import React, { useState, useEffect } from 'react';
import { Player, Team, Match, ScreenState } from './types';
import { INITIAL_TEAMS } from './data';
import SplashScreen from './screens/SplashScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import DashboardScreen from './screens/DashboardScreen';
import SquadScreen from './screens/SquadScreen';
import MatchScreen from './screens/MatchScreen';
import MarketScreen from './screens/MarketScreen';
import { Toaster, toast } from 'react-hot-toast';

const SAVE_KEY = 'bolanarede_save';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('SPLASH');
  
  // Game State
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [funds, setFunds] = useState(1200000); // 1.2M
  const [hasSave, setHasSave] = useState(false);

  // Check for save on mount
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      setHasSave(true);
    }
  }, []);

  // Save game whenever critical state changes (only if user is actually playing)
  useEffect(() => {
    if (userTeamId && currentScreen !== 'SPLASH' && currentScreen !== 'TEAM_SELECT') {
      const stateToSave = {
        teams,
        userTeamId,
        currentRound,
        funds,
        timestamp: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
      setHasSave(true);
    }
  }, [teams, userTeamId, currentRound, funds, currentScreen]);

  const userTeam = teams.find(t => t.id === userTeamId);

  // Simple opponent selection for the demo (next match is always vs a random team or Vitoria if available)
  const nextOpponentId = userTeamId === 'vitoria' ? 'bahia' : 'vitoria';
  const nextOpponent = teams.find(t => t.id === nextOpponentId) || teams[0];

  const handleStartCareer = () => {
    // Reset data for new career
    setTeams(INITIAL_TEAMS);
    setCurrentRound(1);
    setFunds(1200000);
    setUserTeamId(null);
    setCurrentScreen('TEAM_SELECT');
  };

  const handleContinueGame = () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure legacy compatibility (if marketValue missing)
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
        setCurrentScreen('DASHBOARD');
        toast.success("Jogo carregado com sucesso!");
      } catch (error) {
        toast.error("Erro ao carregar o jogo salvo.");
        console.error(error);
      }
    }
  };
  
  const handleTeamSelect = (teamId: string) => {
    setUserTeamId(teamId);
    setCurrentScreen('DASHBOARD');
  };

  const handleSimulate = () => setCurrentScreen('MATCH');

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

  const handleMatchFinished = (userGoals: number, opponentGoals: number) => {
    // Update standings for user team
    setTeams(prev => prev.map(t => {
      if (t.id === userTeamId) {
        return {
          ...t,
          played: t.played + 1,
          won: t.won + (userGoals > opponentGoals ? 1 : 0),
          drawn: t.drawn + (userGoals === opponentGoals ? 1 : 0),
          lost: t.lost + (userGoals < opponentGoals ? 1 : 0),
          gf: t.gf + userGoals,
          ga: t.ga + opponentGoals,
          points: t.points + (userGoals > opponentGoals ? 3 : (userGoals === opponentGoals ? 1 : 0))
        };
      }
      if (t.id === nextOpponentId) {
        return {
          ...t,
          played: t.played + 1,
          won: t.won + (opponentGoals > userGoals ? 1 : 0),
          drawn: t.drawn + (opponentGoals === userGoals ? 1 : 0),
          lost: t.lost + (opponentGoals < userGoals ? 1 : 0),
          gf: t.gf + opponentGoals,
          ga: t.ga + userGoals,
          points: t.points + (opponentGoals > userGoals ? 3 : (opponentGoals === userGoals ? 1 : 0))
        };
      }
      // Simulate random results for other teams
      if (Math.random() > 0.5) {
         // This is a very simplified simulation for background matches
         const g1 = Math.floor(Math.random() * 3);
         const g2 = Math.floor(Math.random() * 3);
         const pts = g1 > g2 ? 3 : (g1 === g2 ? 1 : 0);
         return {
            ...t,
            played: t.played + 1,
            gf: t.gf + g1,
            ga: t.ga + g2,
            points: t.points + pts,
            // Naive update for W/D/L
            won: t.won + (g1 > g2 ? 1 : 0),
            drawn: t.drawn + (g1 === g2 ? 1 : 0),
            lost: t.lost + (g1 < g2 ? 1 : 0),
         }
      }
      return t;
    }));
    
    // Sort table
    setTeams(prev => [...prev].sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga)));
    setCurrentRound(r => r + 1);
    setCurrentScreen('DASHBOARD');
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
          nextOpponent={nextOpponent}
          standings={teams}
          round={currentRound}
          funds={funds}
          onOpenSquad={() => setCurrentScreen('SQUAD')}
          onOpenMarket={() => setCurrentScreen('MARKET')}
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

      {currentScreen === 'MATCH' && userTeam && (
        <MatchScreen 
          homeTeam={userTeam}
          awayTeam={nextOpponent}
          round={currentRound}
          onFinish={handleMatchFinished}
        />
      )}
    </div>
  );
}