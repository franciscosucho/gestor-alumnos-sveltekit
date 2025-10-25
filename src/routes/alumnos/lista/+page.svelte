<script lang="ts">
    let alumnos = [
        {
            id: 1,
            nombre: "Juan Pérez",
            curso: "2°A",
            dni: "42158963",
            promedio: 8.4,
        },
        {
            id: 2,
            nombre: "Lucía Gómez",
            curso: "3°B",
            dni: "41785624",
            promedio: 7.9,
        },
        {
            id: 3,
            nombre: "Martín Torres",
            curso: "1°C",
            dni: "43987512",
            promedio: 9.1,
        },
        {
            id: 4,
            nombre: "Carla López",
            curso: "2°A",
            dni: "42865321",
            promedio: 6.8,
        },
        {
            id: 5,
            nombre: "Pedro García",
            curso: "4°A",
            dni: "40125633",
            promedio: 7.3,
        },
        {
            id: 6,
            nombre: "Sofía Díaz",
            curso: "5°B",
            dni: "41234567",
            promedio: 8.9,
        },
        {
            id: 7,
            nombre: "Federico Ríos",
            curso: "3°A",
            dni: "42900122",
            promedio: 7.6,
        },
        {
            id: 8,
            nombre: "Ana Torres",
            curso: "1°B",
            dni: "43789412",
            promedio: 9.3,
        },
        {
            id: 9,
            nombre: "Nicolás Fernández",
            curso: "2°B",
            dni: "41874599",
            promedio: 6.5,
        },
        {
            id: 10,
            nombre: "Valentina Silva",
            curso: "4°C",
            dni: "42236514",
            promedio: 8.2,
        },
    ];

    let busqueda = "";
    let paginaActual = 1;
    const alumnosPorPagina = 5;

    // Filtrado
    $: alumnosFiltrados = alumnos.filter(
        (a) =>
            a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.curso.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.dni.includes(busqueda),
    );

    // Paginación
    $: totalPaginas = Math.ceil(alumnosFiltrados.length / alumnosPorPagina);
    $: alumnosPaginados = alumnosFiltrados.slice(
        (paginaActual - 1) * alumnosPorPagina,
        paginaActual * alumnosPorPagina,
    );

    function cambiarPagina(nuevaPagina: number) {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
        }
    }

    function eliminarAlumno(id: number) {
        alumnos = alumnos.filter((a) => a.id !== id);
    }
</script>

<div class="contenedor-lista">
    <h2>Lista de Alumnos</h2>

    <div class="buscador">
        <input
            type="text"
            placeholder="Buscar por nombre, curso o DNI..."
            bind:value={busqueda}
        />
    </div>

    <table class="tabla-alumnos">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Curso</th>
                <th>DNI</th>
                <th>Promedio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#if alumnosPaginados.length > 0}
                {#each alumnosPaginados as alumno}
                    <tr>
                        <td>{alumno.id}</td>
                        <td>{alumno.nombre}</td>
                        <td>{alumno.curso}</td>
                        <td>{alumno.dni}</td>
                        <td>{alumno.promedio}</td>
                        <td class="acciones">
                            <button class="editar">Editar</button>
                            <button
                                class="eliminar"
                                on:click={() => eliminarAlumno(alumno.id)}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td colspan="6" class="no-encontrado"
                        >No se encontraron alumnos.</td
                    >
                </tr>
            {/if}
        </tbody>
    </table>

    <div class="paginacion">
        <button
            on:click={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
        >
            Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button
            on:click={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
        >
            Siguiente
        </button>
    </div>
</div>

<style>
        * {
        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .contenedor-lista {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 90%;
        margin: 20px auto;
    }

    h2 {
        margin-bottom: 15px;
        color: #222;
        font-size: 1.5rem;
    }

    .buscador {
        margin-bottom: 15px;
    }

    .buscador input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    .tabla-alumnos {
        width: 100%;
        border-collapse: collapse;
    }

    .tabla-alumnos th,
    .tabla-alumnos td {
        padding: 10px 15px;
        text-align: left;
        border-bottom: 1px solid #eaeaea;
    }

    .tabla-alumnos th {
        background-color: #f5f6fa;
        color: #333;
        font-weight: 600;
    }

    .tabla-alumnos tr:hover {
        background-color: #f9f9f9;
    }

    .acciones button {
        margin-right: 5px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .editar {
        background-color: #007bff;
        color: white;
    }

    .eliminar {
        background-color: #dc3545;
        color: white;
    }

    .eliminar:hover {
        background-color: #c82333;
    }

    .editar:hover {
        background-color: #0056b3;
    }

    .no-encontrado {
        text-align: center;
        color: #999;
        padding: 20px;
    }

    .paginacion {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .paginacion button {
        padding: 8px 15px;
        border: none;
        background-color: #4caf50;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }

    .paginacion button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .paginacion span {
        color: #333;
        font-weight: 500;
    }
</style>
