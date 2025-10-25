<script lang="ts">
    let cursos = [
        { id: 1, nombre: "1° Año A", turno: "Mañana" },
        { id: 2, nombre: "2° Año B", turno: "Tarde" },
        { id: 3, nombre: "3° Año C", turno: "Mañana" },
    ];

    let materias:any = {
        1: [
            { id: 1, nombre: "Matemática", profesor: "Prof. García" },
            { id: 2, nombre: "Lengua", profesor: "Prof. López" },
        ],
        2: [
            { id: 3, nombre: "Física", profesor: "Prof. Pérez" },
            { id: 4, nombre: "Historia", profesor: "Prof. Díaz" },
        ],
        3: [{ id: 5, nombre: "Química", profesor: "Prof. Torres" }],
    };

    let cursoSeleccionado = cursos[0];
    let filtroCurso = "";
    let filtroMateria = "";

    function seleccionarCurso(curso:any) {
        cursoSeleccionado = curso;
    }

    function cursosFiltrados() {
        return cursos.filter((c) =>
            c.nombre.toLowerCase().includes(filtroCurso.toLowerCase()),
        );
    }

    function materiasFiltradas() {
        return materias[cursoSeleccionado.id].filter((m:any) =>
            m.nombre.toLowerCase().includes(filtroMateria.toLowerCase()),
        );
    }
</script>

<div class="contenedor">
    <!-- Panel lateral de cursos -->
    <aside class="panel-cursos">
        <h2>Cursos</h2>
        <input
            type="text"
            placeholder="Buscar curso..."
            bind:value={filtroCurso}
            class="input-buscar"
        />
        <button class="btn btn-azul">Agregar Curso</button>

        <ul class="lista-cursos">
            {#each cursosFiltrados() as curso}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <li
                    class:selected={curso.id === cursoSeleccionado.id}
                    on:click={() => seleccionarCurso(curso)}
                >
                    <div class="nombre-curso">{curso.nombre}</div>
                    <div class="turno">{curso.turno}</div>
                </li>
            {/each}
        </ul>
    </aside>

    <!-- Panel principal de materias -->
    <main class="panel-materias">
        <header class="encabezado">
            <h2>Materias de {cursoSeleccionado.nombre}</h2>
            <div class="acciones-header">
                <input
                    type="text"
                    placeholder="Buscar materia..."
                    bind:value={filtroMateria}
                    class="input-buscar"
                />
                <button class="btn btn-azul">Agregar Materia</button>
            </div>
        </header>

        <table class="tabla">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Materia</th>
                    <th>Profesor</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each materiasFiltradas() as materia, i}
                    <tr>
                        <td>{i + 1}</td>
                        <td>{materia.nombre}</td>
                        <td>{materia.profesor}</td>
                        <td class="acciones">
                            <button class="btn btn-amarillo">Editar</button>
                            <button class="btn btn-rojo">Eliminar</button>
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="4" class="sin-datos"
                            >No hay materias registradas.</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </main>
</div>

<style>
    .contenedor {
        display: flex;
        gap: 20px;
        padding: 20px;
        background-color: #f9fafb;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    .panel-cursos {
        width: 25%;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
    }

    .panel-cursos h2 {
        margin-bottom: 10px;
        font-size: 1.2rem;
        color: #1e293b;
    }

    .input-buscar {
        padding: 8px 10px;
        margin-bottom: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        width: 100%;
    }

    .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .btn-azul {
        background-color: #2563eb;
        color: white;
    }
    .btn-azul:hover {
        background-color: #1e40af;
    }

    .btn-amarillo {
        background-color: #facc15;
    }
    .btn-amarillo:hover {
        background-color: #eab308;
    }

    .btn-rojo {
        background-color: #ef4444;
        color: white;
    }
    .btn-rojo:hover {
        background-color: #b91c1c;
    }

    .lista-cursos {
        list-style: none;
        padding: 0;
        margin-top: 10px;
        flex-grow: 1;
        overflow-y: auto;
    }

    .lista-cursos li {
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 6px;
        border: 1px solid transparent;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .lista-cursos li:hover {
        background-color: #f3f4f6;
    }

    .lista-cursos li.selected {
        background-color: #2563eb;
        color: white;
        border-color: #1e3a8a;
    }

    .panel-materias {
        flex-grow: 1;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .tabla {
        width: 100%;
        border-collapse: collapse;
    }

    .tabla th,
    .tabla td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
    }

    .tabla th {
        background-color: #f3f4f6;
        font-weight: 600;
        color: #374151;
    }

    tr:hover {
        background-color: #f9fafb;
    }

    .acciones {
        display: flex;
        gap: 6px;
    }

    .sin-datos {
        text-align: center;
        color: #6b7280;
        padding: 20px 0;
    }
</style>
