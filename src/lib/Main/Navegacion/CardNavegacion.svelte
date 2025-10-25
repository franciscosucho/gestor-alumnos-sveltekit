<script lang="ts">
    export let link: string;
    export let icon: string;
    export let name: string;
</script>

<a href={link} class="nav-card">
    <i class="{icon} card-icon"></i>
    <span class="card-name">{name}</span>
</a>

<style>
    .nav-card {
        width: 250px;
        height: 160px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
    }
</style>
