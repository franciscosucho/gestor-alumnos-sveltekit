<script lang="ts">
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';

    // --- Definición de Tipos ---
    interface GradeRecord {
        materia: string;
        profesor: string;
        nota1: number;
        nota2: number;
        estado: 'Aprobado' | 'Desaprobado';
        anio: number;
    }

    interface YearGroup {
        year: number;
        records: GradeRecord[];
    }

    // --- DATOS DEL ESTUDIANTE ---
    const studentInfo = {
        name: "Juan Pérez",
        studentId: "10293847"
    };

    const studentHistory: GradeRecord[] = [
        // Año 2025 (Más reciente)
        { materia: "Matemática Avanzada", profesor: "Prof. García", nota1: 8, nota2: 9, estado: "Aprobado", anio: 2025 },
        { materia: "Lengua y Literatura", profesor: "Prof. López", nota1: 7, nota2: 8, estado: "Aprobado", anio: 2025 },
        { materia: "Biología Celular", profesor: "Prof. Ruiz", nota1: 5, nota2: 6, estado: "Desaprobado", anio: 2025 },
        // Año 2024
        { materia: "Historia I", profesor: "Prof. Méndez", nota1: 9, nota2: 8, estado: "Aprobado", anio: 2024 },
        { materia: "Geografía General", profesor: "Prof. Castro", nota1: 6, nota2: 6, estado: "Aprobado", anio: 2024 },
        { materia: "Programación Intro", profesor: "Prof. Díaz", nota1: 10, nota2: 9, estado: "Aprobado", anio: 2024 },
        // Año 2023 (Más antiguo)
        { materia: "Física Básica", profesor: "Prof. Torres", nota1: 4, nota2: 5, estado: "Desaprobado", anio: 2023 },
        { materia: "Química Inorgánica", profesor: "Prof. Rojas", nota1: 10, nota2: 9, estado: "Aprobado", anio: 2023 },
        { materia: "Educación Física", profesor: "Prof. Vidal", nota1: 7, nota2: 7, estado: "Aprobado", anio: 2023 },
    ];
    // ----------------------------
    
    // Estado para almacenar el historial agrupado y expandido/colapsado
    let groupedHistory: YearGroup[] = [];
    let expandedYear: number | null = null; // Almacena el año actualmente expandido

    /**
     * Procesa la historia del estudiante, agrupando los registros por año
     * y ordenando los años de forma descendente (más reciente primero).
     */
    function processHistory(history: GradeRecord[]): YearGroup[] {
        const grouped: { [key: number]: GradeRecord[] } = history.reduce((acc, record) => {
            const year = record.anio;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(record);
            return acc;
        }, {} as { [key: number]: GradeRecord[] });

        return Object.keys(grouped)
            .map(year => ({
                year: parseInt(year),
                records: grouped[parseInt(year)]
            }))
            .sort((a, b) => b.year - a.year);
    }

    /**
     * Muestra/oculta el detalle de las materias para un año específico.
     */
    function toggleYear(year: number) {
        // Si el año actual expandido es el que se presionó, colapsarlo (null)
        // De lo contrario, expandir el nuevo año.
        expandedYear = expandedYear === year ? null : year;
    }

    // Ejecutar la lógica de procesamiento cuando el componente se monta
    onMount(() => {
        groupedHistory = processHistory(studentHistory);
        // Expandir el año más reciente por defecto
        if (groupedHistory.length > 0) {
            expandedYear = groupedHistory[0].year;
        }
    });

</script>

<div class="page-container">
    <!-- Contenedor Principal, similar a las secciones principales de la StudentApp -->
    <div class="content-card">

        <h1 class="page-title">
            Historial Académico
        </h1>
        
        <!-- Información del Estudiante: Bloque destacado en azul claro/gris -->
        <div class="student-info-block">
            <p class="info-item">Alumno: <span class="info-value">{studentInfo.name}</span></p>
            <p class="info-item">ID de Registro: <span class="info-value-secondary">{studentInfo.studentId}</span></p>
        </div>

        <!-- Historial por Año (Acordeón) -->
        <div class="history-accordion">
            {#each groupedHistory as group}
                <div class="year-group">
                    <!-- Encabezado del Año (Clickable) -->
                    <button 
                        class="year-header" 
                        on:click={() => toggleYear(group.year)}
                        aria-expanded={expandedYear === group.year}
                        aria-controls="collapse-year-{group.year}"
                    >
                        <span class="year-title">Año Académico: {group.year}</span>
                        <!-- Icono de Flecha (Gira usando CSS dinámico) -->
                        <svg 
                            class="toggle-icon" 
                            class:rotate-180={expandedYear === group.year}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>

                    <!-- Contenido Colapsable (Detalle de Materias) -->
                    {#if expandedYear === group.year}
                        <div 
                            id="collapse-year-{group.year}" 
                            class="year-content"
                            transition:slide
                        >
                            <table class="grades-table">
                                <thead class="grades-thead">
                                    <tr>
                                        <th class="table-th">Materia</th>
                                        <th class="table-th hidden-sm">Profesor</th>
                                        <th class="table-th">1° C.</th>
                                        <th class="table-th">2° C.</th>
                                        <th class="table-th">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each group.records as record}
                                        <tr class="table-row">
                                            <td class="table-td font-bold">{record.materia}</td>
                                            <td class="table-td text-gray-500 hidden-sm">{record.profesor}</td>
                                            <td class="table-td">{record.nota1}</td>
                                            <td class="table-td">{record.nota2}</td>
                                            <td class="table-td status-cell" class:status-approved={record.estado === 'Aprobado'} class:status-failed={record.estado === 'Desaprobado'}>
                                                {record.estado}
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="no-records-message">
                    <p>Cargando historial o no hay registros académicos disponibles.</p>
                </div>
            {/each}
        </div>

    </div>
</div>

<style>
    /* VARIABLES DE COLOR para correlatividad con StudentApp (azul, gris, blanco) */
    :root {
        --primary-color: #3f51b5; /* Azul Índigo */
        --secondary-color: #4CAF50; /* Verde, para Aprobado */
        --danger-color: #F44336; /* Rojo, para Desaprobado */
        --header-bg: #4092ff; /* Azul de cabecera de tabla */
        --text-color: #333;
        --light-bg: #f9f9f9;
        --border-color: #ddd;
    }

    /* Diseño General del Contenedor */
    .page-container {
        padding: 20px;
        min-height: 100vh;
        background-color: var(--light-bg); /* Fondo gris claro */
    }

    .content-card {
        max-width: 900px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 30px;
    }

    .page-title {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-color);
        border-bottom: 3px solid var(--primary-color);
        padding-bottom: 10px;
        margin-bottom: 25px;
    }

    /* Bloque de Información del Estudiante */
    .student-info-block {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #e8f0fe; /* Azul muy claro para destacar */
        border: 1px solid #c5d7f8;
        padding: 15px 20px;
        border-radius: 6px;
        margin-bottom: 30px;
        font-size: 16px;
    }

    .info-item {
        color: var(--text-color);
        font-weight: 500;
        margin: 5px 0;
    }

    .info-value {
        font-weight: 700;
        color: var(--primary-color);
    }

    .info-value-secondary {
        font-weight: 600;
        color: #666;
    }
    
    @media (min-width: 640px) {
        .student-info-block {
            flex-direction: row;
        }
    }

    /* Estilos del Acordeón (Agrupación por Año) */
    .year-group {
        border: 1px solid var(--border-color);
        border-radius: 6px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: box-shadow 0.3s ease;
    }

    .year-group:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .year-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 15px 20px;
        background-color: #f0f4ff; /* Fondo ligeramente azul */
        color: var(--primary-color);
        border: none;
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        text-align: left;
        transition: background-color 0.2s;
        border-bottom: 1px solid var(--border-color);
    }

    .year-header:hover {
        background-color: #e6ecff;
    }

    .toggle-icon {
        width: 24px;
        height: 24px;
        transition: transform 0.3s;
        color: var(--primary-color);
    }

    .rotate-180 {
        transform: rotate(180deg);
    }

    .year-content {
        padding: 0;
        background-color: #fff;
        border-top: 1px solid #eee;
    }

    /* Estilos de la Tabla de Calificaciones */
    .grades-table {
        width: 100%;
        border-collapse: collapse;
    }

    .grades-thead {
        background-color: var(--header-bg); /* Azul oscuro, similar a las cabeceras de tabla de la StudentApp */
    }

    .table-th {
        padding: 12px 15px;
        text-align: left;
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .table-row:nth-child(even) {
        background-color: #fcfcfc;
    }
    
    .table-row:hover {
        background-color: #f5f5f5;
    }

    .table-td {
        padding: 10px 15px;
        font-size: 14px;
        color: var(--text-color);
        border-bottom: 1px solid #f0f0f0;
    }

    /* Estilos de Estado */
    .status-cell {
        font-weight: 700;
        text-transform: uppercase;
    }

    .status-approved {
        color: var(--secondary-color); /* Verde */
    }

    .status-failed {
        color: var(--danger-color); /* Rojo */
    }

    /* Responsive */
    .hidden-sm {
        display: none;
    }

    @media (min-width: 768px) {
        .hidden-sm {
            display: table-cell;
        }
    }

    .no-records-message {
        text-align: center;
        padding: 40px;
        background-color: #fff;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: #777;
        font-size: 16px;
    }
</style>