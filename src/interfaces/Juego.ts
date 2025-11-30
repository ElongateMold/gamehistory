import type {Genre} from './Genre';

export interface Juego {
  id: number;
  title: string;       
  image_url: string;   
  hours_played: number;
  hours_total: number; 
  genres: Genre[];     
}