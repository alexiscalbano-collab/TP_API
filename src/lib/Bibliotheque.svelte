<script lang="ts">
    import { API_URL } from "../config";
    import type { BibliothequeJeux } from "../model/BibliothequeJeux";
    import type { Utilisateur } from "../model/Utilisateur";
    import type { Jeu } from "../model/Jeu";

    export const currentLocation: string = 'bibliotheque';
    let utilisateurs: Utilisateur[] = [];
    let utilisateurSelectionne: Utilisateur | null = null;

    let biblioUtilisateurSelectionne: BibliothequeJeux[] = [];
    let indexJeuSelectionne: number = 0;
    let jeuSelectionneBiblio: BibliothequeJeux | null = biblioUtilisateurSelectionne[indexJeuSelectionne] || null;
    let loadingBiblio = false;

    fetch(API_URL + '/utilisateurs')
        .then(response => response.json())
        .then(data => {
            utilisateurs = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    async function getJeuxFromId(id: number) {
        return await fetch(API_URL + '/jeux/' + id)
            .then(response => response.json())
            .then(data => {
                return data as Jeu;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function enrichirBiblioJeux(jeu: BibliothequeJeux): Promise<BibliothequeJeux> {
        return getJeuxFromId(jeu.jeu_id).then(jeuDetails => {
            return {
                ...jeu,
                jeu: jeuDetails
            } as BibliothequeJeux;
        });
    }
    
    function fetchUserData(user: Utilisateur) {
        loadingBiblio = true;
        fetch(API_URL + '/utilisateurs/' + user. utilisateur_id + '/bibliothequejeux')
            .then(response => response.json())
            .then(async (data) => {
                biblioUtilisateurSelectionne = await Promise.all(data.map(async (d: BibliothequeJeux) => {
                    return await enrichirBiblioJeux(d);
                }));
                indexJeuSelectionne = 0;
                jeuSelectionneBiblio = biblioUtilisateurSelectionne[indexJeuSelectionne] ?? null;
                utilisateurSelectionne = user;
                loadingBiblio = false;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function fetchGameDetails(jeu: BibliothequeJeux) {
        console.log("Jeu :", jeu)
        console.log("BiblioUtilSelect :", biblioUtilisateurSelectionne)
        indexJeuSelectionne = biblioUtilisateurSelectionne.findIndex((j) => j.bibliotheque_id === jeu.bibliotheque_id);
        jeuSelectionneBiblio = biblioUtilisateurSelectionne[indexJeuSelectionne] ?? null;
    }

    function replaceGameDetails(jeu: BibliothequeJeux) {
        const index = biblioUtilisateurSelectionne.findIndex((j) => j.bibliotheque_id === jeu.bibliotheque_id);
        if (index !== -1) {
            biblioUtilisateurSelectionne[index] = jeu;
            jeuSelectionneBiblio = jeu;
        }
    }

    function removeGameFromListAndPutDefault(jeuBiblio: BibliothequeJeux) {
        const index = biblioUtilisateurSelectionne.findIndex((j) => j.bibliotheque_id === jeuBiblio.bibliotheque_id);
        if (index !== -1) {
            biblioUtilisateurSelectionne.splice(index, 1);
            indexJeuSelectionne = Math.max(0, index - 1); // Ensure we don't go out of bounds
            jeuSelectionneBiblio = biblioUtilisateurSelectionne[indexJeuSelectionne] ?? null;
            biblioUtilisateurSelectionne = [...biblioUtilisateurSelectionne]; // Trigger reactivity
        }
    }

    function clearUserInfo() {
        utilisateurSelectionne = null;
        biblioUtilisateurSelectionne = [];
    }

    function sendUninstallRequest(jeuBiblio: BibliothequeJeux | null) {
        if(!utilisateurSelectionne || !jeuBiblio) return; 
        fetch(API_URL + '/utilisateurs/'+ utilisateurSelectionne. utilisateur_id + '/bibliothequejeux/' + jeuBiblio.jeu_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ est_installe: false })
        })
        .then(response => response.json())
        .then(async (data) => {
            replaceGameDetails(await enrichirBiblioJeux(data));
            // Refresh the game list or update the UI as needed
        })
        .catch(error => {
            console.error('Error uninstalling game:', error);
        });
    }

    function sendInstallRequest(jeuBiblio: BibliothequeJeux | null) {
        if(!utilisateurSelectionne || !jeuBiblio) return; 
        fetch(API_URL + '/utilisateurs/'+ utilisateurSelectionne. utilisateur_id + '/bibliothequejeux/' + jeuBiblio.jeu_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ est_installe: true })
        })
        .then(response => response.json())
        .then(async (data) => {
            replaceGameDetails(await enrichirBiblioJeux(data));
            // Refresh the game list or update the UI as needed
        })
        .catch(error => {
            console.error('Error installing game:', error);
        });

    }

    function sendDeleteFromLibraryRequest(jeuBiblio: BibliothequeJeux | null) {
        if(!utilisateurSelectionne || !jeuBiblio) return; 
        fetch(API_URL + '/utilisateurs/' + utilisateurSelectionne. utilisateur_id + '/bibliothequejeux/' + jeuBiblio.jeu_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
            removeGameFromListAndPutDefault(data);
            // Refresh the game list or update the UI as needed
        })
        .catch(error => {
            console.error('Error deleting game from library:', error);
        });

    }
</script>


<div class="page-title">Bienvenue dans la Biliothèque Steam</div>
{#if utilisateurSelectionne}
    {#if loadingBiblio}
        <div>Chargement de la bibliothèque...</div>
    {/if}
    <div class="actions actions-top">
        <h2>
            Biliothèque
            {#if ['a', 'e', 'i', 'o', 'u'].includes(utilisateurSelectionne.nom_utilisateur[0].toLowerCase())}
                d'{utilisateurSelectionne.nom_utilisateur}
            {:else}
                de {utilisateurSelectionne.nom_utilisateur}
            {/if}
        </h2>
        <button class="action-button" on:click={() => clearUserInfo()}>Retour</button>
    </div>
    <div class="bilio-main">
        <div class="jeux">
            {#each biblioUtilisateurSelectionne as jeu}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_missing_attribute -->
                <a class="jeu" on:click={() => fetchGameDetails(jeu)} class:active={jeuSelectionneBiblio?.bibliotheque_id === jeu.bibliotheque_id}>
                    <img src={jeu.jeu.image} alt={jeu.jeu.titre} />
                    <div class="infos">
                        <h3>{jeu.jeu.titre}</h3>
                    </div>
                </a>
            {/each}
        </div>
        <div class="jeu-details">
            {#if jeuSelectionneBiblio}
                <div class="left">
                    <img src={jeuSelectionneBiblio.jeu.image} alt={jeuSelectionneBiblio.jeu.titre} />
                </div>
                <div class="right">
                    <div class="infos">
                        <div class="top">
                            <h2>{jeuSelectionneBiblio.jeu.titre} </h2>
                            <span class="petit-text">Par <b>{jeuSelectionneBiblio.jeu.developpeur}</b></span><br>
                            <span class="petit-text">Date de sortie : <b>{jeuSelectionneBiblio.jeu.date_sortie}</b></span>
                            <h4>TEMPS D'UTILISATION : {jeuSelectionneBiblio.heures_jeu} heures</h4>
                        </div>
                        <div class="actions">
                            <!-- Button installer / désinstaller -->
                            {#if jeuSelectionneBiblio.est_installe}
                                <button class="action-button warning" on:click={() => { sendUninstallRequest(jeuSelectionneBiblio) }}>Désinstaller</button>
                            {:else}
                                <button class="action-button green" on:click={() => { sendInstallRequest(jeuSelectionneBiblio) }}>Installer</button>
                            {/if}
                            <button class="action-button red" on:click={() => { sendDeleteFromLibraryRequest(jeuSelectionneBiblio) }}>Supprimer de la bibliothèque</button>
                        </div>
                    </div>
                </div>
            {:else}
                <p class="top">Sélectionnez un jeu pour voir les détails.</p>
            {/if}
        </div>
    </div>
{:else}
<div class="utilisateurs">
    {#each utilisateurs as utilisateur}
        <div class="utilisateur">
            <div class="infos">
                <span class="nom-user">{utilisateur.nom_utilisateur}</span>
                <span class="petit-texte">(Rejoint le : {utilisateur.date_inscription.replace(' ', ' à ')})</span>
                <button class="utilisateur-button" on:click={() => fetchUserData(utilisateur)}>Accès bibliothèque</button>
            </div>
        </div>
    {/each}
</div>
{/if}


<style>

    .top {
        height: 100%;
        padding: 1rem;
    }

    .jeu-details {
        display: flex;
        margin-inline: 2rem;
        gap: 2rem;
        flex: 2;
        background-color: #282c34;
        border-radius: .75rem;
        overflow: hidden;
        height: fit-content;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
    }

    .bilio-main {
        display: flex;
    }

    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2rem;
        gap: 2rem;
        background-color: #282c34;
        border-radius: .75rem;
    }

    .actions-top {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.33);
    }

    .action-button {
        width: 15rem;
        margin-top: 0.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.33);
    }

    .action-button.red {
        background-color: #cc4d4d;
    }

    .action-button.red:hover {
        background-color: #b33c3c;
    }

    .action-button.warning {
        background-color: #a47738;
    }

    .action-button.warning:hover {
        background-color: #8f6a2f;
    }

    .action-button.green {
        background-color: #3a983a;
    }
    
    .action-button.green:hover {
        background-color: #2a7a2a;
    }

    .utilisateurs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 2rem;
        gap: 2rem;
    }

    .utilisateur {
        display: flex;
        border-radius: .75rem;
        width: 25%;
        background-color: #282c34;
        color: rgba(255, 255, 255, 0.87);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 1);
        padding: 1rem;
    }

    .nom-user {
        font-size: 1.5em;
        font-weight: bold;
    }

    .petit-texte {
        font-size: 0.8em;
        color: #aaa;
    }

    .utilisateur-button {
        width: 50%;
        margin-top: 0.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.33);
    }

    button {
        background-color: #515969;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #414b55;
    }

    .jeux {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin-left: 2rem;
        gap: 0.5rem;
        flex: 1;
    }
    /* CSS for the game cards */
    .jeu {
        display: flex;
        height: 5rem;
        border-radius: .75rem;
        overflow: hidden;
        text-align: center;
        background-color: #282c34;
        color: rgba(255, 255, 255, 0.87);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .jeu:hover {
        background-color: #414b55;
    }

    .jeu.active {
        background-color: #515969;
    }
    
    .jeu .infos {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        align-items: center;
    }

    .right .infos {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .infos .actions {
        margin: 1rem;
    }

    img {
        max-height: 20rem;
    }

</style>