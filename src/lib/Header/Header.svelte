<script>

    import Search from "./search.svelte";
    import Navbar from "./Navbar.svelte";
    import Logo from "./Logo.svelte";
</script>

<header>
    <Logo></Logo>
    <Search></Search>
    <Navbar></Navbar>
</header>

<style>
    header{
        width: 100vw;
        height: 8vh;
        background-color: #ffffff9f;
        border-bottom: 1px solid rgba(51, 51, 51, 0.397);
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

</style>