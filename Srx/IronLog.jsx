import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Home as HomeIcon,
  Dumbbell,
  TrendingUp,
  ListChecks,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Check,
  Trash2,
  Minus,
  Search,
  Play,
  Globe,
  User,
  Flame,
  Calendar,
  Timer,
  Square,
  Lock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ----------------------------- constants ----------------------------- */

const STORAGE_KEY = "iron-log-data";

const WEEKDAY_CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const WEEKDAY_LABELS = {
  en: { MO: "Mon", TU: "Tue", WE: "Wed", TH: "Thu", FR: "Fri", SA: "Sat", SU: "Sun" },
  fr: { MO: "Lun", TU: "Mar", WE: "Mer", TH: "Jeu", FR: "Ven", SA: "Sam", SU: "Dim" },
  de: { MO: "Mo", TU: "Di", WE: "Mi", TH: "Do", FR: "Fr", SA: "Sa", SU: "So" },
  es: { MO: "Lun", TU: "Mar", WE: "Mié", TH: "Jue", FR: "Vie", SA: "Sáb", SU: "Dom" },
  it: { MO: "Lun", TU: "Mar", WE: "Mer", TH: "Gio", FR: "Ven", SA: "Sab", SU: "Dom" },
  pt: { MO: "Seg", TU: "Ter", WE: "Qua", TH: "Qui", FR: "Sex", SA: "Sáb", SU: "Dom" },
};

const LANGUAGES = [
  { code: "en", native: "English" },
  { code: "fr", native: "Français" },
  { code: "de", native: "Deutsch" },
  { code: "es", native: "Español" },
  { code: "it", native: "Italiano" },
  { code: "pt", native: "Português" },
];

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Calves", "Abs", "Forearms", "Full Body"];
const EQUIPMENT = ["Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Smith Machine", "Kettlebell", "Plate"];

const GROUP_LABELS = {
  en: { Chest: "Chest", Back: "Back", Shoulders: "Shoulders", Biceps: "Biceps", Triceps: "Triceps", Quads: "Quads", Hamstrings: "Hamstrings", Glutes: "Glutes", Calves: "Calves", Abs: "Abs", Forearms: "Forearms", "Full Body": "Full Body" },
  fr: { Chest: "Poitrine", Back: "Dos", Shoulders: "Épaules", Biceps: "Biceps", Triceps: "Triceps", Quads: "Quadriceps", Hamstrings: "Ischio-jambiers", Glutes: "Fessiers", Calves: "Mollets", Abs: "Abdominaux", Forearms: "Avant-bras", "Full Body": "Corps entier" },
  de: { Chest: "Brust", Back: "Rücken", Shoulders: "Schultern", Biceps: "Bizeps", Triceps: "Trizeps", Quads: "Quadrizeps", Hamstrings: "Beinbeuger", Glutes: "Gesäß", Calves: "Waden", Abs: "Bauch", Forearms: "Unterarme", "Full Body": "Ganzkörper" },
  es: { Chest: "Pecho", Back: "Espalda", Shoulders: "Hombros", Biceps: "Bíceps", Triceps: "Tríceps", Quads: "Cuádriceps", Hamstrings: "Isquiotibiales", Glutes: "Glúteos", Calves: "Pantorrillas", Abs: "Abdominales", Forearms: "Antebrazos", "Full Body": "Cuerpo completo" },
  it: { Chest: "Petto", Back: "Schiena", Shoulders: "Spalle", Biceps: "Bicipiti", Triceps: "Tricipiti", Quads: "Quadricipiti", Hamstrings: "Femorali", Glutes: "Glutei", Calves: "Polpacci", Abs: "Addominali", Forearms: "Avambracci", "Full Body": "Corpo intero" },
  pt: { Chest: "Peito", Back: "Costas", Shoulders: "Ombros", Biceps: "Bíceps", Triceps: "Tríceps", Quads: "Quadríceps", Hamstrings: "Isquiotibiais", Glutes: "Glúteos", Calves: "Panturrilhas", Abs: "Abdómen", Forearms: "Antebraços", "Full Body": "Corpo inteiro" },
};

const EQUIP_LABELS = {
  en: { Barbell: "Barbell", Dumbbell: "Dumbbell", Machine: "Machine", Cable: "Cable", Bodyweight: "Bodyweight", "Smith Machine": "Smith Machine", Kettlebell: "Kettlebell", Plate: "Plate" },
  fr: { Barbell: "Barre", Dumbbell: "Haltères", Machine: "Machine", Cable: "Poulie", Bodyweight: "Poids du corps", "Smith Machine": "Smith Machine", Kettlebell: "Kettlebell", Plate: "Disque" },
  de: { Barbell: "Langhantel", Dumbbell: "Kurzhantel", Machine: "Maschine", Cable: "Kabelzug", Bodyweight: "Körpergewicht", "Smith Machine": "Smith Machine", Kettlebell: "Kettlebell", Plate: "Gewichtsscheibe" },
  es: { Barbell: "Barra", Dumbbell: "Mancuernas", Machine: "Máquina", Cable: "Polea", Bodyweight: "Peso corporal", "Smith Machine": "Máquina Smith", Kettlebell: "Kettlebell", Plate: "Disco" },
  it: { Barbell: "Bilanciere", Dumbbell: "Manubri", Machine: "Macchina", Cable: "Cavo", Bodyweight: "Corpo libero", "Smith Machine": "Smith Machine", Kettlebell: "Kettlebell", Plate: "Disco" },
  pt: { Barbell: "Barra", Dumbbell: "Halteres", Machine: "Máquina", Cable: "Polia", Bodyweight: "Peso corporal", "Smith Machine": "Smith Machine", Kettlebell: "Kettlebell", Plate: "Anilha" },
};

const SPLIT_GROUPS = {
  push: ["Chest", "Shoulders", "Triceps"],
  pull: ["Back", "Biceps"],
  legs: ["Quads", "Hamstrings", "Glutes", "Calves"],
  upper: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
  lower: ["Quads", "Hamstrings", "Glutes", "Calves"],
  full: MUSCLE_GROUPS,
};
const SPLIT_LABELS = {
  en: { push: "Push", pull: "Pull", legs: "Legs", upper: "Upper Body", lower: "Lower Body", full: "Full Body" },
  fr: { push: "Push", pull: "Pull", legs: "Jambes", upper: "Haut du corps", lower: "Bas du corps", full: "Corps entier" },
  de: { push: "Push", pull: "Pull", legs: "Beine", upper: "Oberkörper", lower: "Unterkörper", full: "Ganzkörper" },
  es: { push: "Push", pull: "Pull", legs: "Piernas", upper: "Tren superior", lower: "Tren inferior", full: "Cuerpo completo" },
  it: { push: "Push", pull: "Pull", legs: "Gambe", upper: "Parte superiore", lower: "Parte inferiore", full: "Corpo intero" },
  pt: { push: "Push", pull: "Pull", legs: "Pernas", upper: "Parte superior", lower: "Parte inferior", full: "Corpo inteiro" },
};
const SPLIT_KEYWORDS = {
  push: ["push", "pouss", "spinta", "empuj", "empurr", "drück", "drucken"],
  pull: ["pull", "tirage", "tir", "trazione", "tracción", "puxa", "zieh"],
  legs: ["legs", "leg", "jambe", "gamba", "pierna", "perna", "bein"],
  upper: ["upper", "haut", "superior", "obere", "ober", "superiore"],
  lower: ["lower", "bas", "inferior", "untere", "unter", "inferiore"],
  full: ["full", "complet", "completo", "ganz", "intero"],
};
const inferSplit = (text) => {
  if (!text) return null;
  const t = text.toLowerCase();
  for (const key of Object.keys(SPLIT_KEYWORDS)) {
    if (SPLIT_KEYWORDS[key].some((w) => t.includes(w))) return key;
  }
  return null;
};

/* rough popularity ranking (lower = more commonly performed) used to sort exercise pickers */
const POPULARITY = {
  ex_bench: 1, ex_squat: 2, ex_deadlift: 3, ex_pullup: 4, ex_ohp: 5, ex_barbell_row: 6, ex_lat_pulldown: 7, ex_cable_curl: 8, ex_dips: 9, ex_leg_press: 10,
  ex_db_bench: 11, ex_inc_bench: 12, ex_pec_deck: 13, ex_inc_smith_bench: 14, ex_pushdown: 15, ex_machine_press: 16, ex_lying_leg_curl: 17,
  ex_hip_thrust: 18, ex_rdl: 19, ex_lat_raise: 20, ex_seated_row: 21, ex_face_pull: 22, ex_bb_curl: 23, ex_skullcrusher: 24, ex_leg_ext: 25,
  ex_chinup: 26, ex_walking_lunge: 27, ex_tbar_row: 28, ex_standing_calf: 29, ex_plank: 30, ex_situp: 31, ex_cgbp: 32, ex_inc_db_press: 33,
  ex_hammer_curl: 34, ex_arnold: 35, ex_rope_pushdown: 36, ex_cable_crossover: 37, ex_ezbar_curl: 38, ex_smith_bench: 39, ex_seated_db_press: 40,
};
const getPopularity = (id) => POPULARITY[id] ?? 200 + EXERCISE_LIBRARY.findIndex((e) => e.id === id);
const sortByPopularity = (arr) => [...arr].sort((a, b) => getPopularity(a.id) - getPopularity(b.id));

const EXERCISE_LIBRARY = [
  { id: "ex_bench", group: "Chest", equip: "Barbell" },
  { id: "ex_inc_bench", group: "Chest", equip: "Barbell" },
  { id: "ex_dec_bench", group: "Chest", equip: "Barbell" },
  { id: "ex_db_bench", group: "Chest", equip: "Dumbbell" },
  { id: "ex_inc_db_press", group: "Chest", equip: "Dumbbell" },
  { id: "ex_dec_db_press", group: "Chest", equip: "Dumbbell" },
  { id: "ex_db_fly", group: "Chest", equip: "Dumbbell" },
  { id: "ex_inc_db_fly", group: "Chest", equip: "Dumbbell" },
  { id: "ex_cable_crossover", group: "Chest", equip: "Cable" },
  { id: "ex_low_high_fly", group: "Chest", equip: "Cable" },
  { id: "ex_pec_deck", group: "Chest", equip: "Machine" },
  { id: "ex_machine_press", group: "Chest", equip: "Machine" },
  { id: "ex_smith_bench", group: "Chest", equip: "Smith Machine" },
  { id: "ex_inc_smith_bench", group: "Chest", equip: "Smith Machine" },
  { id: "ex_pushup", group: "Chest", equip: "Bodyweight" },
  { id: "ex_inc_pushup", group: "Chest", equip: "Bodyweight" },
  { id: "ex_chest_dip", group: "Chest", equip: "Bodyweight" },
  { id: "ex_svend_press", group: "Chest", equip: "Plate" },

  { id: "ex_pullup", group: "Back", equip: "Bodyweight" },
  { id: "ex_chinup", group: "Back", equip: "Bodyweight" },
  { id: "ex_lat_pulldown", group: "Back", equip: "Cable" },
  { id: "ex_cg_pulldown", group: "Back", equip: "Cable" },
  { id: "ex_barbell_row", group: "Back", equip: "Barbell" },
  { id: "ex_pendlay_row", group: "Back", equip: "Barbell" },
  { id: "ex_tbar_row", group: "Back", equip: "Machine" },
  { id: "ex_seated_row", group: "Back", equip: "Cable" },
  { id: "ex_db_row", group: "Back", equip: "Dumbbell" },
  { id: "ex_chest_row", group: "Back", equip: "Machine" },
  { id: "ex_deadlift", group: "Back", equip: "Barbell" },
  { id: "ex_rack_pull", group: "Back", equip: "Barbell" },
  { id: "ex_straight_pulldown", group: "Back", equip: "Cable" },
  { id: "ex_machine_row", group: "Back", equip: "Machine" },
  { id: "ex_inverted_row", group: "Back", equip: "Bodyweight" },
  { id: "ex_high_cable_row", group: "Back", equip: "Cable" },
  { id: "ex_underhand_row", group: "Back", equip: "Barbell" },

  { id: "ex_ohp", group: "Shoulders", equip: "Barbell" },
  { id: "ex_seated_db_press", group: "Shoulders", equip: "Dumbbell" },
  { id: "ex_arnold", group: "Shoulders", equip: "Dumbbell" },
  { id: "ex_machine_shoulder_press", group: "Shoulders", equip: "Machine" },
  { id: "ex_lat_raise", group: "Shoulders", equip: "Dumbbell" },
  { id: "ex_cable_lat_raise", group: "Shoulders", equip: "Cable" },
  { id: "ex_front_raise", group: "Shoulders", equip: "Dumbbell" },
  { id: "ex_rear_delt_fly", group: "Shoulders", equip: "Dumbbell" },
  { id: "ex_reverse_pec_deck", group: "Shoulders", equip: "Machine" },
  { id: "ex_bent_rear_delt_cable", group: "Shoulders", equip: "Cable" },
  { id: "ex_face_pull", group: "Shoulders", equip: "Cable" },
  { id: "ex_upright_row", group: "Shoulders", equip: "Barbell" },
  { id: "ex_smith_shoulder_press", group: "Shoulders", equip: "Smith Machine" },
  { id: "ex_barbell_shrug", group: "Shoulders", equip: "Barbell" },
  { id: "ex_db_shrug", group: "Shoulders", equip: "Dumbbell" },

  { id: "ex_bb_curl", group: "Biceps", equip: "Barbell" },
  { id: "ex_ezbar_curl", group: "Biceps", equip: "Barbell" },
  { id: "ex_db_curl", group: "Biceps", equip: "Dumbbell" },
  { id: "ex_hammer_curl", group: "Biceps", equip: "Dumbbell" },
  { id: "ex_inc_db_curl", group: "Biceps", equip: "Dumbbell" },
  { id: "ex_preacher_curl", group: "Biceps", equip: "Barbell" },
  { id: "ex_conc_curl", group: "Biceps", equip: "Dumbbell" },
  { id: "ex_cable_curl", group: "Biceps", equip: "Cable" },
  { id: "ex_rope_hammer_curl", group: "Biceps", equip: "Cable" },
  { id: "ex_machine_curl", group: "Biceps", equip: "Machine" },
  { id: "ex_spider_curl", group: "Biceps", equip: "Dumbbell" },
  { id: "ex_drag_curl", group: "Biceps", equip: "Barbell" },
  { id: "ex_cable_curl_single", group: "Biceps", equip: "Cable" },
  { id: "ex_low_cable_curl", group: "Biceps", equip: "Cable" },

  { id: "ex_pushdown", group: "Triceps", equip: "Cable" },
  { id: "ex_rope_pushdown", group: "Triceps", equip: "Cable" },
  { id: "ex_overhead_cable_ext", group: "Triceps", equip: "Cable" },
  { id: "ex_skullcrusher", group: "Triceps", equip: "Barbell" },
  { id: "ex_overhead_db_ext", group: "Triceps", equip: "Dumbbell" },
  { id: "ex_cgbp", group: "Triceps", equip: "Barbell" },
  { id: "ex_dips", group: "Triceps", equip: "Bodyweight" },
  { id: "ex_machine_tricep_ext", group: "Triceps", equip: "Machine" },
  { id: "ex_db_kickback", group: "Triceps", equip: "Dumbbell" },
  { id: "ex_diamond_pushup", group: "Triceps", equip: "Bodyweight" },
  { id: "ex_pushdown_single", group: "Triceps", equip: "Cable" },
  { id: "ex_overhead_ext_single", group: "Triceps", equip: "Cable" },

  { id: "ex_squat", group: "Quads", equip: "Barbell" },
  { id: "ex_front_squat", group: "Quads", equip: "Barbell" },
  { id: "ex_smith_squat", group: "Quads", equip: "Smith Machine" },
  { id: "ex_leg_press", group: "Quads", equip: "Machine" },
  { id: "ex_hack_squat", group: "Quads", equip: "Machine" },
  { id: "ex_leg_ext", group: "Quads", equip: "Machine" },
  { id: "ex_walking_lunge", group: "Quads", equip: "Dumbbell" },
  { id: "ex_goblet_squat", group: "Quads", equip: "Dumbbell" },
  { id: "ex_sissy_squat", group: "Quads", equip: "Bodyweight" },
  { id: "ex_stepup", group: "Quads", equip: "Dumbbell" },

  { id: "ex_rdl", group: "Hamstrings", equip: "Barbell" },
  { id: "ex_db_rdl", group: "Hamstrings", equip: "Dumbbell" },
  { id: "ex_seated_leg_curl", group: "Hamstrings", equip: "Machine" },
  { id: "ex_lying_leg_curl", group: "Hamstrings", equip: "Machine" },
  { id: "ex_good_morning", group: "Hamstrings", equip: "Barbell" },
  { id: "ex_stiff_leg_deadlift", group: "Hamstrings", equip: "Barbell" },
  { id: "ex_nordic_curl", group: "Hamstrings", equip: "Bodyweight" },
  { id: "ex_cable_pullthrough", group: "Hamstrings", equip: "Cable" },

  { id: "ex_hip_thrust", group: "Glutes", equip: "Barbell" },
  { id: "ex_glute_bridge", group: "Glutes", equip: "Bodyweight" },
  { id: "ex_cable_kickback", group: "Glutes", equip: "Cable" },
  { id: "ex_bulg_split", group: "Glutes", equip: "Dumbbell" },
  { id: "ex_hip_abduction", group: "Glutes", equip: "Machine" },
  { id: "ex_sumo_deadlift", group: "Glutes", equip: "Barbell" },
  { id: "ex_donkey_kick", group: "Glutes", equip: "Bodyweight" },

  { id: "ex_standing_calf", group: "Calves", equip: "Machine" },
  { id: "ex_seated_calf", group: "Calves", equip: "Machine" },
  { id: "ex_legpress_calf", group: "Calves", equip: "Machine" },
  { id: "ex_smith_calf", group: "Calves", equip: "Smith Machine" },
  { id: "ex_single_calf", group: "Calves", equip: "Bodyweight" },
  { id: "ex_donkey_calf", group: "Calves", equip: "Machine" },

  { id: "ex_cable_crunch", group: "Abs", equip: "Cable" },
  { id: "ex_hanging_raise", group: "Abs", equip: "Bodyweight" },
  { id: "ex_plank", group: "Abs", equip: "Bodyweight" },
  { id: "ex_russian_twist", group: "Abs", equip: "Bodyweight" },
  { id: "ex_ab_wheel", group: "Abs", equip: "Bodyweight" },
  { id: "ex_machine_crunch", group: "Abs", equip: "Machine" },
  { id: "ex_situp", group: "Abs", equip: "Bodyweight" },
  { id: "ex_bicycle_crunch", group: "Abs", equip: "Bodyweight" },
  { id: "ex_lying_leg_raise", group: "Abs", equip: "Bodyweight" },
  { id: "ex_side_plank", group: "Abs", equip: "Bodyweight" },
  { id: "ex_woodchopper", group: "Abs", equip: "Cable" },

  { id: "ex_wrist_curl", group: "Forearms", equip: "Barbell" },
  { id: "ex_rev_wrist_curl", group: "Forearms", equip: "Barbell" },
  { id: "ex_farmers_carry", group: "Forearms", equip: "Dumbbell" },
  { id: "ex_reverse_curl", group: "Forearms", equip: "Barbell" },
  { id: "ex_plate_pinch", group: "Forearms", equip: "Plate" },

  { id: "ex_kb_swing", group: "Full Body", equip: "Kettlebell" },
  { id: "ex_clean_press", group: "Full Body", equip: "Barbell" },
  { id: "ex_thruster", group: "Full Body", equip: "Dumbbell" },
  { id: "ex_burpee", group: "Full Body", equip: "Bodyweight" },
  { id: "ex_turkish_getup", group: "Full Body", equip: "Kettlebell" },
];

/* exercise name translations, keyed by id */
const EX_NAMES = {
  ex_bench: { en: "Barbell Bench Press", fr: "Développé couché à la barre", de: "Bankdrücken mit Langhantel", es: "Press de banca con barra", it: "Panca piana con bilanciere", pt: "Supino reto com barra" },
  ex_inc_bench: { en: "Incline Barbell Bench Press", fr: "Développé incliné à la barre", de: "Schrägbankdrücken mit Langhantel", es: "Press de banca inclinado con barra", it: "Panca inclinata con bilanciere", pt: "Supino inclinado com barra" },
  ex_dec_bench: { en: "Decline Barbell Bench Press", fr: "Développé décliné à la barre", de: "Negativ-Bankdrücken mit Langhantel", es: "Press de banca declinado con barra", it: "Panca declinata con bilanciere", pt: "Supino declinado com barra" },
  ex_db_bench: { en: "Dumbbell Bench Press", fr: "Développé couché aux haltères", de: "Kurzhantel-Bankdrücken", es: "Press de banca con mancuernas", it: "Panca piana con manubri", pt: "Supino reto com halteres" },
  ex_inc_db_press: { en: "Incline Dumbbell Press", fr: "Développé incliné aux haltères", de: "Schrägbankdrücken mit Kurzhanteln", es: "Press inclinado con mancuernas", it: "Panca inclinata con manubri", pt: "Supino inclinado com halteres" },
  ex_dec_db_press: { en: "Decline Dumbbell Press", fr: "Développé décliné aux haltères", de: "Negativ-Bankdrücken mit Kurzhanteln", es: "Press declinado con mancuernas", it: "Panca declinata con manubri", pt: "Supino declinado com halteres" },
  ex_db_fly: { en: "Dumbbell Fly", fr: "Écarté couché aux haltères", de: "Kurzhantel-Fliegende", es: "Aperturas con mancuernas", it: "Croci con manubri", pt: "Crucifixo com halteres" },
  ex_inc_db_fly: { en: "Incline Dumbbell Fly", fr: "Écarté incliné aux haltères", de: "Schräg-Fliegende mit Kurzhanteln", es: "Aperturas inclinadas con mancuernas", it: "Croci inclinate con manubri", pt: "Crucifixo inclinado com halteres" },
  ex_cable_crossover: { en: "Cable Crossover", fr: "Écarté à la poulie vis-à-vis", de: "Kabelzug-Überkreuzen", es: "Cruce de poleas", it: "Croci ai cavi", pt: "Crucifixo no cross-over" },
  ex_low_high_fly: { en: "Low-to-High Cable Fly", fr: "Écarté poulie basse vers haute", de: "Kabelzug-Fliegende von unten nach oben", es: "Aperturas en polea de abajo a arriba", it: "Croci ai cavi dal basso verso l'alto", pt: "Crucifixo na polia de baixo para cima" },
  ex_pec_deck: { en: "Pec Deck", fr: "Butterfly (machine)", de: "Butterfly-Maschine", es: "Máquina de aperturas (pec deck)", it: "Pectoral machine (pec deck)", pt: "Voador (pec deck)" },
  ex_machine_press: { en: "Machine Chest Press", fr: "Développé couché à la machine", de: "Brustpresse-Maschine", es: "Press de pecho en máquina", it: "Chest press con macchina", pt: "Supino na máquina" },
  ex_smith_bench: { en: "Smith Machine Bench Press", fr: "Développé couché au Smith machine", de: "Bankdrücken an der Smith-Maschine", es: "Press de banca en máquina Smith", it: "Panca piana alla Smith machine", pt: "Supino na Smith machine" },
  ex_inc_smith_bench: { en: "Incline Smith Machine Press", fr: "Développé incliné au Smith machine", de: "Schrägbankdrücken an der Smith-Maschine", es: "Press inclinado en máquina Smith", it: "Panca inclinata alla Smith machine", pt: "Supino inclinado na Smith machine" },
  ex_pushup: { en: "Push-Up", fr: "Pompes", de: "Liegestütz", es: "Flexiones", it: "Piegamenti (push-up)", pt: "Flexão de braço" },
  ex_inc_pushup: { en: "Incline Push-Up", fr: "Pompes inclinées", de: "Schräge Liegestütz", es: "Flexiones inclinadas", it: "Piegamenti inclinati", pt: "Flexão inclinada" },
  ex_chest_dip: { en: "Chest Dip", fr: "Dips pectoraux", de: "Dips (Brust)", es: "Fondos para pecho", it: "Dip per il petto", pt: "Mergulho para peito (dips)" },
  ex_svend_press: { en: "Svend Press", fr: "Svend press (presse disque)", de: "Svend-Press (Plattendrücken)", es: "Svend press (press de disco)", it: "Svend press (spinta con disco)", pt: "Svend press (prensa com anilha)" },

  ex_pullup: { en: "Pull-Up", fr: "Traction pronation", de: "Klimmzug (Obergriff)", es: "Dominadas (pronación)", it: "Trazioni presa prona", pt: "Barra fixa (pegada pronada)" },
  ex_chinup: { en: "Chin-Up", fr: "Traction supination", de: "Klimmzug (Untergriff)", es: "Dominadas (supinación)", it: "Trazioni presa supina", pt: "Barra fixa (pegada supinada)" },
  ex_lat_pulldown: { en: "Lat Pulldown", fr: "Tirage vertical", de: "Latzug", es: "Jalón al pecho", it: "Lat machine", pt: "Puxada alta (polia)" },
  ex_cg_pulldown: { en: "Close-Grip Lat Pulldown", fr: "Tirage vertical prise serrée", de: "Enger Latzug", es: "Jalón al pecho agarre cerrado", it: "Lat machine presa stretta", pt: "Puxada fechada" },
  ex_barbell_row: { en: "Barbell Row", fr: "Rowing barre", de: "Langhantelrudern", es: "Remo con barra", it: "Rematore con bilanciere", pt: "Remada curvada com barra" },
  ex_pendlay_row: { en: "Pendlay Row", fr: "Rowing Pendlay", de: "Pendlay-Rudern", es: "Remo Pendlay", it: "Pendlay row", pt: "Remada Pendlay" },
  ex_tbar_row: { en: "T-Bar Row", fr: "Rowing T-bar", de: "T-Bar-Rudern", es: "Remo en barra T", it: "Rematore al T-bar", pt: "Remada cavalinho (T-bar)" },
  ex_seated_row: { en: "Seated Cable Row", fr: "Tirage horizontal", de: "Rudern am Kabelzug sitzend", es: "Remo sentado en polea", it: "Rematore al cavo da seduto", pt: "Remada sentada (polia)" },
  ex_db_row: { en: "Single-Arm Dumbbell Row", fr: "Rowing haltère unilatéral", de: "Einarmiges Kurzhantelrudern", es: "Remo a un brazo con mancuerna", it: "Rematore con manubrio a un braccio", pt: "Remada unilateral com halter" },
  ex_chest_row: { en: "Chest-Supported Row", fr: "Rowing buste appuyé", de: "Brustgestütztes Rudern", es: "Remo con apoyo en pecho", it: "Rematore con petto in appoggio", pt: "Remada com apoio no peito" },
  ex_deadlift: { en: "Deadlift", fr: "Soulevé de terre", de: "Kreuzheben", es: "Peso muerto", it: "Stacco da terra", pt: "Levantamento terra" },
  ex_rack_pull: { en: "Rack Pull", fr: "Rack pull (tirage depuis rack)", de: "Rack Pull", es: "Rack pull (peso muerto parcial)", it: "Rack pull", pt: "Rack pull" },
  ex_straight_pulldown: { en: "Straight-Arm Pulldown", fr: "Tirage bras tendus", de: "Geradarm-Latzug", es: "Jalón con brazos extendidos", it: "Pulldown a braccia tese", pt: "Puxada com braços estendidos" },
  ex_machine_row: { en: "Machine Row", fr: "Rowing à la machine", de: "Rudermaschine", es: "Remo en máquina", it: "Rematore alla macchina", pt: "Remada na máquina" },
  ex_inverted_row: { en: "Inverted Row", fr: "Rowing inversé (au poids du corps)", de: "Inverses Rudern (Bodyweight)", es: "Remo invertido", it: "Rematore inverso a corpo libero", pt: "Remada invertida" },
  ex_high_cable_row: { en: "High Cable Row", fr: "Tirage haut à la poulie", de: "Hoher Kabelzug-Rudern", es: "Remo alto en polea", it: "Rematore alto ai cavi", pt: "Remada alta na polia" },
  ex_underhand_row: { en: "Underhand Barbell Row", fr: "Rowing barre prise supination", de: "Langhantelrudern Untergriff", es: "Remo con barra agarre supino", it: "Rematore con bilanciere presa supina", pt: "Remada com barra pegada supinada" },

  ex_ohp: { en: "Overhead Press", fr: "Développé militaire", de: "Schulterdrücken (Military Press)", es: "Press militar", it: "Military press", pt: "Desenvolvimento militar" },
  ex_seated_db_press: { en: "Seated Dumbbell Shoulder Press", fr: "Développé épaules assis aux haltères", de: "Schulterdrücken mit Kurzhanteln sitzend", es: "Press de hombro sentado con mancuernas", it: "Shoulder press seduto con manubri", pt: "Desenvolvimento sentado com halteres" },
  ex_arnold: { en: "Arnold Press", fr: "Arnold press", de: "Arnold-Press", es: "Press Arnold", it: "Arnold press", pt: "Arnold press" },
  ex_machine_shoulder_press: { en: "Machine Shoulder Press", fr: "Développé épaules à la machine", de: "Schulterdrücken-Maschine", es: "Press de hombro en máquina", it: "Shoulder press con macchina", pt: "Desenvolvimento na máquina" },
  ex_lat_raise: { en: "Lateral Raise", fr: "Élévation latérale", de: "Seitheben", es: "Elevación lateral", it: "Alzate laterali", pt: "Elevação lateral" },
  ex_cable_lat_raise: { en: "Cable Lateral Raise", fr: "Élévation latérale à la poulie", de: "Seitheben am Kabelzug", es: "Elevación lateral en polea", it: "Alzate laterali ai cavi", pt: "Elevação lateral na polia" },
  ex_front_raise: { en: "Front Raise", fr: "Élévation frontale", de: "Frontheben", es: "Elevación frontal", it: "Alzate frontali", pt: "Elevação frontal" },
  ex_rear_delt_fly: { en: "Rear Delt Fly", fr: "Oiseau (élévation arrière)", de: "Reverse Flys (hintere Schulter)", es: "Elevación posterior (pájaros)", it: "Alzate posteriori", pt: "Crucifixo invertido" },
  ex_reverse_pec_deck: { en: "Reverse Pec Deck", fr: "Butterfly inversé", de: "Reverse Butterfly-Maschine", es: "Máquina de aperturas invertidas", it: "Peck deck inverso", pt: "Voador invertido" },
  ex_bent_rear_delt_cable: { en: "Bent-Over Cable Rear Delt Fly", fr: "Oiseau à la poulie buste penché", de: "Vorgebeugtes Kabel-Reverse-Fly", es: "Pájaros en polea con torso inclinado", it: "Alzate posteriori ai cavi da busto flesso", pt: "Crucifixo invertido na polia com tronco inclinado" },
  ex_face_pull: { en: "Face Pull", fr: "Face pull", de: "Face Pull", es: "Face pull", it: "Face pull", pt: "Face pull" },
  ex_upright_row: { en: "Upright Row", fr: "Rowing menton", de: "Aufrechtes Rudern", es: "Remo al mentón", it: "Rematore al mento", pt: "Remada alta" },
  ex_smith_shoulder_press: { en: "Smith Machine Shoulder Press", fr: "Développé épaules au Smith machine", de: "Schulterdrücken an der Smith-Maschine", es: "Press de hombro en máquina Smith", it: "Shoulder press alla Smith machine", pt: "Desenvolvimento na Smith machine" },
  ex_barbell_shrug: { en: "Barbell Shrug", fr: "Haussement d'épaules à la barre", de: "Schulterheben mit Langhantel", es: "Encogimiento de hombros con barra", it: "Shrug con bilanciere", pt: "Encolhimento com barra" },
  ex_db_shrug: { en: "Dumbbell Shrug", fr: "Haussement d'épaules aux haltères", de: "Schulterheben mit Kurzhanteln", es: "Encogimiento de hombros con mancuernas", it: "Shrug con manubri", pt: "Encolhimento com halteres" },

  ex_bb_curl: { en: "Barbell Curl", fr: "Curl à la barre", de: "Langhantel-Bizepscurl", es: "Curl con barra", it: "Curl con bilanciere", pt: "Rosca direta com barra" },
  ex_ezbar_curl: { en: "EZ-Bar Curl", fr: "Curl à la barre EZ", de: "EZ-Stangen-Curl", es: "Curl con barra Z", it: "Curl con bilanciere EZ", pt: "Rosca com barra W" },
  ex_db_curl: { en: "Dumbbell Curl", fr: "Curl aux haltères", de: "Kurzhantel-Curl", es: "Curl con mancuernas", it: "Curl con manubri", pt: "Rosca com halteres" },
  ex_hammer_curl: { en: "Hammer Curl", fr: "Curl marteau", de: "Hammer-Curl", es: "Curl martillo", it: "Curl a martello", pt: "Rosca martelo" },
  ex_inc_db_curl: { en: "Incline Dumbbell Curl", fr: "Curl incliné aux haltères", de: "Schräg-Curl mit Kurzhanteln", es: "Curl inclinado con mancuernas", it: "Curl su panca inclinata", pt: "Rosca inclinada com halteres" },
  ex_preacher_curl: { en: "Preacher Curl", fr: "Curl pupitre", de: "Scott-Curl", es: "Curl en banco Scott", it: "Curl alla panca Scott", pt: "Rosca Scott" },
  ex_conc_curl: { en: "Concentration Curl", fr: "Curl concentré", de: "Konzentrationscurl", es: "Curl de concentración", it: "Curl di concentrazione", pt: "Rosca concentrada" },
  ex_cable_curl: { en: "Cable Curl", fr: "Curl à la poulie", de: "Kabelzug-Curl", es: "Curl en polea", it: "Curl ai cavi", pt: "Rosca na polia" },
  ex_rope_hammer_curl: { en: "Rope Hammer Curl", fr: "Curl marteau à la corde", de: "Seil-Hammercurl", es: "Curl martillo con cuerda", it: "Curl a martello con corda", pt: "Rosca martelo na corda" },
  ex_machine_curl: { en: "Machine Bicep Curl", fr: "Curl biceps à la machine", de: "Bizeps-Curl-Maschine", es: "Curl de bíceps en máquina", it: "Curl bicipiti con macchina", pt: "Rosca na máquina" },
  ex_spider_curl: { en: "Spider Curl", fr: "Spider curl", de: "Spider-Curl", es: "Curl araña", it: "Spider curl", pt: "Rosca aranha" },
  ex_drag_curl: { en: "Drag Curl", fr: "Drag curl", de: "Drag-Curl", es: "Curl drag", it: "Drag curl", pt: "Rosca drag" },
  ex_cable_curl_single: { en: "Single-Arm Cable Curl", fr: "Curl à la poulie unilatéral", de: "Einarmiger Kabel-Curl", es: "Curl en polea a un brazo", it: "Curl ai cavi a un braccio", pt: "Rosca na polia unilateral" },
  ex_low_cable_curl: { en: "Low Pulley Cable Curl", fr: "Curl à la poulie basse", de: "Kabel-Curl am unteren Zug", es: "Curl en polea baja", it: "Curl ai cavi bassi", pt: "Rosca na polia baixa" },

  ex_pushdown: { en: "Tricep Pushdown", fr: "Extension triceps à la poulie", de: "Trizeps-Pushdown am Kabelzug", es: "Extensión de tríceps en polea", it: "Push down tricipiti", pt: "Tríceps na polia (barra)" },
  ex_rope_pushdown: { en: "Rope Pushdown", fr: "Extension triceps à la corde", de: "Seil-Pushdown", es: "Extensión de tríceps con cuerda", it: "Push down con corda", pt: "Tríceps na polia (corda)" },
  ex_overhead_cable_ext: { en: "Overhead Cable Extension", fr: "Extension triceps nuque à la poulie", de: "Überkopf-Trizepsstrecken am Kabel", es: "Extensión de tríceps sobre la cabeza en polea", it: "Estensioni tricipiti sopra la testa ai cavi", pt: "Tríceps testa na polia (acima da cabeça)" },
  ex_skullcrusher: { en: "Skull Crusher", fr: "Barre au front", de: "Trizepsdrücken (Skull Crusher)", es: "Press francés", it: "French press (skull crusher)", pt: "Tríceps testa com barra" },
  ex_overhead_db_ext: { en: "Overhead Dumbbell Extension", fr: "Extension triceps nuque à l'haltère", de: "Überkopf-Trizepsstrecken mit Kurzhantel", es: "Extensión de tríceps sobre la cabeza con mancuerna", it: "Estensioni tricipiti sopra la testa con manubrio", pt: "Tríceps francês com halter" },
  ex_cgbp: { en: "Close-Grip Bench Press", fr: "Développé couché prise serrée", de: "Enges Bankdrücken", es: "Press de banca agarre cerrado", it: "Panca presa stretta", pt: "Supino pegada fechada" },
  ex_dips: { en: "Dips", fr: "Dips", de: "Dips", es: "Fondos", it: "Dip", pt: "Mergulho (dips)" },
  ex_machine_tricep_ext: { en: "Machine Tricep Extension", fr: "Extension triceps à la machine", de: "Trizepsmaschine", es: "Extensión de tríceps en máquina", it: "Estensioni tricipiti con macchina", pt: "Extensão de tríceps na máquina" },
  ex_db_kickback: { en: "Dumbbell Kickback", fr: "Kickback à l'haltère", de: "Kurzhantel-Kickback", es: "Patada de tríceps con mancuerna", it: "Kickback con manubrio", pt: "Tríceps coice com halter" },
  ex_diamond_pushup: { en: "Diamond Push-Up", fr: "Pompes diamant", de: "Diamant-Liegestütz", es: "Flexiones diamante", it: "Push-up a diamante", pt: "Flexão diamante" },
  ex_pushdown_single: { en: "Single-Arm Cable Pushdown", fr: "Extension triceps poulie haute unilatérale", de: "Einarmiger Kabel-Pushdown", es: "Extensión de tríceps en polea a un brazo", it: "Push down ai cavi a un braccio", pt: "Tríceps na polia unilateral" },
  ex_overhead_ext_single: { en: "Single-Arm Overhead Cable Extension", fr: "Extension triceps nuque poulie unilatérale", de: "Einarmiges Überkopf-Trizepsstrecken am Kabel", es: "Extensión de tríceps sobre la cabeza en polea a un brazo", it: "Estensione tricipiti sopra la testa ai cavi a un braccio", pt: "Tríceps francês na polia unilateral" },

  ex_squat: { en: "Barbell Back Squat", fr: "Squat arrière à la barre", de: "Langhantel-Kniebeuge", es: "Sentadilla trasera con barra", it: "Squat con bilanciere", pt: "Agachamento com barra" },
  ex_front_squat: { en: "Front Squat", fr: "Front squat", de: "Front Squat", es: "Sentadilla frontal", it: "Front squat", pt: "Agachamento frontal" },
  ex_smith_squat: { en: "Smith Machine Squat", fr: "Squat au Smith machine", de: "Kniebeuge an der Smith-Maschine", es: "Sentadilla en máquina Smith", it: "Squat alla Smith machine", pt: "Agachamento na Smith machine" },
  ex_leg_press: { en: "Leg Press", fr: "Presse à cuisses", de: "Beinpresse", es: "Prensa de piernas", it: "Leg press", pt: "Leg press" },
  ex_hack_squat: { en: "Hack Squat", fr: "Hack squat", de: "Hack-Squat", es: "Sentadilla hack", it: "Hack squat", pt: "Agachamento hack" },
  ex_leg_ext: { en: "Leg Extension", fr: "Extension des jambes", de: "Beinstrecker", es: "Extensión de cuádriceps", it: "Leg extension", pt: "Cadeira extensora" },
  ex_walking_lunge: { en: "Walking Lunge", fr: "Fentes marchées", de: "Ausfallschritte (gehend)", es: "Zancadas caminando", it: "Affondi camminati", pt: "Afundo caminhando" },
  ex_goblet_squat: { en: "Goblet Squat", fr: "Squat goblet", de: "Goblet Squat", es: "Sentadilla goblet", it: "Goblet squat", pt: "Agachamento goblet" },
  ex_sissy_squat: { en: "Sissy Squat", fr: "Sissy squat", de: "Sissy Squat", es: "Sentadilla sissy", it: "Sissy squat", pt: "Agachamento sissy" },
  ex_stepup: { en: "Step-Up", fr: "Step-up", de: "Step-Up", es: "Step up (subida al cajón)", it: "Step up", pt: "Subida no step" },

  ex_rdl: { en: "Romanian Deadlift", fr: "Soulevé de terre roumain", de: "Rumänisches Kreuzheben", es: "Peso muerto rumano", it: "Stacco rumeno", pt: "Levantamento terra romeno" },
  ex_db_rdl: { en: "Dumbbell Romanian Deadlift", fr: "Soulevé de terre roumain aux haltères", de: "Rumänisches Kreuzheben mit Kurzhanteln", es: "Peso muerto rumano con mancuernas", it: "Stacco rumeno con manubri", pt: "Levantamento terra romeno com halteres" },
  ex_seated_leg_curl: { en: "Seated Leg Curl", fr: "Leg curl assis", de: "Sitzendes Beincurl", es: "Curl femoral sentado", it: "Leg curl da seduto", pt: "Mesa flexora sentado" },
  ex_lying_leg_curl: { en: "Lying Leg Curl", fr: "Leg curl allongé", de: "Liegendes Beincurl", es: "Curl femoral tumbado", it: "Leg curl sdraiato", pt: "Mesa flexora deitado" },
  ex_good_morning: { en: "Good Morning", fr: "Good morning", de: "Good Morning", es: "Buenos días (good morning)", it: "Good morning", pt: "Good morning" },
  ex_stiff_leg_deadlift: { en: "Stiff-Leg Deadlift", fr: "Soulevé de terre jambes tendues", de: "Kreuzheben mit gestreckten Beinen", es: "Peso muerto piernas rígidas", it: "Stacco a gambe tese", pt: "Levantamento terra pernas rígidas" },
  ex_nordic_curl: { en: "Nordic Hamstring Curl", fr: "Nordic curl (ischios)", de: "Nordic Curl", es: "Curl nórdico de isquiotibiales", it: "Nordic curl", pt: "Nordic curl (isquiotibiais)" },
  ex_cable_pullthrough: { en: "Cable Pull-Through", fr: "Pull-through à la poulie", de: "Kabelzug Pull-Through", es: "Pull-through en polea", it: "Pull through ai cavi", pt: "Pull-through na polia" },

  ex_hip_thrust: { en: "Barbell Hip Thrust", fr: "Hip thrust à la barre", de: "Hip Thrust mit Langhantel", es: "Hip thrust con barra", it: "Hip thrust con bilanciere", pt: "Elevação de quadril com barra" },
  ex_glute_bridge: { en: "Glute Bridge", fr: "Pont fessier", de: "Glute Bridge (Hüftheben)", es: "Puente de glúteos", it: "Ponte glutei", pt: "Ponte de glúteos" },
  ex_cable_kickback: { en: "Cable Glute Kickback", fr: "Kickback fessier à la poulie", de: "Kabelzug-Glute-Kickback", es: "Patada de glúteo en polea", it: "Kickback glutei ai cavi", pt: "Coice de glúteo na polia" },
  ex_bulg_split: { en: "Bulgarian Split Squat", fr: "Fente bulgare", de: "Bulgarischer Split Squat", es: "Sentadilla búlgara", it: "Affondo bulgaro", pt: "Agachamento búlgaro" },
  ex_hip_abduction: { en: "Hip Abduction Machine", fr: "Machine à abduction de hanche", de: "Hüft-Abduktionsmaschine", es: "Máquina de abducción de cadera", it: "Macchina per abduzione dell'anca", pt: "Máquina de abdução de quadril" },
  ex_sumo_deadlift: { en: "Sumo Deadlift", fr: "Soulevé de terre sumo", de: "Sumo-Kreuzheben", es: "Peso muerto sumo", it: "Stacco sumo", pt: "Levantamento terra sumô" },
  ex_donkey_kick: { en: "Donkey Kick", fr: "Donkey kick", de: "Donkey Kick", es: "Patada de burro", it: "Donkey kick", pt: "Coice (donkey kick)" },

  ex_standing_calf: { en: "Standing Calf Raise", fr: "Mollets debout", de: "Wadenheben stehend", es: "Elevación de talones de pie", it: "Calf raise in piedi", pt: "Elevação de panturrilha em pé" },
  ex_seated_calf: { en: "Seated Calf Raise", fr: "Mollets assis", de: "Wadenheben sitzend", es: "Elevación de talones sentado", it: "Calf raise da seduto", pt: "Elevação de panturrilha sentado" },
  ex_legpress_calf: { en: "Leg Press Calf Raise", fr: "Mollets à la presse", de: "Wadenheben an der Beinpresse", es: "Elevación de talones en prensa", it: "Calf raise alla leg press", pt: "Panturrilha na leg press" },
  ex_smith_calf: { en: "Smith Machine Calf Raise", fr: "Mollets au Smith machine", de: "Wadenheben an der Smith-Maschine", es: "Elevación de talones en máquina Smith", it: "Calf raise alla Smith machine", pt: "Panturrilha na Smith machine" },
  ex_single_calf: { en: "Single-Leg Calf Raise", fr: "Mollet unilatéral", de: "Einbeiniges Wadenheben", es: "Elevación de talón a una pierna", it: "Calf raise monopodalico", pt: "Panturrilha unilateral" },
  ex_donkey_calf: { en: "Donkey Calf Raise", fr: "Mollets donkey", de: "Donkey-Wadenheben", es: "Elevación de talones donkey", it: "Donkey calf raise", pt: "Panturrilha donkey" },

  ex_cable_crunch: { en: "Cable Crunch", fr: "Crunch à la poulie", de: "Kabelzug-Crunch", es: "Crunch en polea", it: "Crunch ai cavi", pt: "Abdominal na polia" },
  ex_hanging_raise: { en: "Hanging Leg Raise", fr: "Relevé de jambes suspendu", de: "Hängendes Beinheben", es: "Elevación de piernas colgado", it: "Sollevamento gambe alla sbarra", pt: "Elevação de pernas suspenso" },
  ex_plank: { en: "Plank", fr: "Gainage (planche)", de: "Unterarmstütz (Plank)", es: "Plancha (plank)", it: "Plank", pt: "Prancha" },
  ex_russian_twist: { en: "Russian Twist", fr: "Rotation russe (Russian twist)", de: "Russian Twist", es: "Giro ruso", it: "Russian twist", pt: "Russian twist" },
  ex_ab_wheel: { en: "Ab Wheel Rollout", fr: "Roulette abdominale", de: "Ab-Roller", es: "Rueda abdominal", it: "Ruota addominale", pt: "Roda abdominal" },
  ex_machine_crunch: { en: "Machine Crunch", fr: "Crunch à la machine", de: "Crunch-Maschine", es: "Crunch en máquina", it: "Crunch con macchina", pt: "Abdominal na máquina" },
  ex_situp: { en: "Sit-Up", fr: "Relevé de buste (sit-up)", de: "Sit-up", es: "Abdominal completo (sit-up)", it: "Sit-up", pt: "Abdominal completo (sit-up)" },
  ex_bicycle_crunch: { en: "Bicycle Crunch", fr: "Crunch vélo", de: "Fahrrad-Crunch", es: "Crunch bicicleta", it: "Crunch bicicletta", pt: "Abdominal bicicleta" },
  ex_lying_leg_raise: { en: "Lying Leg Raise", fr: "Relevé de jambes allongé", de: "Liegendes Beinheben", es: "Elevación de piernas tumbado", it: "Sollevamento gambe da sdraiato", pt: "Elevação de pernas deitado" },
  ex_side_plank: { en: "Side Plank", fr: "Gainage latéral", de: "Seitstütz", es: "Plancha lateral", it: "Plank laterale", pt: "Prancha lateral" },
  ex_woodchopper: { en: "Cable Woodchopper", fr: "Woodchopper à la poulie", de: "Kabelzug-Holzhacker (Woodchopper)", es: "Woodchopper en polea", it: "Woodchopper ai cavi", pt: "Woodchopper na polia" },

  ex_wrist_curl: { en: "Barbell Wrist Curl", fr: "Curl de poignet à la barre", de: "Handgelenkscurl mit Langhantel", es: "Curl de muñeca con barra", it: "Curl polsi con bilanciere", pt: "Rosca de punho com barra" },
  ex_rev_wrist_curl: { en: "Reverse Wrist Curl", fr: "Curl de poignet inversé", de: "Umgekehrtes Handgelenkscurl", es: "Curl de muñeca invertido", it: "Curl polsi inverso", pt: "Rosca de punho inversa" },
  ex_farmers_carry: { en: "Farmer's Carry", fr: "Marche du fermier", de: "Farmer's Walk", es: "Paseo del granjero", it: "Farmer's walk", pt: "Caminhada do fazendeiro" },
  ex_reverse_curl: { en: "Reverse Curl", fr: "Curl inversé", de: "Reverse Curl", es: "Curl inverso", it: "Curl inverso", pt: "Rosca inversa" },
  ex_plate_pinch: { en: "Plate Pinch Hold", fr: "Pince disque (plate pinch)", de: "Plate Pinch (Scheibenhalten)", es: "Sujeción de disco (pinch)", it: "Plate pinch", pt: "Pinça de anilha" },

  ex_kb_swing: { en: "Kettlebell Swing", fr: "Swing kettlebell", de: "Kettlebell Swing", es: "Swing con kettlebell", it: "Kettlebell swing", pt: "Swing com kettlebell" },
  ex_clean_press: { en: "Clean and Press", fr: "Épaulé-jeté (clean and press)", de: "Umsetzen und Drücken (Clean and Press)", es: "Cargada y press (clean and press)", it: "Clean and press", pt: "Clean and press" },
  ex_thruster: { en: "Thruster", fr: "Thruster", de: "Thruster", es: "Thruster", it: "Thruster", pt: "Thruster" },
  ex_burpee: { en: "Burpee", fr: "Burpee", de: "Burpee", es: "Burpee", it: "Burpee", pt: "Burpee" },
  ex_turkish_getup: { en: "Turkish Get-Up", fr: "Turkish get-up (lever turc)", de: "Turkish Get-Up", es: "Turkish get-up (incorporación turca)", it: "Turkish get-up", pt: "Turkish get-up" },
};

/* sub-target (specific muscle region) translations, for exercises where it adds useful detail */
const SUBT = {
  UPPER_CHEST: { en: "Upper chest", fr: "Haut des pectoraux", de: "Obere Brust", es: "Pecho superior", it: "Petto alto", pt: "Peito superior" },
  LOWER_CHEST: { en: "Lower chest", fr: "Bas des pectoraux", de: "Untere Brust", es: "Pecho inferior", it: "Petto basso", pt: "Peito inferior" },
  INNER_CHEST: { en: "Inner chest", fr: "Pectoraux internes", de: "Innere Brust", es: "Pecho interno", it: "Petto interno", pt: "Peito interno" },
  LATS: { en: "Lats", fr: "Grand dorsal", de: "Latissimus", es: "Dorsales", it: "Dorsali", pt: "Dorsais" },
  LOWER_LATS: { en: "Lower lats", fr: "Bas du dos (dorsaux)", de: "Untere Latissimus", es: "Dorsales bajos", it: "Dorsali bassi", pt: "Dorsais inferiores" },
  MID_BACK: { en: "Mid back", fr: "Milieu du dos", de: "Mittlerer Rücken", es: "Espalda media", it: "Schiena media", pt: "Meio das costas" },
  UPPER_BACK: { en: "Upper back", fr: "Haut du dos", de: "Oberer Rücken", es: "Espalda alta", it: "Schiena alta", pt: "Costas superiores" },
  REAR_DELTS: { en: "Rear delts", fr: "Arrière d'épaule", de: "Hintere Schulter", es: "Deltoides posterior", it: "Deltoidi posteriori", pt: "Deltoide posterior" },
  SIDE_DELTS: { en: "Side delts", fr: "Épaule latérale", de: "Seitliche Schulter", es: "Deltoides lateral", it: "Deltoidi laterali", pt: "Deltoide lateral" },
  FRONT_DELTS: { en: "Front delts", fr: "Épaule avant", de: "Vordere Schulter", es: "Deltoides anterior", it: "Deltoidi anteriori", pt: "Deltoide anterior" },
};
const EX_SUBTARGET = {
  ex_inc_bench: SUBT.UPPER_CHEST, ex_inc_db_press: SUBT.UPPER_CHEST, ex_inc_smith_bench: SUBT.UPPER_CHEST, ex_inc_db_fly: SUBT.UPPER_CHEST, ex_inc_pushup: SUBT.UPPER_CHEST,
  ex_dec_bench: SUBT.LOWER_CHEST, ex_dec_db_press: SUBT.LOWER_CHEST,
  ex_cable_crossover: SUBT.INNER_CHEST, ex_pec_deck: SUBT.INNER_CHEST, ex_low_high_fly: SUBT.INNER_CHEST,
  ex_lat_pulldown: SUBT.LATS, ex_pullup: SUBT.LATS, ex_chinup: SUBT.LATS, ex_straight_pulldown: SUBT.LATS,
  ex_cg_pulldown: SUBT.LOWER_LATS,
  ex_seated_row: SUBT.MID_BACK, ex_tbar_row: SUBT.MID_BACK, ex_chest_row: SUBT.MID_BACK, ex_machine_row: SUBT.MID_BACK, ex_barbell_row: SUBT.MID_BACK, ex_db_row: SUBT.MID_BACK,
  ex_high_cable_row: SUBT.UPPER_BACK, ex_underhand_row: SUBT.UPPER_BACK, ex_pendlay_row: SUBT.UPPER_BACK,
  ex_face_pull: SUBT.REAR_DELTS, ex_rear_delt_fly: SUBT.REAR_DELTS, ex_reverse_pec_deck: SUBT.REAR_DELTS,
  ex_lat_raise: SUBT.SIDE_DELTS, ex_cable_lat_raise: SUBT.SIDE_DELTS,
  ex_front_raise: SUBT.FRONT_DELTS,
};
const trSub = (id, lang) => EX_SUBTARGET[id]?.[lang] || null;

/* ------------------------------- strings ------------------------------- */

const STRINGS = {
  en: {
    nav: { home: "Home", log: "Log", progress: "Progress", sessions: "Sessions" },
    headers: { home: "This Week", sessions: "Sessions", log: "Log Workout", progress: "Progress" },
    home: {
      greeting: (n) => `Hi ${n} 👋`,
      subtitle: "Tap a session to log today's training.",
      emptyTitle: "No sessions yet",
      emptyBody: "Build your first weekly session — pick a name and add exercises.",
      createSession: "Create a session",
      exerciseCount: (n) => `${n} exercise${n !== 1 ? "s" : ""}`,
      lastLogged: (d) => `last ${d}`,
      notLoggedYet: "not logged yet",
    },
    sessions: { newSession: "New session", noExercisesYet: "No exercises yet", remove: "Remove", deleteSession: "Delete session", cancel: "Cancel", emptyTitle: "No sessions yet", emptyBody: "Create a session and add the exercises you train that day." },
    editor: { back: "Back", sessionName: "SESSION NAME", namePlaceholder: "e.g. Session A, Push, Upper…", exercisesLabel: "EXERCISES", add: "Add", noExercises: "No exercises added yet.", create: "Create session", save: "Save changes" },
    picker: { done: "Done adding", search: "Search exercises", all: "All", noMatch: "No exercises match." },
    log: { firstTime: "First time logging this session", beat: (d) => `Beat your ${d} numbers`, addSet: "Add set", finish: "Finish session", emptyTitle: "No sessions to log", emptyBody: "Create a session first in the Sessions tab.", saved: "Session saved", vol: "vol", same: "same" },
    progress: { emptyTitle: "No progress yet", emptyBody: "Log a session to start seeing your trend lines here.", volume: "Volume", topSet: "Top set", totalReps: "Total reps", kgTotal: "kg total", kg: "kg", reps: "reps", sinceFirst: "since first log", history: "HISTORY", noneTitle: "Nothing logged yet", noneBody: "This exercise hasn't been logged in a completed session." },
    language: "Language",
    account: { title: "Account", subtitle: "Your training data is saved automatically and tied to your Claude account — nothing is lost between visits.", namePlaceholder: "Your name (optional)", done: "Done" },
    extra: {
      daysLabel: "TRAINING DAYS", reminder: (n) => `Don't forget today's session: ${n}`, streak: (n) => `${n} day streak`,
      celebrate: "🎉 New progress!", chooseSession: "Choose a session", chooseExercise: "Choose an exercise", set: (n) => `Set ${n}`,
      weight: "Weight", reps: "Reps", trendTitle: "Last 3 sessions", progressing: "Progressing", stable: "Stable", regressing: "Regressing", notEnough: "Not enough data yet",
      recommended: "Suggested for this session", allExercises: "All exercises", startSession: "Start session", rest: "Rest",
      summaryTitle: "Session Summary", totalTime: "Total time", restTime: "Rest time", exercisesDone: "Exercises", setsDone: "Sets", setsByGroupTitle: "Sets per muscle group", doneBtn: "Done",
      restToday: "Rest day — nothing planned", todaySession: "Today's session", doneToday: "Today's session is done", upcoming: "Upcoming",
      exportData: "Export backup", importData: "Restore backup", exportHint: "Copy this text somewhere safe (like a notes app). If your data ever resets, paste it back here to restore everything.",
      copy: "Copy", copied: "Copied!", restore: "Restore", importPlaceholder: "Paste your backup here", importSuccess: "Data restored", importError: "That doesn't look like a valid backup",
      tomorrowSession: "Tomorrow's session", premiumLocked: "Premium", premiumLockMsg: "You can start this once it's actually scheduled for today — early start is a Premium feature.",
      premiumColorMsg: "Available in the Premium plan", appearance: "Appearance", startRest: "Start rest", gotIt: "Got it", premiumTitle: "Premium feature",
      plannedSets: (n) => `${n} planned set${n !== 1 ? "s" : ""}`, viewCalendar: "View calendar", today: "Today",
    },
  },
  fr: {
    nav: { home: "Accueil", log: "Séance", progress: "Progrès", sessions: "Séances" },
    headers: { home: "Cette semaine", sessions: "Séances", log: "Séance en cours", progress: "Progrès" },
    home: {
      greeting: (n) => `Salut ${n} 👋`,
      subtitle: "Touchez une séance pour enregistrer votre entraînement du jour.",
      emptyTitle: "Aucune séance",
      emptyBody: "Créez votre première séance hebdomadaire — choisissez un nom et ajoutez des exercices.",
      createSession: "Créer une séance",
      exerciseCount: (n) => `${n} exercice${n !== 1 ? "s" : ""}`,
      lastLogged: (d) => `dernière fois ${d}`,
      notLoggedYet: "jamais enregistrée",
    },
    sessions: { newSession: "Nouvelle séance", noExercisesYet: "Aucun exercice", remove: "Supprimer", deleteSession: "Supprimer la séance", cancel: "Annuler", emptyTitle: "Aucune séance", emptyBody: "Créez une séance et ajoutez les exercices que vous y pratiquez." },
    editor: { back: "Retour", sessionName: "NOM DE LA SÉANCE", namePlaceholder: "ex. Séance A, Push, Haut du corps…", exercisesLabel: "EXERCICES", add: "Ajouter", noExercises: "Aucun exercice ajouté.", create: "Créer la séance", save: "Enregistrer" },
    picker: { done: "Terminer", search: "Rechercher un exercice", all: "Tous", noMatch: "Aucun exercice ne correspond." },
    log: { firstTime: "Premier enregistrement de cette séance", beat: (d) => `Battez vos chiffres du ${d}`, addSet: "Ajouter une série", finish: "Terminer la séance", emptyTitle: "Aucune séance à enregistrer", emptyBody: "Créez d'abord une séance dans l'onglet Séances.", saved: "Séance enregistrée", vol: "vol", same: "identique" },
    progress: { emptyTitle: "Pas encore de progrès", emptyBody: "Enregistrez une séance pour voir votre courbe de progression ici.", volume: "Volume", topSet: "Meilleure série", totalReps: "Répétitions totales", kgTotal: "kg au total", kg: "kg", reps: "reps", sinceFirst: "depuis le premier enregistrement", history: "HISTORIQUE", noneTitle: "Rien d'enregistré", noneBody: "Cet exercice n'a pas encore été enregistré dans une séance terminée." },
    language: "Langue",
    account: { title: "Compte", subtitle: "Vos données d'entraînement sont enregistrées automatiquement et liées à votre compte Claude — rien n'est perdu d'une visite à l'autre.", namePlaceholder: "Votre nom (optionnel)", done: "Terminé" },
    extra: {
      daysLabel: "JOURS D'ENTRAÎNEMENT", reminder: (n) => `N'oublie pas ta séance du jour : ${n}`, streak: (n) => `${n} jour${n !== 1 ? "s" : ""} de suite`,
      celebrate: "🎉 Nouvelle progression !", chooseSession: "Choisissez une séance", chooseExercise: "Choisissez un exercice", set: (n) => `Série ${n}`,
      weight: "Poids", reps: "Répétitions", trendTitle: "3 dernières séances", progressing: "En progression", stable: "Stable", regressing: "En régression", notEnough: "Pas encore assez de données",
      recommended: "Suggestions pour cette séance", allExercises: "Tous les exercices", startSession: "Démarrer la séance", rest: "Repos",
      summaryTitle: "Récapitulatif", totalTime: "Temps total", restTime: "Temps de repos", exercisesDone: "Exercices", setsDone: "Séries", setsByGroupTitle: "Séries par groupe musculaire", doneBtn: "Terminé",
      restToday: "Repos — rien de prévu aujourd'hui", todaySession: "Ta séance du jour", doneToday: "Séance du jour terminée", upcoming: "À venir",
      exportData: "Exporter une sauvegarde", importData: "Restaurer une sauvegarde", exportHint: "Copie ce texte quelque part en sécurité (ex. app Notes). Si tes données sont réinitialisées, recolle-le ici pour tout récupérer.",
      copy: "Copier", copied: "Copié !", restore: "Restaurer", importPlaceholder: "Colle ta sauvegarde ici", importSuccess: "Données restaurées", importError: "Ceci ne ressemble pas à une sauvegarde valide",
      tomorrowSession: "Séance de demain", premiumLocked: "Premium", premiumLockMsg: "Tu pourras la démarrer le jour prévu — le démarrage anticipé est une fonctionnalité Premium.",
      premiumColorMsg: "Disponible dans la version Premium", appearance: "Apparence", startRest: "Démarrer le repos", gotIt: "Compris", premiumTitle: "Fonctionnalité Premium",
      plannedSets: (n) => `${n} série${n !== 1 ? "s" : ""} prévue${n !== 1 ? "s" : ""}`, viewCalendar: "Voir le calendrier", today: "Aujourd'hui",
    },
  },
  de: {
    nav: { home: "Start", log: "Training", progress: "Fortschritt", sessions: "Einheiten" },
    headers: { home: "Diese Woche", sessions: "Einheiten", log: "Training erfassen", progress: "Fortschritt" },
    home: {
      greeting: (n) => `Hallo ${n} 👋`,
      subtitle: "Tippe auf eine Einheit, um dein heutiges Training zu erfassen.",
      emptyTitle: "Noch keine Einheiten",
      emptyBody: "Erstelle deine erste wöchentliche Einheit — Name wählen und Übungen hinzufügen.",
      createSession: "Einheit erstellen",
      exerciseCount: (n) => `${n} Übung${n !== 1 ? "en" : ""}`,
      lastLogged: (d) => `zuletzt ${d}`,
      notLoggedYet: "noch nicht erfasst",
    },
    sessions: { newSession: "Neue Einheit", noExercisesYet: "Noch keine Übungen", remove: "Entfernen", deleteSession: "Einheit löschen", cancel: "Abbrechen", emptyTitle: "Noch keine Einheiten", emptyBody: "Erstelle eine Einheit und füge die Übungen hinzu, die du dort trainierst." },
    editor: { back: "Zurück", sessionName: "NAME DER EINHEIT", namePlaceholder: "z. B. Einheit A, Push, Oberkörper…", exercisesLabel: "ÜBUNGEN", add: "Hinzufügen", noExercises: "Noch keine Übungen hinzugefügt.", create: "Einheit erstellen", save: "Änderungen speichern" },
    picker: { done: "Fertig", search: "Übung suchen", all: "Alle", noMatch: "Keine Übungen gefunden." },
    log: { firstTime: "Erste Erfassung dieser Einheit", beat: (d) => `Schlage deine Werte vom ${d}`, addSet: "Satz hinzufügen", finish: "Training abschließen", emptyTitle: "Keine Einheit zum Erfassen", emptyBody: "Erstelle zuerst eine Einheit im Tab Einheiten.", saved: "Training gespeichert", vol: "Vol.", same: "gleich" },
    progress: { emptyTitle: "Noch kein Fortschritt", emptyBody: "Erfasse ein Training, um hier deine Entwicklung zu sehen.", volume: "Volumen", topSet: "Bester Satz", totalReps: "Wdh. gesamt", kgTotal: "kg gesamt", kg: "kg", reps: "Wdh.", sinceFirst: "seit erster Erfassung", history: "VERLAUF", noneTitle: "Noch nichts erfasst", noneBody: "Diese Übung wurde noch in keiner abgeschlossenen Einheit erfasst." },
    language: "Sprache",
    account: { title: "Konto", subtitle: "Deine Trainingsdaten werden automatisch gespeichert und mit deinem Claude-Konto verknüpft — nichts geht zwischen Besuchen verloren.", namePlaceholder: "Dein Name (optional)", done: "Fertig" },
    extra: {
      daysLabel: "TRAININGSTAGE", reminder: (n) => `Vergiss dein heutiges Training nicht: ${n}`, streak: (n) => `${n} Tage in Folge`,
      celebrate: "🎉 Neuer Fortschritt!", chooseSession: "Einheit wählen", chooseExercise: "Übung wählen", set: (n) => `Satz ${n}`,
      weight: "Gewicht", reps: "Wdh.", trendTitle: "Letzte 3 Einheiten", progressing: "Fortschritt", stable: "Stabil", regressing: "Rückgang", notEnough: "Noch nicht genug Daten",
      recommended: "Vorschläge für diese Einheit", allExercises: "Alle Übungen", startSession: "Training starten", rest: "Pause",
      summaryTitle: "Zusammenfassung", totalTime: "Gesamtzeit", restTime: "Pausenzeit", exercisesDone: "Übungen", setsDone: "Sätze", setsByGroupTitle: "Sätze pro Muskelgruppe", doneBtn: "Fertig",
      restToday: "Ruhetag — heute nichts geplant", todaySession: "Dein heutiges Training", doneToday: "Heutiges Training erledigt", upcoming: "Demnächst",
      exportData: "Backup exportieren", importData: "Backup wiederherstellen", exportHint: "Kopiere diesen Text an einen sicheren Ort (z. B. Notizen-App). Falls deine Daten je zurückgesetzt werden, füge ihn hier wieder ein.",
      copy: "Kopieren", copied: "Kopiert!", restore: "Wiederherstellen", importPlaceholder: "Backup hier einfügen", importSuccess: "Daten wiederhergestellt", importError: "Das sieht nicht wie ein gültiges Backup aus",
      tomorrowSession: "Training von morgen", premiumLocked: "Premium", premiumLockMsg: "Du kannst es starten, sobald es tatsächlich für heute geplant ist — vorzeitiger Start ist eine Premium-Funktion.",
      premiumColorMsg: "Verfügbar im Premium-Plan", appearance: "Erscheinungsbild", startRest: "Pause starten", gotIt: "Verstanden", premiumTitle: "Premium-Funktion",
      plannedSets: (n) => (n === 1 ? "1 geplanter Satz" : `${n} geplante Sätze`), viewCalendar: "Kalender ansehen", today: "Heute",
    },
  },
  es: {
    nav: { home: "Inicio", log: "Registrar", progress: "Progreso", sessions: "Sesiones" },
    headers: { home: "Esta semana", sessions: "Sesiones", log: "Registrar entrenamiento", progress: "Progreso" },
    home: {
      greeting: (n) => `Hola ${n} 👋`,
      subtitle: "Toca una sesión para registrar tu entrenamiento de hoy.",
      emptyTitle: "Aún no hay sesiones",
      emptyBody: "Crea tu primera sesión semanal: elige un nombre y añade ejercicios.",
      createSession: "Crear sesión",
      exerciseCount: (n) => `${n} ejercicio${n !== 1 ? "s" : ""}`,
      lastLogged: (d) => `última vez ${d}`,
      notLoggedYet: "aún sin registrar",
    },
    sessions: { newSession: "Nueva sesión", noExercisesYet: "Sin ejercicios", remove: "Eliminar", deleteSession: "Eliminar sesión", cancel: "Cancelar", emptyTitle: "Aún no hay sesiones", emptyBody: "Crea una sesión y añade los ejercicios que haces ese día." },
    editor: { back: "Atrás", sessionName: "NOMBRE DE LA SESIÓN", namePlaceholder: "ej. Sesión A, Push, Tren superior…", exercisesLabel: "EJERCICIOS", add: "Añadir", noExercises: "Aún no hay ejercicios añadidos.", create: "Crear sesión", save: "Guardar cambios" },
    picker: { done: "Listo", search: "Buscar ejercicio", all: "Todos", noMatch: "No hay ejercicios que coincidan." },
    log: { firstTime: "Primer registro de esta sesión", beat: (d) => `Supera tus cifras del ${d}`, addSet: "Añadir serie", finish: "Finalizar sesión", emptyTitle: "No hay sesiones para registrar", emptyBody: "Crea primero una sesión en la pestaña Sesiones.", saved: "Sesión guardada", vol: "vol", same: "igual" },
    progress: { emptyTitle: "Aún no hay progreso", emptyBody: "Registra una sesión para ver aquí tu evolución.", volume: "Volumen", topSet: "Mejor serie", totalReps: "Repeticiones totales", kgTotal: "kg en total", kg: "kg", reps: "reps", sinceFirst: "desde el primer registro", history: "HISTORIAL", noneTitle: "Nada registrado aún", noneBody: "Este ejercicio aún no se ha registrado en una sesión completada." },
    language: "Idioma",
    account: { title: "Cuenta", subtitle: "Tus datos de entrenamiento se guardan automáticamente y están vinculados a tu cuenta de Claude — no se pierde nada entre visitas.", namePlaceholder: "Tu nombre (opcional)", done: "Listo" },
    extra: {
      daysLabel: "DÍAS DE ENTRENAMIENTO", reminder: (n) => `No olvides tu sesión de hoy: ${n}`, streak: (n) => `${n} día${n !== 1 ? "s" : ""} seguidos`,
      celebrate: "🎉 ¡Nuevo progreso!", chooseSession: "Elige una sesión", chooseExercise: "Elige un ejercicio", set: (n) => `Serie ${n}`,
      weight: "Peso", reps: "Repeticiones", trendTitle: "Últimas 3 sesiones", progressing: "En progreso", stable: "Estable", regressing: "En retroceso", notEnough: "Aún no hay suficientes datos",
      recommended: "Sugerencias para esta sesión", allExercises: "Todos los ejercicios", startSession: "Comenzar entrenamiento", rest: "Descanso",
      summaryTitle: "Resumen", totalTime: "Tiempo total", restTime: "Tiempo de descanso", exercisesDone: "Ejercicios", setsDone: "Series", setsByGroupTitle: "Series por grupo muscular", doneBtn: "Listo",
      restToday: "Descanso — nada planeado hoy", todaySession: "Tu sesión de hoy", doneToday: "Sesión de hoy completada", upcoming: "Próximamente",
      exportData: "Exportar copia de seguridad", importData: "Restaurar copia de seguridad", exportHint: "Copia este texto en un lugar seguro (como una app de notas). Si tus datos se reinician alguna vez, pégalo aquí para recuperarlo todo.",
      copy: "Copiar", copied: "¡Copiado!", restore: "Restaurar", importPlaceholder: "Pega tu copia de seguridad aquí", importSuccess: "Datos restaurados", importError: "Esto no parece una copia de seguridad válida",
      tomorrowSession: "Sesión de mañana", premiumLocked: "Premium", premiumLockMsg: "Podrás iniciarla el día programado — el inicio anticipado es una función Premium.",
      premiumColorMsg: "Disponible en el plan Premium", appearance: "Apariencia", startRest: "Iniciar descanso", gotIt: "Entendido", premiumTitle: "Función Premium",
      plannedSets: (n) => `${n} serie${n !== 1 ? "s" : ""} prevista${n !== 1 ? "s" : ""}`, viewCalendar: "Ver calendario", today: "Hoy",
    },
  },
  it: {
    nav: { home: "Home", log: "Allenamento", progress: "Progressi", sessions: "Sessioni" },
    headers: { home: "Questa settimana", sessions: "Sessioni", log: "Registra allenamento", progress: "Progressi" },
    home: {
      greeting: (n) => `Ciao ${n} 👋`,
      subtitle: "Tocca una sessione per registrare l'allenamento di oggi.",
      emptyTitle: "Nessuna sessione",
      emptyBody: "Crea la tua prima sessione settimanale: scegli un nome e aggiungi gli esercizi.",
      createSession: "Crea sessione",
      exerciseCount: (n) => `${n} esercizio${n !== 1 ? "i" : ""}`,
      lastLogged: (d) => `ultima volta ${d}`,
      notLoggedYet: "non ancora registrata",
    },
    sessions: { newSession: "Nuova sessione", noExercisesYet: "Nessun esercizio", remove: "Rimuovi", deleteSession: "Elimina sessione", cancel: "Annulla", emptyTitle: "Nessuna sessione", emptyBody: "Crea una sessione e aggiungi gli esercizi che ci fai." },
    editor: { back: "Indietro", sessionName: "NOME SESSIONE", namePlaceholder: "es. Sessione A, Push, Upper…", exercisesLabel: "ESERCIZI", add: "Aggiungi", noExercises: "Nessun esercizio aggiunto.", create: "Crea sessione", save: "Salva modifiche" },
    picker: { done: "Fatto", search: "Cerca esercizio", all: "Tutti", noMatch: "Nessun esercizio corrisponde." },
    log: { firstTime: "Prima registrazione di questa sessione", beat: (d) => `Batti i tuoi numeri del ${d}`, addSet: "Aggiungi serie", finish: "Termina sessione", emptyTitle: "Nessuna sessione da registrare", emptyBody: "Crea prima una sessione nella scheda Sessioni.", saved: "Sessione salvata", vol: "vol", same: "uguale" },
    progress: { emptyTitle: "Ancora nessun progresso", emptyBody: "Registra una sessione per vedere qui il tuo andamento.", volume: "Volume", topSet: "Serie migliore", totalReps: "Ripetizioni totali", kgTotal: "kg totali", kg: "kg", reps: "rip.", sinceFirst: "dalla prima registrazione", history: "CRONOLOGIA", noneTitle: "Ancora nulla di registrato", noneBody: "Questo esercizio non è ancora stato registrato in una sessione completata." },
    language: "Lingua",
    account: { title: "Account", subtitle: "I tuoi dati di allenamento vengono salvati automaticamente e collegati al tuo account Claude — non si perde nulla tra una visita e l'altra.", namePlaceholder: "Il tuo nome (opzionale)", done: "Fatto" },
    extra: {
      daysLabel: "GIORNI DI ALLENAMENTO", reminder: (n) => `Non dimenticare la sessione di oggi: ${n}`, streak: (n) => `${n} giorni di fila`,
      celebrate: "🎉 Nuovo progresso!", chooseSession: "Scegli una sessione", chooseExercise: "Scegli un esercizio", set: (n) => `Serie ${n}`,
      weight: "Peso", reps: "Ripetizioni", trendTitle: "Ultime 3 sessioni", progressing: "In progresso", stable: "Stabile", regressing: "In calo", notEnough: "Non ci sono ancora abbastanza dati",
      recommended: "Suggerimenti per questa sessione", allExercises: "Tutti gli esercizi", startSession: "Inizia allenamento", rest: "Riposo",
      summaryTitle: "Riepilogo", totalTime: "Tempo totale", restTime: "Tempo di riposo", exercisesDone: "Esercizi", setsDone: "Serie", setsByGroupTitle: "Serie per gruppo muscolare", doneBtn: "Fatto",
      restToday: "Riposo — niente in programma oggi", todaySession: "La tua sessione di oggi", doneToday: "Sessione di oggi completata", upcoming: "In arrivo",
      exportData: "Esporta backup", importData: "Ripristina backup", exportHint: "Copia questo testo in un posto sicuro (es. app Note). Se i tuoi dati dovessero azzerarsi, incollalo qui per recuperare tutto.",
      copy: "Copia", copied: "Copiato!", restore: "Ripristina", importPlaceholder: "Incolla qui il tuo backup", importSuccess: "Dati ripristinati", importError: "Questo non sembra un backup valido",
      tomorrowSession: "Sessione di domani", premiumLocked: "Premium", premiumLockMsg: "Potrai iniziarla il giorno previsto — l'avvio anticipato è una funzione Premium.",
      premiumColorMsg: "Disponibile nel piano Premium", appearance: "Aspetto", startRest: "Avvia riposo", gotIt: "Ho capito", premiumTitle: "Funzione Premium",
      plannedSets: (n) => `${n} serie previste`, viewCalendar: "Vedi calendario", today: "Oggi",
    },
  },
  pt: {
    nav: { home: "Início", log: "Treino", progress: "Progresso", sessions: "Sessões" },
    headers: { home: "Esta semana", sessions: "Sessões", log: "Registrar treino", progress: "Progresso" },
    home: {
      greeting: (n) => `Olá ${n} 👋`,
      subtitle: "Toque numa sessão para registar o treino de hoje.",
      emptyTitle: "Ainda sem sessões",
      emptyBody: "Crie a sua primeira sessão semanal — escolha um nome e adicione exercícios.",
      createSession: "Criar sessão",
      exerciseCount: (n) => `${n} exercício${n !== 1 ? "s" : ""}`,
      lastLogged: (d) => `última vez ${d}`,
      notLoggedYet: "ainda não registada",
    },
    sessions: { newSession: "Nova sessão", noExercisesYet: "Sem exercícios", remove: "Remover", deleteSession: "Eliminar sessão", cancel: "Cancelar", emptyTitle: "Ainda sem sessões", emptyBody: "Crie uma sessão e adicione os exercícios que faz nesse dia." },
    editor: { back: "Voltar", sessionName: "NOME DA SESSÃO", namePlaceholder: "ex. Sessão A, Push, Superiores…", exercisesLabel: "EXERCÍCIOS", add: "Adicionar", noExercises: "Ainda sem exercícios adicionados.", create: "Criar sessão", save: "Guardar alterações" },
    picker: { done: "Concluir", search: "Procurar exercício", all: "Todos", noMatch: "Nenhum exercício encontrado." },
    log: { firstTime: "Primeiro registo desta sessão", beat: (d) => `Supere os seus números de ${d}`, addSet: "Adicionar série", finish: "Terminar sessão", emptyTitle: "Sem sessões para registar", emptyBody: "Crie primeiro uma sessão no separador Sessões.", saved: "Sessão guardada", vol: "vol", same: "igual" },
    progress: { emptyTitle: "Ainda sem progresso", emptyBody: "Registe uma sessão para ver aqui a sua evolução.", volume: "Volume", topSet: "Melhor série", totalReps: "Repetições totais", kgTotal: "kg no total", kg: "kg", reps: "reps", sinceFirst: "desde o primeiro registo", history: "HISTÓRICO", noneTitle: "Nada registado ainda", noneBody: "Este exercício ainda não foi registado numa sessão concluída." },
    language: "Idioma",
    account: { title: "Conta", subtitle: "Os seus dados de treino são guardados automaticamente e associados à sua conta Claude — nada se perde entre visitas.", namePlaceholder: "O seu nome (opcional)", done: "Concluído" },
    extra: {
      daysLabel: "DIAS DE TREINO", reminder: (n) => `Não se esqueça do treino de hoje: ${n}`, streak: (n) => `${n} dia${n !== 1 ? "s" : ""} seguidos`,
      celebrate: "🎉 Novo progresso!", chooseSession: "Escolha uma sessão", chooseExercise: "Escolha um exercício", set: (n) => `Série ${n}`,
      weight: "Peso", reps: "Repetições", trendTitle: "Últimas 3 sessões", progressing: "Em progresso", stable: "Estável", regressing: "Em regressão", notEnough: "Ainda sem dados suficientes",
      recommended: "Sugestões para esta sessão", allExercises: "Todos os exercícios", startSession: "Começar treino", rest: "Descanso",
      summaryTitle: "Resumo", totalTime: "Tempo total", restTime: "Tempo de descanso", exercisesDone: "Exercícios", setsDone: "Séries", setsByGroupTitle: "Séries por grupo muscular", doneBtn: "Concluído",
      restToday: "Descanso — nada planeado hoje", todaySession: "O seu treino de hoje", doneToday: "Treino de hoje concluído", upcoming: "Em breve",
      exportData: "Exportar backup", importData: "Restaurar backup", exportHint: "Copie este texto para um local seguro (ex. app de notas). Se os seus dados forem reiniciados, cole-o aqui para recuperar tudo.",
      copy: "Copiar", copied: "Copiado!", restore: "Restaurar", importPlaceholder: "Cole o seu backup aqui", importSuccess: "Dados restaurados", importError: "Isto não parece um backup válido",
      tomorrowSession: "Treino de amanhã", premiumLocked: "Premium", premiumLockMsg: "Poderá iniciá-lo no dia previsto — o início antecipado é um recurso Premium.",
      premiumColorMsg: "Disponível no plano Premium", appearance: "Aparência", startRest: "Iniciar descanso", gotIt: "Entendi", premiumTitle: "Recurso Premium",
      plannedSets: (n) => `${n} série${n !== 1 ? "s" : ""} planejada${n !== 1 ? "s" : ""}`, viewCalendar: "Ver calendário", today: "Hoje",
    },
  },
};

const LOCALE_MAP = { en: "en-US", fr: "fr-FR", de: "de-DE", es: "es-ES", it: "it-IT", pt: "pt-PT" };

/* ------------------------------- theme -------------------------------- */

const THEMES = {
  dark: { bg: "#15171A", surface: "#1E2124", surface2: "#262A2E", text: "#EDEDEA", textDim: "#9A9D9F", accent: "#E8483A", accentSoft: "rgba(232,72,58,0.16)", border: "#2E3236", positive: "#5EEAD4", positiveSoft: "rgba(94,234,212,0.14)" },
  light: { bg: "#F7F5F1", surface: "#FFFFFF", surface2: "#F0EDE6", text: "#1C1B19", textDim: "#78736A", accent: "#E8483A", accentSoft: "rgba(232,72,58,0.10)", border: "#E4E0D8", positive: "#0D9488", positiveSoft: "rgba(13,148,136,0.10)" },
};

/* ------------------------------- helpers ------------------------------- */

const uid = (p = "id") => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);
const formatDuration = (totalSec) => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};
const formatDateShort = (iso, lang) => new Date(iso + "T00:00:00").toLocaleDateString(LOCALE_MAP[lang] || "en-US", { month: "short", day: "numeric" });
const emptyData = () => ({ theme: "dark", language: "en", profileName: "", sessions: [], logs: [] });
const trGroup = (g, lang) => GROUP_LABELS[lang]?.[g] || g;
const trEquip = (e, lang) => EQUIP_LABELS[lang]?.[e] || e;
const trExName = (id, lang) => EX_NAMES[id]?.[lang] || EX_NAMES[id]?.en || id;

const weekdayCode = (d) => ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()];
const isoOf = (d) => d.toISOString().slice(0, 10);
const getScheduledSessions = (data, d) => {
  const code = weekdayCode(d);
  return data.sessions.filter((s) => (s.days || []).includes(code));
};
const isDayComplete = (data, dateISO, scheduled) => scheduled.every((s) => data.logs.some((l) => l.sessionId === s.id && l.date === dateISO));
const computeStreak = (data) => {
  const anyScheduled = data.sessions.some((s) => (s.days || []).length > 0);
  if (!anyScheduled) return 0;
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - 1);
  for (let i = 0; i < 365; i++) {
    const scheduled = getScheduledSessions(data, cursor);
    if (scheduled.length === 0) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (isDayComplete(data, isoOf(cursor), scheduled)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
};
const getUpcomingSessions = (data, count) => {
  const results = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);
  for (let i = 0; i < 60 && results.length < count; i++) {
    getScheduledSessions(data, cursor).forEach((s) => results.push({ date: isoOf(cursor), session: s }));
    cursor.setDate(cursor.getDate() + 1);
  }
  return results.slice(0, count);
};
const getTomorrowSessions = (data) => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getScheduledSessions(data, tomorrow);
};
const isSessionLockedToday = (session) => (session.days || []).length > 0 && !(session.days || []).includes(weekdayCode(new Date()));
const formatWeekdayLong = (iso, lang) => {
  const d = new Date(iso + "T00:00:00").toLocaleDateString(LOCALE_MAP[lang] || "en-US", { weekday: "long" });
  return d.charAt(0).toUpperCase() + d.slice(1);
};

/* ------------------------------- main app ------------------------------ */

export default function IronLog() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [loggingSessionId, setLoggingSessionId] = useState(null);
  const [banner, setBanner] = useState(null);
  const [premiumMsg, setPremiumMsg] = useState(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) setData({ ...emptyData(), ...JSON.parse(res.value) });
        else setData(emptyData());
      } catch (e) {
        setData(emptyData());
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("save failed", e);
    }
  }, []);

  const theme = THEMES[data?.theme === "light" ? "light" : "dark"];
  const lang = data?.language && STRINGS[data.language] ? data.language : "en";
  const L = STRINGS[lang];

  useEffect(() => {
    if (banner) {
      const t = setTimeout(() => setBanner(null), 2200);
      return () => clearTimeout(t);
    }
  }, [banner]);

  if (!loaded || !data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#15171A", color: "#9A9D9F", fontFamily: "Inter, sans-serif" }}>
        Loading…
      </div>
    );
  }

  const toggleTheme = () => persist({ ...data, theme: data.theme === "light" ? "dark" : "light" });
  const setLanguage = (code) => { persist({ ...data, language: code }); setLangMenuOpen(false); };
  const setProfileName = (name) => persist({ ...data, profileName: name });

  const saveSession = (session) => {
    const exists = data.sessions.some((s) => s.id === session.id);
    const sessions = exists ? data.sessions.map((s) => (s.id === session.id ? session : s)) : [...data.sessions, session];
    persist({ ...data, sessions });
  };

  const deleteSession = (id) => persist({ ...data, sessions: data.sessions.filter((s) => s.id !== id) });
  const saveLog = (log, celebrate) => { persist({ ...data, logs: [...data.logs, log] }); setBanner(celebrate ? L.extra.celebrate : L.log.saved); };
  const lastLogForSession = (sessionId) => {
    const logs = data.logs.filter((l) => l.sessionId === sessionId);
    if (!logs.length) return null;
    return logs.reduce((a, b) => (a.date > b.date ? a : b));
  };

  return (
    <FontLoader>
      <div
        style={{
          "--bg": theme.bg, "--surface": theme.surface, "--surface2": theme.surface2, "--text": theme.text,
          "--text-dim": theme.textDim, "--accent": theme.accent, "--accent-soft": theme.accentSoft,
          "--border": theme.border, "--positive": theme.positive, "--positive-soft": theme.positiveSoft,
          background: "var(--bg)", color: "var(--text)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 480, minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
          <Header
            title={tab === "home" ? L.headers.home : tab === "sessions" ? L.headers.sessions : tab === "log" ? L.headers.log : L.headers.progress}
            theme={data.theme} onToggleTheme={toggleTheme}
            lang={lang} onPickLang={setLanguage}
            langMenuOpen={langMenuOpen} onToggleLangMenu={() => { setAccountMenuOpen(false); setLangMenuOpen((v) => !v); }}
            accountMenuOpen={accountMenuOpen} onToggleAccountMenu={() => { setLangMenuOpen(false); setAccountMenuOpen((v) => !v); }}
            profileName={data.profileName} onSaveProfileName={setProfileName}
            fullData={data} onRestore={(obj) => persist({ ...emptyData(), ...obj })}
            onPremium={() => setPremiumMsg(L.extra.premiumColorMsg)}
            L={L}
          />

          <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 96px" }} onClick={() => { if (langMenuOpen) setLangMenuOpen(false); if (accountMenuOpen) setAccountMenuOpen(false); }}>
            {tab === "home" && (
              <HomeScreen data={data} lang={lang} L={L} lastLogForSession={lastLogForSession} onLog={(id) => { setLoggingSessionId(id); setTab("log"); }} onManage={() => setTab("sessions")} />
            )}
            {tab === "sessions" && !editingSessionId && <SessionsScreen data={data} lang={lang} L={L} onNew={() => setEditingSessionId("new")} onEdit={(id) => setEditingSessionId(id)} onDelete={deleteSession} />}
            {tab === "sessions" && editingSessionId && (
              <SessionEditor lang={lang} L={L} session={editingSessionId === "new" ? null : data.sessions.find((s) => s.id === editingSessionId)} onCancel={() => setEditingSessionId(null)} onSave={(s) => { saveSession(s); setEditingSessionId(null); }} />
            )}
            {tab === "log" && <LogScreen data={data} lang={lang} L={L} preselectedId={loggingSessionId} onSaved={(log, celebrate) => { saveLog(log, celebrate); setLoggingSessionId(null); setTab("home"); }} onPremium={() => setPremiumMsg(L.extra.premiumLockMsg)} />}
            {tab === "progress" && <ProgressScreen data={data} lang={lang} L={L} />}
          </div>

          {premiumMsg && <PremiumModal message={premiumMsg} onClose={() => setPremiumMsg(null)} L={L} />}

          {banner && (
            <div style={{ position: "absolute", bottom: 88, left: 16, right: 16, background: "var(--positive)", color: "#0B1615", borderRadius: 12, padding: "14px 16px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", animation: "ironlog-pop 0.4s ease-out" }}>
              {banner === L.extra.celebrate ? banner : (<><Check size={16} /> {banner}</>)}
            </div>
          )}

          <BottomNav tab={tab} L={L} onChange={(t) => { setEditingSessionId(null); if (t !== "log") setLoggingSessionId(null); setTab(t); }} />
        </div>
      </div>
    </FontLoader>
  );
}

/* ------------------------------ font loader ----------------------------- */

function FontLoader({ children }) {
  useEffect(() => {
    if (document.getElementById("iron-log-fonts")) return;
    const link = document.createElement("link");
    link.id = "iron-log-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);

    if (document.getElementById("iron-log-keyframes")) return;
    const style = document.createElement("style");
    style.id = "iron-log-keyframes";
    style.textContent = `
      @keyframes ironlog-pop { 0% { transform: scale(0.75) translateY(10px); opacity: 0; } 60% { transform: scale(1.06); opacity: 1; } 100% { transform: scale(1) translateY(0); } }
      @keyframes ironlog-flame { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    `;
    document.head.appendChild(style);
  }, []);
  return children;
}

const displayFont = { fontFamily: "'Oswald', 'Inter', sans-serif" };

/* -------------------------------- header -------------------------------- */

function Header({ title, theme, onToggleTheme, lang, onPickLang, langMenuOpen, onToggleLangMenu, accountMenuOpen, onToggleAccountMenu, profileName, onSaveProfileName, fullData, onRestore, onPremium, L }) {
  const [nameDraft, setNameDraft] = useState(profileName || "");
  const [backupMode, setBackupMode] = useState(null); // null | 'export' | 'import'
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setNameDraft(profileName || ""); setBackupMode(null); setImportText(""); setImportMsg(null); setCopied(false); }, [accountMenuOpen]);

  const exportText = useMemo(() => JSON.stringify(fullData), [fullData, backupMode]);
  const doCopy = () => {
    try {
      navigator.clipboard.writeText(exportText);
      setCopied(true);
    } catch (e) {}
  };
  const doRestore = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!parsed || typeof parsed !== "object") throw new Error("bad");
      onRestore(parsed);
      setImportMsg({ ok: true });
    } catch (e) {
      setImportMsg({ ok: false });
    }
  };

  return (
    <div style={{ padding: "20px 16px 12px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Dumbbell size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ ...displayFont, fontSize: 20, fontWeight: 600, letterSpacing: 0.3 }}>{title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onToggleAccountMenu(); }} aria-label={L.account.title} style={{ width: 36, height: 36, borderRadius: 18, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dim)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <User size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleLangMenu(); }} aria-label={L.language} style={{ width: 36, height: 36, borderRadius: 18, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dim)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Globe size={16} />
          </button>
          <button onClick={onToggleTheme} aria-label="Toggle theme" style={{ width: 36, height: 36, borderRadius: 18, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-dim)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      {langMenuOpen && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 60, right: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.3)", overflow: "hidden", zIndex: 20, minWidth: 160 }}>
          <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}>{L.language.toUpperCase()}</div>
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => onPickLang(l.code)} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: l.code === lang ? "var(--accent-soft)" : "transparent", border: "none", cursor: "pointer", fontSize: 14, color: l.code === lang ? "var(--accent)" : "var(--text)", fontWeight: l.code === lang ? 700 : 500, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {l.native}
              {l.code === lang && <Check size={14} />}
            </button>
          ))}
        </div>
      )}

      {accountMenuOpen && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 60, right: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.3)", zIndex: 20, width: 280, padding: 16, maxHeight: "70vh", overflowY: "auto" }}>
          <div style={{ ...displayFont, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{L.account.title}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 12 }}>{L.account.subtitle}</div>
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder={L.account.namePlaceholder}
            style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)", fontSize: 13, boxSizing: "border-box", marginBottom: 10 }}
          />
          <button onClick={() => { onSaveProfileName(nameDraft.trim()); }} style={{ width: "100%", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
            {L.account.done}
          </button>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            {backupMode === null && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setBackupMode("export")} style={{ width: "100%", background: "var(--surface2)", color: "var(--text)", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {L.extra.exportData}
                </button>
                <button onClick={() => setBackupMode("import")} style={{ width: "100%", background: "var(--surface2)", color: "var(--text)", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {L.extra.importData}
                </button>
              </div>
            )}

            {backupMode === "export" && (
              <div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.4, marginBottom: 8 }}>{L.extra.exportHint}</div>
                <textarea readOnly value={exportText} onFocus={(e) => e.target.select()} style={{ width: "100%", height: 90, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, color: "var(--text)", fontSize: 10, boxSizing: "border-box", resize: "none", marginBottom: 8, fontFamily: "monospace" }} />
                <button onClick={doCopy} style={{ width: "100%", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
                  {copied ? L.extra.copied : L.extra.copy}
                </button>
                <button onClick={() => setBackupMode(null)} style={{ width: "100%", background: "none", border: "none", color: "var(--text-dim)", fontSize: 12, cursor: "pointer" }}>
                  {L.editor.back}
                </button>
              </div>
            )}

            {backupMode === "import" && (
              <div>
                <textarea
                  value={importText}
                  onChange={(e) => { setImportText(e.target.value); setImportMsg(null); }}
                  placeholder={L.extra.importPlaceholder}
                  style={{ width: "100%", height: 90, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, color: "var(--text)", fontSize: 10, boxSizing: "border-box", resize: "none", marginBottom: 8, fontFamily: "monospace" }}
                />
                {importMsg && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: importMsg.ok ? "var(--positive)" : "var(--accent)", marginBottom: 8 }}>
                    {importMsg.ok ? L.extra.importSuccess : L.extra.importError}
                  </div>
                )}
                <button onClick={doRestore} disabled={!importText.trim()} style={{ width: "100%", background: importText.trim() ? "var(--accent)" : "var(--surface2)", color: importText.trim() ? "#fff" : "var(--text-dim)", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: importText.trim() ? "pointer" : "not-allowed", marginBottom: 8 }}>
                  {L.extra.restore}
                </button>
                <button onClick={() => setBackupMode(null)} style={{ width: "100%", background: "none", border: "none", color: "var(--text-dim)", fontSize: 12, cursor: "pointer" }}>
                  {L.editor.back}
                </button>
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.extra.appearance}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ color: "#E8483A", active: true }, { color: "#3B82F6" }, { color: "#22C55E" }, { color: "#A855F7" }, { color: "#F59E0B" }, { color: "#14B8A6" }].map((c, i) => (
                <button
                  key={i}
                  onClick={() => { if (!c.active) onPremium(); }}
                  style={{ width: 30, height: 30, borderRadius: 15, background: c.color, border: c.active ? "2px solid var(--text)" : "2px solid transparent", cursor: "pointer" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- bottom nav ----------------------------- */

function PremiumModal({ message, onClose, L }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: 16, padding: 22, maxWidth: 320, width: "100%", textAlign: "center", animation: "ironlog-pop 0.25s ease-out" }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Lock size={22} color="var(--accent)" />
        </div>
        <div style={{ ...displayFont, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{L.extra.premiumTitle}</div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 18 }}>{message}</div>
        <button onClick={onClose} style={{ width: "100%", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {L.extra.gotIt}
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, onChange, L }) {
  const items = [
    { id: "home", label: L.nav.home, icon: HomeIcon },
    { id: "log", label: L.nav.log, icon: Play },
    { id: "progress", label: L.nav.progress, icon: TrendingUp },
    { id: "sessions", label: L.nav.sessions, icon: ListChecks },
  ];
  return (
    <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", padding: "8px 8px calc(8px + env(safe-area-inset-bottom))" }}>
      {items.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 0", background: "transparent", border: "none", cursor: "pointer", color: active ? "var(--accent)" : "var(--text-dim)" }}>
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- home screen ---------------------------- */

function HomeScreen({ data, lang, L, lastLogForSession, onLog, onManage }) {
  if (!data.sessions.length) return <EmptyState title={L.home.emptyTitle} body={L.home.emptyBody} actionLabel={L.home.createSession} onAction={onManage} />;

  const streak = useMemo(() => computeStreak(data), [data]);
  const today = new Date();
  const todayISOStr = isoOf(today);
  const scheduledToday = useMemo(() => getScheduledSessions(data, today), [data]);
  const pendingToday = scheduledToday.filter((s) => !data.logs.some((l) => l.sessionId === s.id && l.date === todayISOStr));
  const todayCode = weekdayCode(today);
  const tomorrowSessions = useMemo(() => getTomorrowSessions(data), [data]);

  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const monthLabel = cursor.toLocaleDateString(LOCALE_MAP[lang] || "en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "6px 0 2px" }}>
        {data.profileName ? <div style={{ ...displayFont, fontSize: 16, fontWeight: 600 }}>{L.home.greeting(data.profileName)}</div> : <div />}
        {streak > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--accent-soft)", borderRadius: 20, padding: "5px 10px" }}>
            <Flame size={14} color="var(--accent)" style={{ animation: "ironlog-flame 1.6s ease-in-out infinite" }} fill="var(--accent)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{L.extra.streak(streak)}</span>
          </div>
        )}
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: 13, margin: "4px 0 12px" }}>{L.home.subtitle}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, width: 28, height: 28, color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={14} />
        </button>
        <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{monthLabel}</div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, width: 28, height: 28, color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {WEEKDAY_CODES.map((code) => (
          <div key={code} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--text-dim)" }}>{WEEKDAY_LABELS[lang][code]}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 20 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateObj = new Date(year, month, d);
          const iso = isoOf(dateObj);
          const scheduled = getScheduledSessions(data, dateObj);
          const isToday = iso === todayISOStr;
          const hasSession = scheduled.length > 0;
          return (
            <button
              key={i}
              onClick={() => hasSession && onLog(scheduled[0].id)}
              style={{
                height: 48, borderRadius: 9, border: "1px solid " + (isToday ? "var(--text)" : hasSession ? "var(--accent)" : "var(--border)"),
                background: hasSession ? "var(--accent)" : "var(--surface)", color: hasSession ? "#fff" : "var(--text)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                cursor: hasSession ? "pointer" : "default", padding: "2px 1px", overflow: "hidden",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>{d}</span>
              {hasSession && (
                <span style={{ fontSize: 7.5, fontWeight: 700, lineHeight: 1, color: "#fff", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {scheduled.map((s) => s.name).join("/")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pendingToday.length > 0 ? (
          pendingToday.map((s) => (
            <button key={s.id} onClick={() => onLog(s.id)} style={{ textAlign: "left", background: "var(--accent)", border: "none", borderRadius: 14, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{L.extra.todaySession}</div>
                <div style={{ ...displayFont, fontSize: 19, fontWeight: 700, color: "#fff" }}>{s.name}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Play size={15} fill="#fff" color="#fff" />
              </div>
            </button>
          ))
        ) : scheduledToday.length > 0 ? (
          <div style={{ background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 14, padding: "16px", color: "var(--positive)", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={16} /> {L.extra.doneToday}
          </div>
        ) : (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", color: "var(--text-dim)", fontWeight: 600, fontSize: 14 }}>
            {L.extra.restToday}
          </div>
        )}
      </div>

      {tomorrowSessions.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.extra.tomorrowSession}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tomorrowSessions.map((s) => (
              <button key={s.id} onClick={() => onLog(s.id)} style={{ textAlign: "left", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                </div>
                <ChevronRight size={16} color="var(--text-dim)" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ empty state ------------------------------ */

function EmptyState({ title, body, actionLabel, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 12px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Dumbbell size={24} color="var(--text-dim)" />
      </div>
      <div style={{ ...displayFont, fontSize: 19, fontWeight: 600 }}>{title}</div>
      <div style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{body}</div>
      {actionLabel && (
        <button onClick={onAction} style={{ marginTop: 20, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ------------------------------ sessions list ---------------------------- */

function SessionsScreen({ data, lang, L, onNew, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  return (
    <div>
      <button onClick={onNew} style={{ width: "100%", border: "1px dashed var(--border)", background: "var(--surface)", borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--accent)", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>
        <Plus size={16} /> {L.sessions.newSession}
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.sessions.map((s) => (
          <div key={s.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => onEdit(s.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", flex: 1 }}>
                <div style={{ ...displayFont, fontSize: 17, fontWeight: 600 }}>{s.name}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 3 }}>
                  {s.exercises.length ? s.exercises.map((e) => trExName(e.exerciseId, lang)).join(", ") : L.sessions.noExercisesYet}
                </div>
              </button>
              <button onClick={() => onEdit(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: 6 }}>
                <ChevronRight size={18} />
              </button>
            </div>
            {confirmId === s.id ? (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={() => { onDelete(s.id); setConfirmId(null); }} style={{ flex: 1, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{L.sessions.deleteSession}</button>
                <button onClick={() => setConfirmId(null)} style={{ flex: 1, background: "var(--surface2)", color: "var(--text)", border: "none", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{L.sessions.cancel}</button>
              </div>
            ) : (
              <button onClick={() => setConfirmId(s.id)} style={{ marginTop: 8, background: "none", border: "none", color: "var(--text-dim)", fontSize: 12, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0 }}>
                <Trash2 size={12} /> {L.sessions.remove}
              </button>
            )}
          </div>
        ))}
      </div>

      {!data.sessions.length && <EmptyState title={L.sessions.emptyTitle} body={L.sessions.emptyBody} />}
    </div>
  );
}

/* ------------------------------ session editor ---------------------------- */

function SessionEditor({ session, onCancel, onSave, lang, L }) {
  const [name, setName] = useState(session?.name || "");
  const [exercises, setExercises] = useState(session?.exercises || []);
  const [days, setDays] = useState(session?.days || []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const isNew = !session;

  const addExercise = (ex) => {
    if (exercises.some((e) => e.exerciseId === ex.id)) return;
    setExercises([...exercises, { id: uid("sex"), exerciseId: ex.id, group: ex.group, equip: ex.equip, targetSets: 3 }]);
  };

  const removeExercise = (id) => setExercises(exercises.filter((e) => e.id !== id));
  const removeExerciseByExerciseId = (exerciseId) => setExercises(exercises.filter((e) => e.exerciseId !== exerciseId));
  const toggleExercise = (ex) => {
    if (exercises.some((e) => e.exerciseId === ex.id)) removeExerciseByExerciseId(ex.id);
    else addExercise(ex);
  };
  const updateSets = (id, delta) => setExercises(exercises.map((e) => (e.id === id ? { ...e, targetSets: Math.max(1, e.targetSets + delta) } : e)));
  const updateSetsByExerciseId = (exerciseId, delta) => setExercises(exercises.map((e) => (e.exerciseId === exerciseId ? { ...e, targetSets: Math.max(1, e.targetSets + delta) } : e)));
  const toggleDay = (code) => setDays((d) => (d.includes(code) ? d.filter((c) => c !== code) : [...d, code]));
  const canSave = name.trim().length > 0 && exercises.length > 0;

  if (pickerOpen) return <ExercisePicker lang={lang} L={L} exercises={exercises} onToggle={toggleExercise} onChangeSets={updateSetsByExerciseId} onDone={() => setPickerOpen(false)} splitKey={inferSplit(name)} />;

  return (
    <div>
      <button onClick={onCancel} style={{ background: "none", border: "none", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0, marginBottom: 16, fontSize: 13 }}>
        <ChevronLeft size={16} /> {L.editor.back}
      </button>

      <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{L.editor.sessionName}</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder={L.editor.namePlaceholder} style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", color: "var(--text)", fontSize: 16, marginTop: 6, marginBottom: 10, boxSizing: "border-box", ...displayFont }} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {Object.keys(SPLIT_LABELS[lang]).map((key) => {
          const label = SPLIT_LABELS[lang][key];
          const active = name === label;
          return (
            <button key={key} onClick={() => setName(label)} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid " + (active ? "var(--accent)" : "var(--border)"), background: active ? "var(--accent-soft)" : "var(--surface2)", color: active ? "var(--accent)" : "var(--text-dim)", cursor: "pointer" }}>
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{L.editor.exercisesLabel}</span>
        <button onClick={() => setPickerOpen(true)} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Plus size={14} /> {L.editor.add}
        </button>
      </div>

      {!exercises.length && <div style={{ color: "var(--text-dim)", fontSize: 13, padding: "20px 0", textAlign: "center" }}>{L.editor.noExercises}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
        {exercises.map((e) => (
          <div key={e.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{trExName(e.exerciseId, lang)}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{trGroup(e.group, lang)} · {trEquip(e.equip, lang)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface2)", borderRadius: 8, padding: "3px 6px" }}>
                <Stepper onClick={() => updateSets(e.id, -1)} icon={Minus} />
                <span style={{ fontSize: 13, fontWeight: 700, width: 18, textAlign: "center" }}>{e.targetSets}</span>
                <Stepper onClick={() => updateSets(e.id, 1)} icon={Plus} />
              </div>
              <button onClick={() => removeExercise(e.id)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 2 }}>
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 10 }}>{L.extra.daysLabel}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {WEEKDAY_CODES.map((code) => {
          const active = days.includes(code);
          return (
            <button
              key={code}
              onClick={() => toggleDay(code)}
              style={{ width: 42, height: 38, borderRadius: 10, border: "1px solid " + (active ? "var(--accent)" : "var(--border)"), background: active ? "var(--accent-soft)" : "var(--surface)", color: active ? "var(--accent)" : "var(--text-dim)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              {WEEKDAY_LABELS[lang][code]}
            </button>
          );
        })}
      </div>

      <button disabled={!canSave} onClick={() => onSave({ id: session?.id || uid("sess"), name: name.trim(), exercises, days })} style={{ width: "100%", marginTop: 16, background: canSave ? "var(--accent)" : "var(--surface2)", color: canSave ? "#fff" : "var(--text-dim)", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed" }}>
        {isNew ? L.editor.create : L.editor.save}
      </button>
    </div>
  );
}

function Stepper({ onClick, icon: Icon }) {
  return (
    <button onClick={onClick} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "var(--surface)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <Icon size={12} />
    </button>
  );
}

/* ------------------------------ exercise picker ---------------------------- */

function ExercisePicker({ exercises, onToggle, onChangeSets, onDone, lang, L, splitKey }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [equip, setEquip] = useState("All");
  const existingIds = exercises.map((e) => e.exerciseId);

  const filtered = sortByPopularity(
    EXERCISE_LIBRARY.filter((ex) => {
      const localizedName = trExName(ex.id, lang).toLowerCase();
      const matchesQuery = localizedName.includes(query.toLowerCase());
      const matchesGroup = group === "All" || ex.group === group;
      const matchesEquip = equip === "All" || ex.equip === equip;
      return matchesQuery && matchesGroup && matchesEquip;
    })
  );

  const recommendedIds = splitKey ? new Set(SPLIT_GROUPS[splitKey]) : null;
  const recommended = recommendedIds ? filtered.filter((ex) => recommendedIds.has(ex.group)) : [];
  const rest = recommendedIds ? filtered.filter((ex) => !recommendedIds.has(ex.group)) : filtered;

  const renderRow = (ex) => {
    const added = existingIds.includes(ex.id);
    const sessionEx = exercises.find((e) => e.exerciseId === ex.id);
    return (
      <div key={ex.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: added ? "var(--accent-soft)" : "var(--surface)", border: "1px solid " + (added ? "var(--accent)" : "var(--border)"), borderRadius: 10, padding: "10px 12px" }}>
        <button onClick={() => onToggle(ex)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{trExName(ex.id, lang)}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{trGroup(ex.group, lang)} · {trEquip(ex.equip, lang)}</div>
        </button>
        {added ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface2)", borderRadius: 8, padding: "3px 6px" }}>
              <Stepper onClick={() => onChangeSets(ex.id, -1)} icon={Minus} />
              <span style={{ fontSize: 13, fontWeight: 700, width: 16, textAlign: "center" }}>{sessionEx?.targetSets ?? 3}</span>
              <Stepper onClick={() => onChangeSets(ex.id, 1)} icon={Plus} />
            </div>
            <button onClick={() => onToggle(ex)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 2, display: "flex" }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => onToggle(ex)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", flexShrink: 0 }}>
            <Plus size={16} color="var(--accent)" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <button onClick={onDone} style={{ background: "none", border: "none", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0, marginBottom: 14, fontSize: 13 }}>
        <ChevronLeft size={16} /> {L.picker.done}
      </button>

      <div style={{ position: "relative", marginBottom: 10 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-dim)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={L.picker.search} style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px 10px 34px", color: "var(--text)", fontSize: 14, boxSizing: "border-box" }} />
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
        {["All", ...MUSCLE_GROUPS].map((g) => (
          <button key={g} onClick={() => setGroup(g)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid " + (group === g ? "var(--accent)" : "var(--border)"), background: group === g ? "var(--accent-soft)" : "var(--surface)", color: group === g ? "var(--accent)" : "var(--text-dim)", cursor: "pointer" }}>
            {g === "All" ? L.picker.all : trGroup(g, lang)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 8 }}>
        {["All", ...EQUIPMENT].map((eq) => (
          <button key={eq} onClick={() => setEquip(eq)} style={{ flexShrink: 0, padding: "5px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, border: "1px solid " + (equip === eq ? "var(--text)" : "var(--border)"), background: equip === eq ? "var(--surface2)" : "transparent", color: equip === eq ? "var(--text)" : "var(--text-dim)", cursor: "pointer" }}>
            {eq === "All" ? L.picker.all : trEquip(eq, lang)}
          </button>
        ))}
      </div>

      {recommendedIds && recommended.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, margin: "6px 0 8px" }}>{L.extra.recommended}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>{recommended.map(renderRow)}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700, margin: "6px 0 8px" }}>{L.extra.allExercises}</div>
        </>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rest.map(renderRow)}
        {!filtered.length && <div style={{ color: "var(--text-dim)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>{L.picker.noMatch}</div>}
      </div>
    </div>
  );
}

/* --------------------------------- log screen ------------------------------ */

function LogScreen({ data, preselectedId, onSaved, lang, L, onPremium }) {
  const [sessionId, setSessionId] = useState(preselectedId || data.sessions[0]?.id || null);
  const session = data.sessions.find((s) => s.id === sessionId);
  const [phase, setPhase] = useState("overview"); // overview | active | summary
  const [summaryStats, setSummaryStats] = useState(null);
  const [pending, setPending] = useState(null); // { log, celebrate }

  useEffect(() => { if (preselectedId) setSessionId(preselectedId); }, [preselectedId]);
  useEffect(() => { setPhase("overview"); }, [sessionId]);

  const previousLog = useMemo(() => {
    if (!session) return null;
    const logs = data.logs.filter((l) => l.sessionId === session.id);
    if (!logs.length) return null;
    return logs.reduce((a, b) => (a.date > b.date ? a : b));
  }, [data.logs, session]);

  const [entries, setEntries] = useState({});

  useEffect(() => {
    if (!session) return;
    const initial = {};
    session.exercises.forEach((ex) => {
      const prevEntry = previousLog?.entries.find((e) => e.sessionExerciseId === ex.id);
      initial[ex.id] = Array.from({ length: ex.targetSets }, (_, i) => ({ weight: "", reps: "", prevWeight: prevEntry?.sets?.[i]?.weight ?? null, prevReps: prevEntry?.sets?.[i]?.reps ?? null }));
    });
    setEntries(initial);
  }, [session?.id]);

  // elapsed session timer
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    if (phase !== "active" || !startedAt) return;
    const t = setInterval(() => setElapsedSec(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase, startedAt]);

  // rest timer
  const [rest, setRest] = useState({ running: false, remaining: 0, duration: 0 });
  const [restDurations, setRestDurations] = useState({});
  const adjustRestDuration = (exId, delta) => setRestDurations((prev) => ({ ...prev, [exId]: Math.max(15, Math.min(600, (prev[exId] ?? 90) + delta) ) }));
  const [restAccumulated, setRestAccumulated] = useState(0);
  useEffect(() => {
    if (!rest.running) return;
    const t = setInterval(() => {
      setRestAccumulated((v) => v + 1);
      setRest((r) => {
        if (r.remaining <= 1) return { ...r, running: false, remaining: 0 };
        return { ...r, remaining: r.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [rest.running]);

  if (!data.sessions.length) return <EmptyState title={L.log.emptyTitle} body={L.log.emptyBody} />;

  const updateSet = (exId, idx, field, value) => setEntries((prev) => ({ ...prev, [exId]: prev[exId].map((s, i) => (i === idx ? { ...s, [field]: value } : s)) }));
  const addSet = (exId) => setEntries((prev) => ({ ...prev, [exId]: [...prev[exId], { weight: "", reps: "", prevWeight: null, prevReps: null }] }));
  const hasAnyInput = Object.values(entries).some((sets) => sets.some((s) => s.weight !== "" || s.reps !== ""));

  const startRest = (seconds) => setRest({ running: true, remaining: seconds, duration: seconds });
  const cancelRest = () => setRest({ running: false, remaining: 0, duration: 0 });

  const startSession = () => { setStartedAt(Date.now()); setElapsedSec(0); setPhase("active"); };

  const finish = () => {
    const logEntries = session.exercises.map((ex) => ({
      sessionExerciseId: ex.id, exerciseId: ex.exerciseId,
      sets: entries[ex.id].filter((s) => s.weight !== "" && s.reps !== "").map((s) => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps, 10) })),
    }));
    let celebrate = false;
    if (previousLog) {
      session.exercises.forEach((ex) => {
        const prevEntry = previousLog.entries.find((e) => e.sessionExerciseId === ex.id);
        (entries[ex.id] || []).forEach((s, i) => {
          if (s.weight === "" || s.reps === "") return;
          const prevSet = prevEntry?.sets?.[i];
          if (prevSet) {
            const curVol = parseFloat(s.weight) * parseInt(s.reps, 10);
            const prevVol = prevSet.weight * prevSet.reps;
            if (curVol > prevVol) celebrate = true;
          }
        });
      });
    }

    const groupTally = {};
    let numSets = 0;
    let numExercises = 0;
    logEntries.forEach((le) => {
      if (!le.sets.length) return;
      numExercises++;
      numSets += le.sets.length;
      const sessionEx = session.exercises.find((e) => e.id === le.sessionExerciseId);
      const g = sessionEx?.group || "?";
      groupTally[g] = (groupTally[g] || 0) + le.sets.length;
    });

    setSummaryStats({ elapsedSec, restSec: restAccumulated, numExercises, numSets, groupTally });
    setPending({ log: { id: uid("log"), sessionId: session.id, date: todayISO(), entries: logEntries }, celebrate });
    cancelRest();
    setPhase("summary");
  };

  if (session && phase === "summary" && summaryStats && pending) {
    return <SessionSummary lang={lang} L={L} stats={summaryStats} onDone={() => onSaved(pending.log, pending.celebrate)} />;
  }

  return (
    <div>
      {rest.running && phase === "active" && (
        <div style={{ position: "fixed", top: 68, right: 16, zIndex: 30, background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: 30, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
          <Timer size={14} color="var(--accent)" />
          <span style={{ ...displayFont, fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>{formatDuration(rest.remaining)}</span>
          <button onClick={cancelRest} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 0, display: "flex" }}>
            <Square size={12} fill="currentColor" />
          </button>
        </div>
      )}

      {!preselectedId && (
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
          {data.sessions.map((s) => (
            <button key={s.id} onClick={() => setSessionId(s.id)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid " + (s.id === sessionId ? "var(--accent)" : "var(--border)"), background: s.id === sessionId ? "var(--accent-soft)" : "var(--surface)", color: s.id === sessionId ? "var(--accent)" : "var(--text-dim)", cursor: "pointer" }}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      {session && phase === "overview" && (
        <>
          <div style={{ ...displayFont, fontSize: 22, fontWeight: 600, marginBottom: 2 }}>{session.name}</div>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>{previousLog ? L.log.beat(formatDateShort(previousLog.date, lang)) : L.log.firstTime}</div>

          <button
            onClick={() => (isSessionLockedToday(session) ? onPremium() : startSession())}
            style={{ width: "100%", marginBottom: 20, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {isSessionLockedToday(session) ? <Lock size={14} /> : <Play size={15} fill="#fff" />} {L.extra.startSession}
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {session.exercises.map((ex) => (
              <div key={ex.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{trExName(ex.exerciseId, lang)}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                  {trGroup(ex.group, lang)} · {L.extra.plannedSets(ex.targetSets)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {session && phase === "active" && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 2 }}>
            <div style={{ ...displayFont, fontSize: 22, fontWeight: 600 }}>{session.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-dim)", fontSize: 13, fontWeight: 600 }}>
              <Timer size={13} /> {formatDuration(elapsedSec)}
            </div>
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>{previousLog ? L.log.beat(formatDateShort(previousLog.date, lang)) : L.log.firstTime}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {session.exercises.map((ex) => (
              <div key={ex.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{trExName(ex.exerciseId, lang)}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(entries[ex.id] || []).map((set, idx) => (
                    <SetRow key={idx} index={idx} set={set} L={L} onChange={(field, value) => updateSet(ex.id, idx, field, value)} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                  <button onClick={() => addSet(ex.id)} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0 }}>
                    <Plus size={12} /> {L.log.addSet}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--surface2)", borderRadius: 8, padding: "3px 4px" }}>
                      <Stepper onClick={() => adjustRestDuration(ex.id, -15)} icon={Minus} />
                      <span style={{ fontSize: 12, fontWeight: 700, width: 34, textAlign: "center" }}>{formatDuration(restDurations[ex.id] ?? 90)}</span>
                      <Stepper onClick={() => adjustRestDuration(ex.id, 15)} icon={Plus} />
                    </div>
                    <button onClick={() => startRest(restDurations[ex.id] ?? 90)} style={{ background: "var(--accent-soft)", border: "none", borderRadius: 8, padding: "6px 9px", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "var(--accent)", cursor: "pointer" }}>
                      <Timer size={11} /> {L.extra.rest}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button disabled={!hasAnyInput} onClick={finish} style={{ width: "100%", marginTop: 22, background: hasAnyInput ? "var(--accent)" : "var(--surface2)", color: hasAnyInput ? "#fff" : "var(--text-dim)", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: hasAnyInput ? "pointer" : "not-allowed" }}>
            {L.log.finish}
          </button>
        </>
      )}
    </div>
  );
}

function SessionSummary({ lang, L, stats, onDone }) {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Check size={26} color="var(--accent)" />
        </div>
        <div style={{ ...displayFont, fontSize: 20, fontWeight: 700 }}>{L.extra.summaryTitle}</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <StatCard label={L.extra.totalTime} value={formatDuration(stats.elapsedSec)} />
        <StatCard label={L.extra.restTime} value={formatDuration(stats.restSec)} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <StatCard label={L.extra.exercisesDone} value={String(stats.numExercises)} />
        <StatCard label={L.extra.setsDone} value={String(stats.numSets)} />
      </div>

      <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.extra.setsByGroupTitle}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {Object.entries(stats.groupTally).map(([group, count]) => (
          <div key={group} style={{ display: "flex", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
            <span>{trGroup(group, lang)}</span>
            <span style={{ fontWeight: 700 }}>{count}</span>
          </div>
        ))}
      </div>

      <button onClick={onDone} style={{ width: "100%", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
        {L.extra.doneBtn}
      </button>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ ...displayFont, fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function SetRow({ index, set, onChange, L }) {
  const w = parseFloat(set.weight);
  const r = parseInt(set.reps, 10);
  const hasBoth = set.weight !== "" && set.reps !== "" && !isNaN(w) && !isNaN(r);
  const prevVolume = set.prevWeight != null && set.prevReps != null ? set.prevWeight * set.prevReps : null;
  const curVolume = hasBoth ? w * r : null;
  let delta = null;
  if (hasBoth && prevVolume != null) {
    if (curVolume > prevVolume) delta = "up";
    else if (curVolume < prevVolume) delta = "down";
    else delta = "same";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 12, color: "var(--text-dim)", width: 16 }}>{index + 1}</span>
      <NumberField placeholder={set.prevWeight != null ? String(set.prevWeight) : "kg"} value={set.weight} onChange={(v) => onChange("weight", v)} />
      <span style={{ color: "var(--text-dim)", fontSize: 13 }}>×</span>
      <NumberField placeholder={set.prevReps != null ? String(set.prevReps) : "reps"} value={set.reps} onChange={(v) => onChange("reps", v)} />
      <div style={{ width: 54, flexShrink: 0, textAlign: "right" }}>
        {delta === "up" && <span style={{ color: "var(--positive)", fontSize: 11, fontWeight: 700 }}>▲ {L.log.vol}</span>}
        {delta === "down" && <span style={{ color: "var(--text-dim)", fontSize: 11 }}>▼ {L.log.vol}</span>}
        {delta === "same" && <span style={{ color: "var(--text-dim)", fontSize: 11 }}>— {L.log.same}</span>}
      </div>
    </div>
  );
}

function NumberField({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)", fontSize: 15, fontWeight: 600, boxSizing: "border-box", ...displayFont }} />
    </div>
  );
}

/* ------------------------------- progress screen ---------------------------- */

function ProgressScreen({ data, lang, L }) {
  const sessionsWithExercises = data.sessions.filter((s) => s.exercises.length > 0);
  const [sessionId, setSessionId] = useState(sessionsWithExercises[0]?.id || null);
  useEffect(() => { if (!sessionId && sessionsWithExercises.length) setSessionId(sessionsWithExercises[0].id); }, [sessionsWithExercises.length]);

  if (!sessionsWithExercises.length) return <EmptyState title={L.progress.emptyTitle} body={L.progress.emptyBody} />;

  const session = sessionsWithExercises.find((s) => s.id === sessionId) || sessionsWithExercises[0];

  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.extra.chooseSession}</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {sessionsWithExercises.map((s) => (
          <button key={s.id} onClick={() => setSessionId(s.id)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid " + (s.id === session.id ? "var(--accent)" : "var(--border)"), background: s.id === session.id ? "var(--accent-soft)" : "var(--surface)", color: s.id === session.id ? "var(--accent)" : "var(--text-dim)", cursor: "pointer" }}>
            {s.name}
          </button>
        ))}
      </div>
      <SessionProgress key={session.id} session={session} data={data} lang={lang} L={L} />
    </div>
  );
}

function SessionProgress({ session, data, lang, L }) {
  const [sessionExerciseId, setSessionExerciseId] = useState(session.exercises[0]?.id || null);
  useEffect(() => { setSessionExerciseId(session.exercises[0]?.id || null); }, [session.id]);
  const sessionExercise = session.exercises.find((e) => e.id === sessionExerciseId) || session.exercises[0];

  const logsForSession = useMemo(() => data.logs.filter((l) => l.sessionId === session.id).sort((a, b) => (a.date > b.date ? 1 : -1)), [data.logs, session.id]);

  const maxSets = Math.max(
    sessionExercise?.targetSets || 1,
    ...logsForSession.map((l) => l.entries.find((e) => e.sessionExerciseId === sessionExercise?.id)?.sets.length || 0)
  );
  const [setIndex, setSetIndex] = useState(0);
  useEffect(() => { setSetIndex(0); }, [sessionExerciseId]);

  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.extra.chooseExercise}</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
        {session.exercises.map((e) => (
          <button key={e.id} onClick={() => setSessionExerciseId(e.id)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid " + (e.id === sessionExerciseId ? "var(--accent)" : "var(--border)"), background: e.id === sessionExerciseId ? "var(--accent-soft)" : "var(--surface)", color: e.id === sessionExerciseId ? "var(--accent)" : "var(--text-dim)", cursor: "pointer" }}>
            {trExName(e.exerciseId, lang)}
          </button>
        ))}
      </div>

      {sessionExercise && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {Array.from({ length: maxSets }, (_, i) => i).map((i) => (
              <button key={i} onClick={() => setSetIndex(i)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", background: setIndex === i ? "var(--surface2)" : "transparent", color: setIndex === i ? "var(--text)" : "var(--text-dim)", cursor: "pointer" }}>
                {L.extra.set(i + 1)}
              </button>
            ))}
          </div>
          <SetProgress sessionExerciseId={sessionExercise.id} setIndex={setIndex} logsForSession={logsForSession} lang={lang} L={L} />
        </>
      )}
    </div>
  );
}

function SetProgress({ sessionExerciseId, setIndex, logsForSession, lang, L }) {
  const points = logsForSession
    .map((log) => {
      const entry = log.entries.find((e) => e.sessionExerciseId === sessionExerciseId);
      const s = entry?.sets?.[setIndex];
      if (!s) return null;
      return { date: log.date, label: formatDateShort(log.date, lang), weight: s.weight, reps: s.reps, volume: s.weight * s.reps };
    })
    .filter(Boolean);

  if (!points.length) return <EmptyState title={L.progress.noneTitle} body={L.progress.noneBody} />;

  const last3 = points.slice(-3);
  let trendLabel = null;
  let trendColor = "var(--text-dim)";
  if (last3.length >= 2) {
    const netChange = last3[last3.length - 1].volume - last3[0].volume;
    if (netChange > 0) { trendLabel = L.extra.progressing; trendColor = "var(--positive)"; }
    else if (netChange < 0) { trendLabel = L.extra.regressing; trendColor = "var(--accent)"; }
    else { trendLabel = L.extra.stable; trendColor = "var(--text-dim)"; }
  }

  const first = points[0];
  const last = points[points.length - 1];
  const weightChange = points.length > 1 ? last.weight - first.weight : null;
  const repsChange = points.length > 1 ? last.reps - first.reps : null;

  return (
    <div>
      <MiniChart title={L.extra.weight} unit="kg" dataKey="weight" points={points} change={weightChange} L={L} />
      <div style={{ height: 14 }} />
      <MiniChart title={L.extra.reps} unit={L.progress.reps} dataKey="reps" points={points} change={repsChange} L={L} />

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.extra.trendTitle}</div>
        {last3.length < 2 ? (
          <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{L.extra.notEnough}</div>
        ) : (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: trendColor }}>{trendLabel}</span>
            <div style={{ display: "flex", gap: 6 }}>
              {last3.map((p, i) => {
                let dotColor = "var(--border)";
                if (i > 0) {
                  if (p.volume > last3[i - 1].volume) dotColor = "var(--positive)";
                  else if (p.volume < last3[i - 1].volume) dotColor = "var(--accent)";
                  else dotColor = "var(--text-dim)";
                }
                return <div key={p.date} title={p.label} style={{ width: 12, height: 12, borderRadius: 6, background: dotColor }} />;
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>{L.progress.history}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[...points].reverse().map((p) => (
            <div key={p.date} style={{ display: "flex", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
              <span style={{ color: "var(--text-dim)" }}>{p.label}</span>
              <span style={{ fontWeight: 600 }}>{p.weight}kg × {p.reps}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniChart({ title, unit, dataKey, points, change, L }) {
  const lastVal = points[points.length - 1][dataKey];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 8px 8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "0 8px 10px" }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{title}</span>
        <span style={{ ...displayFont, fontSize: 18, fontWeight: 700 }}>{lastVal} {unit}</span>
        {change != null && (
          <span style={{ fontSize: 12, fontWeight: 700, color: change > 0 ? "var(--positive)" : change < 0 ? "var(--accent)" : "var(--text-dim)" }}>
            {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {Math.abs(change)}
          </span>
        )}
      </div>
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 10 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-dim)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "var(--text)", fontWeight: 700 }} formatter={(value) => [value, title]} />
            <Line type="monotone" dataKey={dataKey} stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--accent)", strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
