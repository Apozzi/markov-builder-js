import { NotaMusical } from "../utils/NotasMusicaisEnum";

export interface Vertex {
    id: number;
    x: number;
    y: number;
    label: string;
    visitCount: number;
    sound?: {
      type: 'note' | 'custom';
      value: NotaMusical | string;
    };
  }