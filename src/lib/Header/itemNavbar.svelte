<script>
    export let icon;
</script>

<div class="cont_item">
    <i class="{icon} icon" on:click></i>
</div>

<style>
    .cont_item {
        width: 30px;
        height: 30px;
    }
    .cont_item .icon {
        padding: 20px;
        border-radius: 10px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        font-size: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        transition: all .2s ease-in-out;
    }
    .cont_item .icon:hover {
        background-color: rgba(153, 197, 247, 0.452);
    }
</style>
