<script lang="ts">
    // Importa el store de 'page' para identificar la ruta actual y aplicar la clase 'active'
    import { page } from '$app/stores';

    const navItems = [
        { name: 'Lista de Alumnos', icon: 'fas fa-user-friends', link: '/alumnos/lista' },
        { name: 'Agregar Alumno', icon: 'fas fa-plus', link: '/alumnos/agregar' },
        { name: 'Gestión de Profesores', icon: 'fas fa-graduation-cap', link: '/profesores' },
        { name: 'Cursos y Materias', icon: 'fas fa-book-open', link: '/cursos' },
        { name: 'Control de Asistencia', icon: 'fas fa-calendar-alt', link: '/asistencia' },
        { name: 'Reportes de Desempeño', icon: 'fas fa-chart-bar', link: '/reportes' },
        { name: 'Historial Académico', icon: 'fas fa-history', link: '/historial' },
    ];
</script>

<nav class="sidebar-nav-container">
    <h2 class="nav-title">Navegación</h2>
    <ul class="nav-list">
        {#each navItems as item}
            <li class="nav-item">
                <a 
                    href={item.link} 
                    class:active={($page.url.pathname === item.link || ($page.url.pathname.startsWith(item.link + '/') && item.link !== '/'))}
                >
                    <i class="{item.icon}"></i>
                    <span>{item.name}</span>
                </a>
            </li>
        {/each}
    </ul>
</nav>

<style>
    :root {
        --nav-bg: #ffffff;
        --nav-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        --nav-radius: 12px;
        --nav-padding-x: 24px; /* Padding horizontal para el título */
        --item-padding-x: 24px; /* Padding horizontal para los items de la lista */
        --item-padding-y: 12px; /* Padding vertical para los items */
        --text-color: #333333;
        --text-color-secondary: #666666;
        --active-bg: #2e86de; 
        --active-text: #ffffff;
        --icon-color-default: #666666; /* Gris para iconos no activos */
        --font-family-sans: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .sidebar-nav-container {
        background-color: var(--nav-bg);
        border-radius: var(--nav-radius);
        box-shadow: var(--nav-shadow);
        padding: 24px 0; /* Padding superior e inferior, el horizontal se maneja en los elementos internos */
        width: 250px; 
        min-height: 100%;
        font-family: var(--font-family-sans);
    }

    .nav-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0 0 15px var(--nav-padding-x);
        padding: 0;
    }

    .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nav-item a {
        display: flex;
        align-items: center;
        padding: var(--item-padding-y) var(--item-padding-x);
        text-decoration: none;
        color: var(--text-color-secondary);
        font-size: 1rem;
        transition: background-color 0.2s, color 0.2s;
        gap: 15px; 
        font-weight: 500;
        border-radius: 0; 
    }

    .nav-item a.active {
        background-color: var(--active-bg);
        color: var(--active-text);
        font-weight: 600;
    }
    
    .nav-item a:not(.active):hover {
        background-color: #f0f4f8; /* Un gris muy sutil para el hover */
        color: var(--text-color);
    }

    .nav-item i {
        font-size: 1.1em;
        width: 20px;
        text-align: center;
        color: var(--icon-color-default); /* Color por defecto de los íconos */
    }
    
    .nav-item a.active i {
        color: var(--active-text);
    }
</style>