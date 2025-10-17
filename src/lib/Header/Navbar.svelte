<script>
    import ItemNavbar from "./itemNavbar.svelte";
    let icons = [
        {
            icon: "fa-regular fa-bell",
            function: "",
        },
        {
            icon: "fa-regular fa-gear",
            function: "",
        },
        {
            icon: "fa-regular fa-user",
            function: "",
        },
    ];
</script>

<div class="cont_items">
    {#each icons as icon}
        <ItemNavbar {...icon} />
    {/each}
</div>

<style>
    .cont_items {
        width: auto;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }
</style>
