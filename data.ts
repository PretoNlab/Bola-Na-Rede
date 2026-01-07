import { Team, Player, Match } from './types';

// Helper to generate random players
const firstNames = ['Lucas', 'Matheus', 'Gabriel', 'Pedro', 'João', 'Felipe', 'Rafael', 'Daniel', 'Bruno', 'Thiago', 'Marcos', 'André', 'Luiz', 'Gustavo', 'Eduardo', 'Caio', 'Enzo', 'Arthur'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Martins', 'Araújo', 'Barbosa', 'Ramos'];

const generatePlayer = (position: Player['position'], baseRating: number): Player => {
  const isProspect = Math.random() > 0.8;
  const age = isProspect ? Math.floor(Math.random() * 5) + 17 : Math.floor(Math.random() * 12) + 23;
  const overall = baseRating + Math.floor(Math.random() * 10) - 5;
  
  // Calculate Market Value (Exponential curve based on Overall)
  // Base calculation + Age factor (younger = more expensive)
  let baseValue = Math.pow(overall, 3) * 15; 
  if (age < 21) baseValue *= 1.5;
  if (age > 32) baseValue *= 0.6;
  
  // Round to thousands
  const marketValue = Math.round(baseValue / 1000) * 1000;

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    position,
    age,
    overall,
    status: Math.random() > 0.95 ? 'injured' : 'fit',
    evolution: isProspect ? Math.floor(Math.random() * 3) + 1 : 0,
    marketValue,
  };
};

const generateRoster = (teamRating: number): Player[] => {
  const roster: Player[] = [];
  // 3 GK, 4 ZAG, 4 LAT, 4 VOL, 4 MEI, 4 ATA = 23 players roughly
  ['GOL', 'GOL', 'GOL'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['ZAG', 'ZAG', 'ZAG', 'ZAG'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['LAT', 'LAT', 'LAT', 'LAT'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['VOL', 'VOL', 'VOL', 'VOL'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['MEI', 'MEI', 'MEI', 'MEI'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['ATA', 'ATA', 'ATA', 'ATA'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  return roster.sort((a, b) => b.overall - a.overall);
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'bahia',
    name: 'Bahia',
    shortName: 'BAH',
    city: 'Salvador, BA',
    logoColor1: 'from-blue-600',
    logoColor2: 'to-red-600',
    attack: 89,
    defense: 87,
    roster: [],
    played: 11, won: 10, drawn: 2, lost: 0, gf: 28, ga: 10, points: 32 // Mock current standing
  },
  {
    id: 'vitoria',
    name: 'Vitória',
    shortName: 'VIT',
    city: 'Salvador, BA',
    logoColor1: 'from-red-600',
    logoColor2: 'to-black',
    attack: 85,
    defense: 86,
    roster: [],
    played: 11, won: 7, drawn: 3, lost: 1, gf: 22, ga: 12, points: 24
  },
  {
    id: 'jacuipense',
    name: 'Jacuipense',
    shortName: 'JAC',
    city: 'Riachão do Jacuípe, BA',
    logoColor1: 'from-red-800',
    logoColor2: 'to-red-900',
    attack: 70,
    defense: 74,
    roster: [],
    played: 11, won: 6, drawn: 4, lost: 1, gf: 18, ga: 13, points: 22
  },
  {
    id: 'bahia_feira',
    name: 'Bahia de Feira',
    shortName: 'BAF',
    city: 'Feira de Santana, BA',
    logoColor1: 'from-blue-400',
    logoColor2: 'to-blue-600',
    attack: 75,
    defense: 72,
    roster: [],
    played: 11, won: 5, drawn: 3, lost: 3, gf: 15, ga: 15, points: 18
  },
  {
    id: 'barcelona_ba',
    name: 'Barcelona-BA',
    shortName: 'BCA',
    city: 'Ilhéus, BA',
    logoColor1: 'from-yellow-500',
    logoColor2: 'to-red-500',
    attack: 72,
    defense: 70,
    roster: [],
    played: 11, won: 5, drawn: 5, lost: 1, gf: 14, ga: 12, points: 20
  },
  {
    id: 'juazeirense',
    name: 'Juazeirense',
    shortName: 'JUA',
    city: 'Juazeiro, BA',
    logoColor1: 'from-green-600',
    logoColor2: 'to-red-500',
    attack: 71,
    defense: 69,
    roster: [],
    played: 11, won: 4, drawn: 4, lost: 3, gf: 13, ga: 14, points: 16
  },
  {
    id: 'atletico_ba',
    name: 'Atlético-BA',
    shortName: 'ATL',
    city: 'Alagoinhas, BA',
    logoColor1: 'from-red-600',
    logoColor2: 'to-black',
    attack: 68,
    defense: 70,
    roster: [],
    played: 11, won: 4, drawn: 3, lost: 4, gf: 12, ga: 15, points: 15
  },
  {
    id: 'itabuna',
    name: 'Itabuna',
    shortName: 'ITA',
    city: 'Itabuna, BA',
    logoColor1: 'from-blue-800',
    logoColor2: 'to-white',
    attack: 65,
    defense: 68,
    roster: [],
    played: 11, won: 2, drawn: 2, lost: 7, gf: 8, ga: 20, points: 8
  },
];

// Hydrate Rosters
INITIAL_TEAMS.forEach(team => {
  const rating = Math.floor((team.attack + team.defense) / 2);
  team.roster = generateRoster(rating);
});