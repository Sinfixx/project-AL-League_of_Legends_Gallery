export interface HeroInterface {
  id: number;
  name: string;
  attaque: number;
  esquive: number;
  degats: number;
  pv: number;
  weapon?: string;
  data?: string; // ID League of Legends pour l'icône
}
