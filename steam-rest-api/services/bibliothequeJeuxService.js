const bibliothequeJeuxRepository = require('../repositories/bibliothequeJeuxRepository');

class BibliothequeJeuxService {
  async getBibliothequeJeuxByUtilisateurId(utilisateurId) {
    return await bibliothequeJeuxRepository.findBibliothequeJeuxByUtilisateurId(
      parseInt(utilisateurId)
    );
  }
  
  async updateBibliothequeJeuxByUtilisateurIdAndJeuxId(utilisateurId, jeuxId, params) {
    const bj = await bibliothequeJeuxRepository.findBibliothequeJeuxByUtilisateurIdAndJeuId(
      parseInt(utilisateurId),
      parseInt(jeuxId)
    );
    
    if (!bj) return null;
    
    bj.est_installe = params.estInstalle;
    return await bibliothequeJeuxRepository.save(bj);
  }
  
  async removeBibliothequeJeuxByUtilisateurIdAndJeuxId(utilisateurId, jeuxId) {
    const bj = await bibliothequeJeuxRepository.findBibliothequeJeuxByUtilisateurIdAndJeuId(
      parseInt(utilisateurId),
      parseInt(jeuxId)
    );
    
    if (!bj) return null;
    
    await bibliothequeJeuxRepository.delete(bj);
    return bj;
  }
  
  async addJeuToBibliotheque(utilisateurId, jeuId) {
    const existing = await bibliothequeJeuxRepository.findBibliothequeJeuxByUtilisateurIdAndJeuId(
      parseInt(utilisateurId),
      parseInt(jeuId)
    );
    
    if (existing) return null;
    
    const nouvelleBibliotheque = {
      utilisateur_id: parseInt(utilisateurId),
      jeu_id: parseInt(jeuId),
      heures_jeu: 0,
      est_installe: false
    };
    
    return await bibliothequeJeuxRepository.save(nouvelleBibliotheque);
  }
}

module.exports = new BibliothequeJeuxService()