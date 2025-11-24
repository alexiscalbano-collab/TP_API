<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import Magasin from './lib/Magasin.svelte';
  import Bibliotheque from './lib/Bibliotheque.svelte';
  import NotFound from './lib/NotFound.svelte';

  export let url = '';
</script>


<Router {url} >

  <nav>
    <span id="logo">Steam</span>
    <!-- Change style if page is current page -->
    <span class="link"><Link to="/">MAGASIN</Link></span>
    <span class="link"><Link to="/bibliotheque">BIBLIOTHÈQUE</Link></span>
  </nav>

  <main>
    <Route path="/" > <Magasin /> </Route>
    <Route path="/bibliotheque"> <Bibliotheque /> </Route>
    <Route path="*"> <NotFound /> </Route>
  </main>

</Router>


<style>
  #logo {
    font-size: 2em;
    font-weight: bold;
    color: #ffffff;
    margin-inline: 3rem;
  }

  nav {
    display: flex;
    align-items: center;
    background-color: #282c34;
    gap: 2rem;
    padding: 1rem;
  }

  .link {
    font-weight: 600;
  }

</style>
