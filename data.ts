import { Team, Player, Fixture } from './types';

// Helper to generate random players
const firstNames = ['Lucas', 'Matheus', 'Gabriel', 'Pedro', 'João', 'Felipe', 'Rafael', 'Daniel', 'Bruno', 'Thiago', 'Marcos', 'André', 'Luiz', 'Gustavo', 'Eduardo', 'Caio', 'Enzo', 'Arthur', 'Diego', 'Victor', 'Ruan', 'Igor'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Martins', 'Araújo', 'Barbosa', 'Ramos', 'Jesus', 'Alves', 'Rocha', 'Nascimento'];

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

export const generateSchedule = (teams: Team[]): Fixture[] => {
  const fixtures: Fixture[] = [];
  const teamIds = teams.map(t => t.id);
  const numberOfTeams = teamIds.length;
  const rounds = (numberOfTeams - 1) * 2; // Double round robin
  const matchesPerRound = numberOfTeams / 2;

  // Simple Round Robin Algorithm
  let rotation = [...teamIds];
  
  // First Half of Season
  for (let r = 0; r < numberOfTeams - 1; r++) {
    for (let i = 0; i < matchesPerRound; i++) {
      const home = rotation[i];
      const away = rotation[numberOfTeams - 1 - i];
      fixtures.push({
        round: r + 1,
        homeTeamId: home,
        awayTeamId: away,
        played: false
      });
    }
    // Rotate array, keeping first element fixed
    const last = rotation.pop()!;
    rotation.splice(1, 0, last);
  }

  // Second Half (Reverse fixtures)
  const firstHalfFixtures = [...fixtures];
  firstHalfFixtures.forEach(match => {
    fixtures.push({
      round: match.round + (numberOfTeams - 1),
      homeTeamId: match.awayTeamId,
      awayTeamId: match.homeTeamId,
      played: false
    });
  });

  return fixtures.sort((a, b) => a.round - b.round);
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'bahia',
    name: 'Bahia',
    shortName: 'BAH',
    city: 'Salvador, BA',
    logoColor1: 'from-blue-600',
    logoColor2: 'to-red-600',
    attack: 88,
    defense: 86,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'vitoria',
    name: 'EC Vitória',
    shortName: 'VIT',
    city: 'Salvador, BA',
    logoColor1: 'from-red-600',
    logoColor2: 'to-black',
    attack: 86,
    defense: 85,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'bahia_feira',
    name: 'Bahia de Feira',
    shortName: 'BAF',
    city: 'Feira de Santana, BA',
    logoColor1: 'from-red-600',
    logoColor2: 'to-blue-800',
    attack: 76,
    defense: 75,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'jacuipense',
    name: 'Jacuipense',
    shortName: 'JAC',
    city: 'Riachão do Jacuípe, BA',
    logoColor1: 'from-red-800',
    logoColor2: 'to-red-950',
    attack: 74,
    defense: 73,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'atletico_ba',
    name: 'Atlético (BA)',
    shortName: 'ATL',
    city: 'Alagoinhas, BA',
    logoColor1: 'from-red-600',
    logoColor2: 'to-black',
    attack: 73,
    defense: 72,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'barcelona_ba',
    name: 'Barcelona BA',
    shortName: 'BCA',
    city: 'Ilhéus, BA',
    logoColor1: 'from-blue-700',
    logoColor2: 'to-red-700',
    attack: 71,
    defense: 70,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'juazeirense',
    name: 'Juazeirense',
    shortName: 'JUA',
    city: 'Juazeiro, BA',
    logoColor1: 'from-yellow-400',
    logoColor2: 'to-red-600',
    attack: 72,
    defense: 71,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'jequie',
    name: 'Jequié',
    shortName: 'ADJ',
    city: 'Jequié, BA',
    logoColor1: 'from-blue-500',
    logoColor2: 'to-yellow-400',
    attack: 70,
    defense: 69,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'galicia',
    name: 'Galícia',
    shortName: 'GAL',
    city: 'Salvador, BA',
    logoColor1: 'from-blue-600',
    logoColor2: 'to-white',
    attack: 69,
    defense: 68,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  },
  {
    id: 'porto_ba',
    name: 'Porto Sport Club',
    shortName: 'PSC',
    city: 'Porto Seguro, BA',
    logoColor1: 'from-gray-500',
    logoColor2: 'to-gray-800',
    attack: 67,
    defense: 67,
    roster: [],
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  }
];

// Hydrate Rosters
INITIAL_TEAMS.forEach(team => {
  const rating = Math.floor((team.attack + team.defense) / 2);
  team.roster = generateRoster(rating);
});