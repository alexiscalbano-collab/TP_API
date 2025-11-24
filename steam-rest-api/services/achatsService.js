// services/achatsService.js
const achatsRepository = require('../repositories/achatsRepository');
const bibliothequeJeuxRepository = require('../repositories/bibliothequeJeuxRepository'); // <-- Import manquant

class AchatsService {

    async getAllAchats() {
        return await achatsRepository.findAll();
    }

    async getAchatsByUtilisateur(utilisateurId) {
        return await achatsRepository.findByUtilisateurId(parseInt(utilisateurId));
    }

    async createAchat(achat) {
        // Sauvegarde de l'achat
        const newAchat = await achatsRepository.save(achat);

        // Ajout automatique du jeu à la bibliothèque
        await bibliothequeJeuxRepository.addJeuToBibliotheque(
            achat.utilisateur_id,
            achat.jeu_id
        );

        return newAchat;
    }
}

module.exports = new AchatsService();
