<script lang="ts">
    //Importacion de componentes
    import Textprincipal from "$lib/Main/TextPrincipal.svelte";
    import ContCard from "$lib/Main/ContCard.svelte";
</script>

<main>
    <Textprincipal></Textprincipal>
    <ContCard></ContCard>
</main>

<style>
    body {
        overflow-x: hidden;
    }
    main {
        min-height: 100%;
        height: auto;
        overflow-x: hidden;
        width: 100vw;
        padding: 5%;
    }
</style>
