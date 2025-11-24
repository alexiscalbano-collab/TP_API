import type { Jeu } from "./Jeu";

export interface BibliothequeJeux {
    bibliotheque_id: number;
    utilisateur_id: number;
    jeu_id: number;          // ← jeu_id (pas jeux_id)
    jeu: Jeu;               // ← optionnel
    heures_jeu: number;
    est_installe: boolean;
}