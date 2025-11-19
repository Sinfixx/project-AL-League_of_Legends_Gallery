export interface MatchupResult {
  hero1WinRate: number;
  hero2WinRate: number;

  // Stats de base
  hero1Stats: {
    attaque: number;
    esquive: number;
    degats: number;
    pv: number;
  };

  hero2Stats: {
    attaque: number;
    esquive: number;
    degats: number;
    pv: number;
  };

  // Métriques avancées
  hero1Metrics: {
    survivability: number;
    burstPotential: number;
    efficiency: number;
  };

  hero2Metrics: {
    survivability: number;
    burstPotential: number;
    efficiency: number;
  };
}
