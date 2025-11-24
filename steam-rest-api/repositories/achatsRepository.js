const pool = require('../config/database');

class AchatsRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM Achats ORDER BY Date_Achat DESC'
    );
    return result.rows;
  }
  
  async findByUtilisateurId(utilisateurId) {
    const result = await pool.query(
      'SELECT * FROM Achats WHERE Utilisateur_ID = $1 ORDER BY Date_Achat DESC',
      [utilisateurId]
    );
    return result.rows;
  }
  
  async save(achat) {
    const result = await pool.query(
      `INSERT INTO Achats (Utilisateur_ID, Jeu_ID) 
       VALUES ($1, $2) 
       RETURNING *`,
      [achat.utilisateur_id, achat.jeu_id]
    );
    return result.rows[0];
  }
}

module.exports = new AchatsRepository();