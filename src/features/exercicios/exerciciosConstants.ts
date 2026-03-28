export const GRUPOS_MUSCULARES = [
  "Peito",
  "Costas",
  "Pernas",
  "Glúteos",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Abdômen",
  "Panturrilha",
  "Trapézio",
] as const;

export type GrupoMuscular = (typeof GRUPOS_MUSCULARES)[number];

export const EQUIPAMENTOS = [
  "Peso corporal",
  "Barra",
  "Halteres",
  "Máquina",
  "Cabo",
  "Kettlebell",
  "Elástico",
  "Smith",
  "Livre",
] as const;

export type Equipamento = (typeof EQUIPAMENTOS)[number];

export const GRUPO_CORES: Record<string, string> = {
  Peito:       "bg-red-100 text-red-700",
  Costas:      "bg-blue-100 text-blue-700",
  Pernas:      "bg-green-100 text-green-700",
  Glúteos:     "bg-pink-100 text-pink-700",
  Ombros:      "bg-purple-100 text-purple-700",
  Bíceps:      "bg-orange-100 text-orange-700",
  Tríceps:     "bg-yellow-100 text-yellow-700",
  Abdômen:     "bg-cyan-100 text-cyan-700",
  Panturrilha: "bg-teal-100 text-teal-700",
  Trapézio:    "bg-indigo-100 text-indigo-700",
};
