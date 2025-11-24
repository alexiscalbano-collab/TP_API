const utilisateurRepository = require('../repositories/utilisateurRepository');

class UtilisateurService {
  async getAllUtilisateurs() {
    return await utilisateurRepository.findAll()
  }
  
  async getUtilisateur(id) {
    return await utilisateurRepository.findById(parseInt(id));
  }
  
  async createUtilisateur(utilisateur) {
    return await utilisateurRepository.save(utilisateur);
  }
  
  async updateUtilisateur(id, utilisateur) {
    utilisateur.utilisateur_id = parseInt(id);
    return await utilisateurRepository.save(utilisateur);
  }
  
  async deleteUtilisateur(id) {
    return await utilisateurRepository.deleteById(parseInt(id));
  }
}

module.exports = new UtilisateurService();