<script>
    import Search from "./search.svelte";
    import Navbar from "./Navbar.svelte";
</script>

<div class="contIcon">
    <h3 class="iconApp">SA</h3>
    <h2 class="nameApp">StudentApp</h2>
</div>

<style>
    .contIcon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60%;
        gap: 10px;
        width: auto;
        font-family: Arial, Helvetica, sans-serif ;
    }
    .contIcon .iconApp {
        background-color: blue;
        color: white;
        padding: 15px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 1.5em;
    }
    .contIcon .nameApp{
        font-size: 2.2em;
        font-weight: 700;
        color: black;
    } 
</style>
