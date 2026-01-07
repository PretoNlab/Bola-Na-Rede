
import { Team, Player, Fixture } from './types';

const firstNames = ['Lucas', 'Matheus', 'Gabriel', 'Pedro', 'João', 'Felipe', 'Rafael', 'Daniel', 'Bruno', 'Thiago', 'Marcos', 'André', 'Luiz', 'Gustavo', 'Eduardo', 'Caio', 'Enzo', 'Arthur', 'Diego', 'Victor', 'Ruan', 'Igor'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Martins', 'Araújo', 'Barbosa', 'Ramos', 'Jesus', 'Alves', 'Rocha', 'Nascimento'];

const generatePlayer = (position: Player['position'], baseRating: number): Player => {
  const isProspect = Math.random() > 0.8;
  const age = isProspect ? Math.floor(Math.random() * 5) + 17 : Math.floor(Math.random() * 12) + 23;
  const overall = Math.min(99, Math.max(40, baseRating + Math.floor(Math.random() * 12) - 6));
  let baseValue = Math.pow(overall, 3) * 15; 
  if (age < 21) baseValue *= 1.5;
  if (age > 32) baseValue *= 0.6;
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    position,
    age,
    overall,
    status: 'fit',
    marketValue: Math.round(baseValue / 1000) * 1000,
    goals: 0,
    assists: 0
  };
};

const generateRoster = (teamRating: number): Player[] => {
  const roster: Player[] = [];
  ['GOL', 'GOL'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['ZAG', 'ZAG', 'ZAG', 'ZAG'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['LAT', 'LAT', 'LAT', 'LAT'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['VOL', 'VOL', 'VOL', 'VOL'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['MEI', 'MEI', 'MEI', 'MEI'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['ATA', 'ATA', 'ATA', 'ATA'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  return roster.sort((a, b) => b.overall - a.overall);
};

export const INITIAL_TEAMS: Team[] = [
  // SÉRIE A (10 Times)
  { id: 'bahia', name: 'EC Bahia', shortName: 'BAH', city: 'Salvador', logoColor1: 'from-blue-600', logoColor2: 'to-red-600', attack: 89, defense: 87, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 90, division: 1 },
  { id: 'vitoria', name: 'EC Vitória', shortName: 'VIT', city: 'Salvador', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 85, defense: 84, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1 },
  { id: 'jacuipense', name: 'Jacuipense', shortName: 'JAC', city: 'Riachão do Jacuípe', logoColor1: 'from-red-700', logoColor2: 'to-red-900', attack: 76, defense: 75, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 75, division: 1 },
  { id: 'juazeirense', name: 'Juazeirense', shortName: 'JUA', city: 'Juazeiro', logoColor1: 'from-yellow-500', logoColor2: 'to-red-600', attack: 74, defense: 74, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 1 },
  { id: 'barcelona_ba', name: 'Barcelona de Ilhéus', shortName: 'BAR', city: 'Ilhéus', logoColor1: 'from-blue-800', logoColor2: 'to-red-800', attack: 73, defense: 72, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 1 },
  { id: 'jequie', name: 'AD Jequié', shortName: 'JEK', city: 'Jequié', logoColor1: 'from-blue-500', logoColor2: 'to-yellow-500', attack: 72, defense: 73, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 65, division: 1 },
  { id: 'atletico_ba', name: 'Atlético de Alagoinhas', shortName: 'AAL', city: 'Alagoinhas', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 71, defense: 71, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 65, division: 1 },
  { id: 'itabuna', name: 'Itabuna EC', shortName: 'ITA', city: 'Itabuna', logoColor1: 'from-blue-700', logoColor2: 'to-white', attack: 70, defense: 70, roster: [], lineup: [], formation: '5-3-2', style: 'Ultra-Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 60, division: 1 },
  { id: 'bahia_feira', name: 'Bahia de Feira', shortName: 'BAF', city: 'Feira de Santana', logoColor1: 'from-blue-900', logoColor2: 'to-red-800', attack: 75, defense: 74, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 75, division: 1 },
  { id: 'flu_feira', name: 'Fluminense de Feira', shortName: 'FLU', city: 'Feira de Santana', logoColor1: 'from-green-600', logoColor2: 'to-white', attack: 74, defense: 73, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 1 },

  // SÉRIE B (10 Times)
  { id: 'vitoria_conquista', name: 'Vitória da Conquista', shortName: 'VCO', city: 'Vitória da Conquista', logoColor1: 'from-green-800', logoColor2: 'to-white', attack: 68, defense: 67, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 60, division: 2 },
  { id: 'colo_colo', name: 'Colo Colo', shortName: 'COL', city: 'Ilhéus', logoColor1: 'from-yellow-400', logoColor2: 'to-black', attack: 65, defense: 64, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 55, division: 2 },
  { id: 'galicia', name: 'Galícia EC', shortName: 'GAL', city: 'Salvador', logoColor1: 'from-blue-600', logoColor2: 'to-white', attack: 64, defense: 63, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 55, division: 2 },
  { id: 'ypiranga', name: 'Ypiranga', shortName: 'YPI', city: 'Salvador', logoColor1: 'from-yellow-500', logoColor2: 'to-black', attack: 62, defense: 62, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 2 },
  { id: 'jacobina', name: 'Jacobina EC', shortName: 'JCB', city: 'Jacobina', logoColor1: 'from-blue-400', logoColor2: 'to-yellow-500', attack: 63, defense: 63, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 2 },
  { id: 'porto_ba', name: 'Porto Sport Club', shortName: 'POR', city: 'Porto Seguro', logoColor1: 'from-blue-900', logoColor2: 'to-gray-800', attack: 61, defense: 61, roster: [], lineup: [], formation: '5-4-1', style: 'Ultra-Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 45, division: 2 },
  { id: 'unirb', name: 'UNIRB FC', shortName: 'UNI', city: 'Alagoinhas', logoColor1: 'from-blue-800', logoColor2: 'to-orange-500', attack: 60, defense: 60, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 45, division: 2 },
  { id: 'doce_mel', name: 'Doce Mel EC', shortName: 'DOC', city: 'Ipiaú', logoColor1: 'from-yellow-400', logoColor2: 'to-blue-500', attack: 59, defense: 59, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 40, division: 2 },
  { id: 'catuense', name: 'Catuense', shortName: 'CAT', city: 'Catu', logoColor1: 'from-red-600', logoColor2: 'to-yellow-500', attack: 58, defense: 58, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 40, division: 2 },
  { id: 'astro', name: 'Astro', shortName: 'AST', city: 'Feira de Santana', logoColor1: 'from-green-500', logoColor2: 'to-white', attack: 55, defense: 55, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 35, division: 2 }
];

INITIAL_TEAMS.forEach(team => {
  const rating = Math.floor((team.attack + team.defense) / 2);
  team.roster = generateRoster(rating);
  team.lineup = team.roster.slice(0, 11).map(p => p.id);
});

export const generateSchedule = (teams: Team[]): Fixture[] => {
  const fixtures: Fixture[] = [];
  const div1Ids = teams.filter(t => t.division === 1).map(t => t.id);
  const div2Ids = teams.filter(t => t.division === 2).map(t => t.id);

  const generateForIds = (ids: string[], startRound: number) => {
    const rotation = [...ids];
    const n = ids.length;
    for (let r = 0; r < n - 1; r++) {
      for (let i = 0; i < n / 2; i++) {
        fixtures.push({ round: startRound + r, homeTeamId: rotation[i], awayTeamId: rotation[n - 1 - i], played: false });
        fixtures.push({ round: startRound + r + (n - 1), homeTeamId: rotation[n - 1 - i], awayTeamId: rotation[i], played: false });
      }
      const last = rotation.pop()!;
      rotation.splice(1, 0, last);
    }
  };

  generateForIds(div1Ids, 1);
  generateForIds(div2Ids, 1);
  return fixtures.sort((a, b) => a.round - b.round);
};
