const pool = require('../config/database');

class UtilisateurRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM Utilisateurs'
    );
    return result.rows;
  }
  
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM Utilisateurs WHERE Utilisateur_ID = $1',
      [id]
    );
    return result.rows[0];
  }
  
  async save(utilisateur) {
    if (utilisateur.utilisateur_id) {
      const result = await pool.query(
        `UPDATE Utilisateurs 
         SET Nom_Utilisateur = $1, Email = $2 
         WHERE Utilisateur_ID = $3 
         RETURNING *`,
        [utilisateur.nom_utilisateur, utilisateur.email, utilisateur.utilisateur_id]
      );
      return result.rows[0];
    } else {
      const result = await pool.query(
        `INSERT INTO Utilisateurs (Nom_Utilisateur, Email) 
         VALUES ($1, $2) 
         RETURNING *`,
        [utilisateur.nom_utilisateur, utilisateur.email]
      );
      return result.rows[0];
    }
  }
  
  async deleteById(id) {
    const result = await pool.query(
      'DELETE FROM Utilisateurs WHERE Utilisateur_ID = $1 RETURNING *',
      [id]
    );
    return result.rowCount > 0;
  }
}
module.exports = new UtilisateurRepository();