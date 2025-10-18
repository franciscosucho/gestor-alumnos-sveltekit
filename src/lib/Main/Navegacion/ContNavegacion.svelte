<script>
    import SidebarNav from "./sidebarNav.svelte";
</script>

<article class="contNavegacion">
    <SidebarNav></SidebarNav>
    <div class="cont_nav"></div>
</article>

<style>
    .contNavegacion {
        margin-top: 40px;
        width: 90%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .cont_nav{
        width: 70%;
        height:200px;
        border-radius: 12px;
        border: 1px solid gray;
    }
</style>
