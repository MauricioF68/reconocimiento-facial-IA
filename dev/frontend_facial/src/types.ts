// src/types.ts

export interface Profile {
  id: string;
  nombre: string;
  apellidos: string;
  codigo_estudiante: string;
  correo: string;
  requisitoriado: boolean;
  photo_url: string;
}

// Añadimos el nuevo nombre de la pantalla de edición
export type ScreenName = 'Analyze' | 'Register' | 'ProfileList' | 'EditProfile';