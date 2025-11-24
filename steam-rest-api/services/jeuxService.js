const jeuxRepository = require('../repositories/jeuxRepository');

class JeuxService {
  async getAllJeux() {
    return await jeuxRepository.findAll();
  }
  
  async getJeux(id) {
    return await jeuxRepository.findById(parseInt(id));
  }
  
  async createJeu(jeu) {
    return await jeuxRepository.save(jeu);
  }
  
  async updateJeu(id, jeu) {
    jeu.jeux_id = parseInt(id);
    return await jeuxRepository.save(jeu);
  }
  
  async deleteJeu(id) {
    return await jeuxRepository.deleteById(parseInt(id));
  }
  // Dans jeuxService.js, ajoute :
async getJeuxByUtilisateur(utilisateurId) {
  return await jeuxRepository.findByUtilisateurId(parseInt(utilisateurId));
}
}

module.exports = new JeuxService();