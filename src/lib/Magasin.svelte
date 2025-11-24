<script lang="ts">
    import { API_URL } from "../config";
    import type { Jeu } from "../model/Jeu";
    import type { Utilisateur } from "../model/Utilisateur";

    export const currentLocation: string = 'magasin';

    let jeux: Jeu[] = [];
    let utilisateurs: Utilisateur[] = [];
    let utilisateurSelectionne: Utilisateur | null = null;

    fetch(API_URL + '/jeux')
        .then(response => response.json())
        .then(data => {
            jeux = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    fetch(API_URL + '/utilisateurs')
        .then(response => response.json())
        .then(data => {
            utilisateurs = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function ajouterJeu(jeu: Jeu) {
        if (utilisateurSelectionne && jeu) {
            fetch(API_URL + '/achats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jeu_id: jeu.jeu_id, utilisateur_id: utilisateurSelectionne.utilisateur_id })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Jeu ajouté à la bibliothèque:', data);
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert(`Jeu ${jeu?.titre} ajouté à la bibliothèque de ${utilisateurSelectionne?.nom_utilisateur}`);
                    }
                })
                .catch(error => {
                    console.log(utilisateurSelectionne)
                    console.error('Error adding game:', error);
                });
        } else {
            alert('Utilisateur ou jeu non sélectionné');
        }
    }
</script>

<div class="page-title">Bienvenue dans le magasin Steam</div>
<div class="actions">
    <div>Acheter les jeux pour :</div>
    <select bind:value={utilisateurSelectionne}>
        {#each utilisateurs as user}
            <option value={user}>{user.nom_utilisateur}</option>
        {/each}
    </select>
</div>
<div class="jeux">
    {#each jeux as jeu}
        <div class="jeu">
            <img src={jeu.image} alt={jeu.titre} />
            <div class="infos">
                <div class="top">
                    <h4>{jeu.titre}</h4>
                    <h2>{jeu.prix} €</h2>
                </div>
                <button on:click={() => ajouterJeu(jeu)}>Acheter</button>
            </div>
        </div>
    {/each}
</div>

<style>

    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-block: 2rem;
        margin-inline: 2rem;
        gap: 1rem;
        background-color: #282c34;
        border-radius: .75rem;
    }
    .jeux {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 2rem;
        gap: 2rem;
    }
    /* CSS for the game cards */
    .jeu {
        display: flex;
        border-radius: .75rem;
        text-align: center;
        width: 25%;
        background-color: #282c34;
        color: rgba(255, 255, 255, 0.87);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 1);
    }
    
    .infos {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
    }

    .jeu img {
        width: 75%;
        height: auto;
        border-radius: 5px;
    }

    .top {
        height: 100%;
        padding: 1rem;
    }

    button {
        background-color: #515969;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        width: 75%;
        margin-bottom: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.33);
    }
    

</style>