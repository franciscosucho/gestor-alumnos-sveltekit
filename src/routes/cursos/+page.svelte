<script lang="ts">
    import { enhance } from "$app/forms";
    import type { Curso, CursoData } from "$lib/types/types";
    import { page } from "$app/stores";
    // Desestructurás los cursos
    let cursos: CursoData = $page.data.cursos;
    let materias: any = {
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

    //let cursoSeleccionado = cursos;
    let filtroCurso = "";
    let filtroMateria = "";

    // Estados para mostrar formularios
    let mostrarFormCurso = false;
    let mostrarFormMateria = false;

    // Datos nuevos
    let nuevoCurso = { nombre: "", turno: "" };
    let nuevaMateria = { nombre: "", profesor: "" };

    function seleccionarCurso(curso: Curso) {
        cursos.curso_seleccionado = curso;
    }

    function cursosFiltrados() {
        return cursos.filter((c: Curso) =>
            c.nombre.toLowerCase().includes(filtroCurso.toLowerCase()),
        );
    }

    function materiasFiltradas() {
        return materias[cursos.curso_seleccionado?.id].filter((m: any) =>
            m.nombre.toLowerCase().includes(filtroMateria.toLowerCase()),
        );
    }

    // function agregarMateria() {
    //     if (nuevaMateria.nombre && nuevaMateria.profesor) {
    //         materias[cursoSeleccionado.id].push({
    //             id: Math.random(),
    //             nombre: nuevaMateria.nombre,
    //             profesor: nuevaMateria.profesor,
    //         });
    //         nuevaMateria = { nombre: "", profesor: "" };
    //         mostrarFormMateria = false;
    //     }
    // }
</script>

<div class="contenedor">
    <!-- Panel lateral -->
    <aside class="panel-cursos">
        <h2>Cursos</h2>
        <input
            type="text"
            placeholder="Buscar curso..."
            bind:value={filtroCurso}
            class="input-buscar"
        />

        <button
            class="btn btn-azul"
            on:click={() => (mostrarFormCurso = !mostrarFormCurso)}
        >
            {mostrarFormCurso ? "Cancelar" : "Agregar Curso"}
        </button>

        {#if mostrarFormCurso}
            <div class="formulario fade-in">
                <form method="POST">
                    <div class="formulario fade-in">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre del curso"
                            bind:value={nuevoCurso.nombre}
                            required
                        />
                        <input
                            type="text"
                            name="turno"
                            placeholder="Turno"
                            bind:value={nuevoCurso.turno}
                            required
                        />
                        <button
                            class="btn btn-verde"
                            type="submit"
                            formaction="?/agregarCurso"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        {/if}

        <ul class="lista-cursos">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            {#each cursosFiltrados() as curso}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <li
                    class:selected={curso.id === curso.curso_seleccionado.id}
                    on:click={() => seleccionarCurso(curso)}
                >
                    <div>
                        <strong>{curso.nombre}</strong>
                        <p>{curso.turno}</p>
                    </div>
                </li>
            {/each}
        </ul>
    </aside>

    <!-- Panel principal -->
    <main class="panel-materias">
        <header class="encabezado">
            <h2>Materias de {cursos.curso_seleccionado?.nombre}</h2>
            <div class="acciones-header">
                <input
                    type="text"
                    placeholder="Buscar materia..."
                    bind:value={filtroMateria}
                    class="input-buscar"
                />
                <button
                    class="btn btn-azul"
                    on:click={() => (mostrarFormMateria = !mostrarFormMateria)}
                >
                    {mostrarFormMateria ? "Cancelar" : "Agregar Materia"}
                </button>
            </div>
        </header>

        {#if mostrarFormMateria}
            <div class="formulario fade-in">
                <input
                    type="text"
                    placeholder="Nombre de la materia"
                    bind:value={nuevaMateria.nombre}
                />
                <input
                    type="text"
                    placeholder="Profesor"
                    bind:value={nuevaMateria.profesor}
                />
                <button class="btn btn-verde"> Guardar </button>
            </div>
        {/if}

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
                        <td colspan="4" class="sin-datos">
                            No hay materias registradas.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </main>
</div>

<style>
    .contenedor {
        display: flex;
        gap: 24px;
        padding: 30px;
        background-color: #f8fafc;
        min-height: 100vh;
        font-family: "Inter", "Segoe UI", sans-serif;
    }

    /* PANEL DE CURSOS */
    .panel-cursos {
        width: 25%;
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
    }

    h2 {
        font-size: 1.25rem;
        color: #1e293b;
        font-weight: 600;
        margin-bottom: 12px;
    }

    .input-buscar {
        padding: 8px 10px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        width: 100%;
        margin-bottom: 10px;
        transition: border-color 0.2s;
    }

    .input-buscar:focus {
        border-color: #2563eb;
        outline: none;
    }

    .btn {
        padding: 8px 14px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .btn-azul {
        background-color: #2563eb;
        color: white;
    }
    .btn-azul:hover {
        background-color: #1e40af;
    }

    .btn-verde {
        background-color: #22c55e;
        color: white;
    }
    .btn-verde:hover {
        background-color: #16a34a;
    }

    .btn-amarillo {
        background-color: #facc15;
        color: #1f2937;
    }

    .btn-rojo {
        background-color: #ef4444;
        color: white;
    }

    .lista-cursos {
        list-style: none;
        padding: 0;
        margin-top: 10px;
        flex-grow: 1;
        overflow-y: auto;
    }

    .lista-cursos li {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 6px;
        cursor: pointer;
        background-color: #f9fafb;
        transition: all 0.2s;
    }

    .lista-cursos li:hover {
        background-color: #e0e7ff;
    }

    .lista-cursos li.selected {
        background-color: #2563eb;
        color: white;
    }

    .formulario {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
        background: #f1f5f9;
        padding: 12px;
        border-radius: 8px;
        animation: fadeIn 0.3s ease;
    }

    .formulario input {
        padding: 8px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
    }

    /* PANEL DE MATERIAS */
    .panel-materias {
        flex-grow: 1;
        background: #fff;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .acciones-header {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .tabla {
        width: 100%;
        border-collapse: collapse;
    }

    .tabla th,
    .tabla td {
        padding: 12px;
        border-bottom: 1px solid #e2e8f0;
        text-align: left;
    }

    .tabla th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #475569;
    }

    tr:hover td {
        background-color: #f1f5f9;
    }

    .acciones {
        display: flex;
        gap: 6px;
    }

    .sin-datos {
        text-align: center;
        color: #94a3b8;
        padding: 20px 0;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
