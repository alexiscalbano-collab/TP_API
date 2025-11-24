const pool = require('../config/database');

class JeuxRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM Jeux ORDER BY Jeu_ID'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM Jeux WHERE Jeu_ID = $1',
      [id]
    );
    return result.rows[0];
  }

  // NOUVELLE ROUTE: Trouver les jeux d'un utilisateur via sa bibliothèque
  async findByUtilisateurId(utilisateurId) {
    const result = await pool.query(
      `SELECT j.*, bj.Heures_Jeu, bj.Est_Installe, bj.Bibliotheque_ID
       FROM Jeux j
       INNER JOIN Bibliotheque_Jeux bj ON j.Jeu_ID = bj.Jeu_ID
       WHERE bj.Utilisateur_ID = $1
       ORDER BY j.Titre`,
      [utilisateurId]
    );
    return result.rows;
  }

  async save(jeu) {
    if (jeu.jeu_id) {
      const result = await pool.query(
        `UPDATE Jeux 
         SET Titre = $1, Developpeur = $2, Editeur = $3, 
             Date_Sortie = $4, Image = $5, Prix = $6 
         WHERE Jeu_ID = $7 
         RETURNING *`,
        [jeu.titre, jeu.developpeur, jeu.editeur, jeu.date_sortie, 
         jeu.image, jeu.prix, jeu.jeu_id]
      );
      return result.rows[0];
    } else {
      const result = await pool.query(
        `INSERT INTO Jeux (Titre, Developpeur, Editeur, Date_Sortie, Image, Prix) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [jeu.titre, jeu.developpeur, jeu.editeur, jeu.date_sortie, 
         jeu.image, jeu.prix]
      );
      return result.rows[0];
    }
  }

  async deleteById(id) {
    const result = await pool.query(
      'DELETE FROM Jeux WHERE Jeu_ID = $1 RETURNING *',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = new JeuxRepository();