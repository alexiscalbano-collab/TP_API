// repositories/bibliothequeJeuxRepository.js
const pool = require('../config/database');

class BibliothequeJeuxRepository {

  // Récupère tous les jeux d'un utilisateur
  async findBibliothequeJeuxByUtilisateurId(utilisateurId) {
    const result = await pool.query(
      'SELECT * FROM Bibliotheque_Jeux WHERE Utilisateur_ID = $1',
      [utilisateurId]
    );
    return result.rows;
  }

  // Récupère un jeu spécifique d'un utilisateur
  async findBibliothequeJeuxByUtilisateurIdAndJeuId(utilisateurId, jeuId) {
    const result = await pool.query(
      'SELECT * FROM Bibliotheque_Jeux WHERE Utilisateur_ID = $1 AND Jeu_ID = $2',
      [utilisateurId, jeuId]
    );
    return result.rows[0];
  }

  // Sauvegarde ou met à jour un jeu dans la bibliothèque
  async save(bibliotheque) {
    if (bibliotheque.bibliotheque_id) {
      // Mise à jour si l'entrée existe déjà
      const result = await pool.query(
        `UPDATE Bibliotheque_Jeux 
         SET Heures_Jeu = $1, Est_Installe = $2 
         WHERE Bibliotheque_ID = $3 
         RETURNING *`,
        [bibliotheque.heures_jeu, bibliotheque.est_installe, bibliotheque.bibliotheque_id]
      );
      return result.rows[0];
    } else {
      // Insertion si c'est un nouvel ajout
      const result = await pool.query(
        `INSERT INTO Bibliotheque_Jeux (Utilisateur_ID, Jeu_ID, Heures_Jeu, Est_Installe) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [
          bibliotheque.utilisateur_id, 
          bibliotheque.jeu_id, 
          bibliotheque.heures_jeu || 0, 
          bibliotheque.est_installe || false
        ]
      );
      return result.rows[0];
    }
  }

  // Supprime un jeu de la bibliothèque
  async delete(bibliotheque) {
    const result = await pool.query(
      'DELETE FROM Bibliotheque_Jeux WHERE Bibliotheque_ID = $1 RETURNING *',
      [bibliotheque.bibliotheque_id]
    );
    return result.rowCount > 0;
  }

  // Ajoute un jeu à la bibliothèque (utilisé par AchatsService)
  async addJeuToBibliotheque(utilisateurId, jeuId) {
    // Vérifie si le jeu existe déjà
    const existing = await this.findBibliothequeJeuxByUtilisateurIdAndJeuId(utilisateurId, jeuId);
    if (existing) return existing; // le jeu est déjà dans la bibliothèque

    // Sinon, ajoute le jeu avec valeurs par défaut
    const bibliotheque = {
      utilisateur_id: utilisateurId,
      jeu_id: jeuId,
      heures_jeu: 0,
      est_installe: false
    };

    return await this.save(bibliotheque);
  }
}

module.exports = new BibliothequeJeuxRepository();
