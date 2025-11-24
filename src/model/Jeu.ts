export interface Jeu {
    jeu_id: number;
    titre: string;           // ← minuscule (backend retourne en minuscule)
    developpeur: string;     // ← minuscule
    editeur: string;         // ← minuscule
    date_sortie: string;    // ← minuscule (string, pas Date)
    image: string;           // ← minuscule
    prix: number;            // ← minuscule
}