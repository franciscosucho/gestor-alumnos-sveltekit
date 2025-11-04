<script lang="ts">
	import { page } from "$app/stores";
	import { invalidate, goto } from "$app/navigation"; 

	
	interface Alumno {
		id: string; // Cambiado a string (UUID)
		nombre: string;
		apellido: string | null;
		dni: number;
		curso: { nombre: string } | null;
		
	}

	
	let data = $page.data as { alumnos: Alumno[] };
    $: alumnos = data.alumnos; 

	let busqueda = "";
	let paginaActual = 1;
	const alumnosPorPagina = 5;

	
	let errorMensaje: string | null = null;
	let mostrarConfirmacionId: string | null = null; 

	// --- Lógica de Edición (Redirección) ---
    function editarAlumno(id: string) {
        
        goto(`/alumnos/editar/${id}`);
    }

	// --- Lógica de Eliminación con Fetch (Corregida para el JSON de SvelteKit) ---
	async function eliminarAlumno(id: string) {
		// Cierra la confirmación de inmediato
		mostrarConfirmacionId = null;

		const formData = new FormData();
		formData.append("id", id);

        // Utilizamos el endpoint de acción '?/eliminar'
		const res = await fetch("?/eliminar", {
			method: "POST",
			body: formData,
		});

		// Intentamos parsear el JSON. Si falla o no hay cuerpo, usamos un objeto de error por defecto.
		const result = res.status !== 204
			? await res.json().catch(() => ({ status: res.status, type: 'error', message: 'Respuesta inválida del servidor.' }))
			: { status: 200, type: "success" };
            
		console.log("Respuesta de eliminación:", result);

		// *** CONDICIÓN CORREGIDA: Verificamos el estado HTTP o el tipo de éxito en el resultado JSON ***
		if (res.ok || result.type === "success") { 
			// 1. REACTIVIDAD INMEDIATA: Eliminamos el alumno de la lista local 'alumnos'.
            // Esto actualiza la tabla visible de inmediato gracias a la reactividad de Svelte.
			alumnos = alumnos.filter((a) => a.id !== id);

			// 2. SINCRONIZACIÓN DE DATOS: Forzamos la recarga de los datos del servidor (Load Function)
			// Esto asegura que si el servidor devuelve menos datos, SvelteKit sincronice 'alumnos' con la DB.
			await invalidate("alumnos");

			errorMensaje = null; // Limpiar cualquier error anterior
		} else {
			// Manejar errores de la acción o del servidor
			const msg =
				result.message ||
				"Ocurrió un error desconocido al eliminar el alumno.";
			console.error("Error al eliminar:", msg);
			errorMensaje = msg; // Mostrar error en la UI
		}
	}

	// --- Filtrado y Paginación (Sin cambios) ---
	$: alumnosFiltrados = alumnos.filter(
		(a) =>
			a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
			a.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
			a.dni.toString().includes(busqueda),
	);

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
</script>

<div class="contenedor-lista">
	<h2>Lista de Alumnos</h2>

	<!-- Mensaje de Error (Alternativa a alert()) -->
	{#if errorMensaje}
		<div class="mensaje-error">
			{errorMensaje}
			<button on:click={() => (errorMensaje = null)} class="cerrar-error"
				>✖</button
			>
		</div>
	{/if}

	<div class="buscador">
		<input
			type="text"
			placeholder="Buscar por nombre, apellido o DNI..."
			bind:value={busqueda}
		/>
	</div>

	<table class="tabla-alumnos">
		<thead>
			<tr>
				<th>ID</th>
				<th>Nombre</th>
				<th>Apellido</th>
				<th>DNI</th>
				<th>Curso</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#if alumnosPaginados.length > 0}
				{#each alumnosPaginados as alumno (alumno.id)}
					<tr>
						<td>{alumno.id}</td>
						<td>{alumno.nombre}</td>
						<td>{alumno.apellido}</td>
						<td>{alumno.dni}</td>
						<td>{alumno.curso?.nombre || "Sin curso"}</td>
						<td class="acciones">
							<button 
                                class="editar"
                                on:click={() => editarAlumno(alumno.id)} 
                            >
                                Editar
                            </button>
							<button
								class="eliminar"
								on:click={() =>
									(mostrarConfirmacionId = alumno.id)}
							>
								Eliminar
							</button>

							<!-- Modal de Confirmación en línea -->
							{#if mostrarConfirmacionId === alumno.id}
								<div class="confirmacion-popup">
									<p>
										¿Seguro que quieres eliminar a {alumno.nombre}?
									</p>
									<button
										class="confirmar-si"
										on:click={() =>
											eliminarAlumno(alumno.id)}
									>
										Sí
									</button>
									<button
										class="confirmar-no"
										on:click={() =>
											(mostrarConfirmacionId = null)}
									>
										No
									</button>
								</div>
							{/if}
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
    /* Estilos copiados del original */
	* {
		font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		box-sizing: border-box;
	}

	body {
		background-color: #f4f7f6;
		margin: 0;
		padding: 0;
	}

	.contenedor-lista {
		background: #fff;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		width: 95%;
		max-width: 1200px;
		margin: 30px auto;
	}

	h2,
	h3 {
		color: #2c3e50;
		margin-bottom: 20px;
		border-bottom: 2px solid #ecf0f1;
		padding-bottom: 10px;
		font-weight: 600;
	}

	.buscador {
		margin-bottom: 20px;
	}

	.buscador input {
		width: 100%;
		padding: 12px 15px;
		border: 1px solid #bdc3c7;
		border-radius: 8px;
		font-size: 1rem;
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}

	.buscador input:focus {
		border-color: #3498db;
		box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
		outline: none;
	}

	.tabla-alumnos {
		width: 100%;
		height: auto;
		border-collapse: separate;
		border-spacing: 0;
		margin-bottom: 15px;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
	}

	.tabla-alumnos th,
	.tabla-alumnos td {
		padding: 12px 15px;
		text-align: left;
		border: none;
		position: relative; /* Necesario para el popup de confirmación */
	}

	.tabla-alumnos th {
		background-color: #f0f4f7;
		color: #34495e;
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.9rem;
	}

	.tabla-alumnos tr {
		border-bottom: 1px solid #eee;
	}

	.tabla-alumnos tr:last-child {
		border-bottom: none;
	}

	.tabla-alumnos tr:nth-child(even) {
		background-color: #fcfcfc;
	}

	.tabla-alumnos tbody tr:hover {
		background-color: #e8f6f8;
		transition: background-color 0.2s;
	}

	.acciones {
		white-space: nowrap;
	}

	.acciones button {
		margin-right: 8px;
		padding: 8px 15px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 600;
		transition: all 0.2s ease-in-out;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.editar {
		background-color: #3498db;
		color: white;
	}

	.editar:hover {
		background-color: #2980b9;
		transform: translateY(-1px);
	}

	.eliminar {
		background-color: #e74c3c;
		color: white;
	}

	.eliminar:hover {
		background-color: #c0392b;
		transform: translateY(-1px);
	}

	.no-encontrado {
		text-align: center;
		color: #95a5a6;
		padding: 20px;
		font-style: italic;
	}

	.paginacion {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		padding: 10px 0;
		border-top: 1px solid #eee;
	}

	.paginacion button {
		padding: 10px 18px;
		border: none;
		background-color: #2ecc71;
		color: white;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.paginacion button:hover:not(:disabled) {
		background-color: #27ae60;
	}

	.paginacion button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
		box-shadow: none;
	}

	.paginacion span {
		color: #34495e;
		font-weight: 600;
	}

	/* --- Estilos para el Manejo de Errores y Confirmación --- */

	.mensaje-error {
		background-color: #f9dcdc;
		color: #c0392b;
		padding: 15px 20px;
		border: 1px solid #e74c3c;
		border-radius: 8px;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 500;
	}

	.cerrar-error {
		background: none;
		border: none;
		color: #c0392b;
		font-size: 1.2rem;
		cursor: pointer;
		line-height: 1;
		transition: transform 0.2s;
	}

	.cerrar-error:hover {
		transform: rotate(90deg);
	}

	/* Popup de Confirmación (Alternativa a Modal completo) */
	.confirmacion-popup {
		/* 2. Posicionamiento fijo para que no se mueva con el scroll, o absoluto para que quede en la celda */
		position: absolute;
		z-index: 10; /* Z-index menor que antes, 10 es suficiente para estar sobre la tabla */

		/* 3. Posicionamiento para centrarlo horizontalmente */
		top: 50%;
		left: 30%;
		transform: translate(
			-50%,
			-50%
		); /* Centra el elemento respecto a sí mismo */

		/* 4. Estilos visuales */
		background: #fff;
		border: 2px solid #e74c3c; /* Borde más visible */
		border-radius: 10px;
		padding: 20px; /* Más espacio interno */
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Sombra más fuerte */

		min-width: 280px;
		text-align: center;

		/* 5. Asegura que el popup no se salga del borde de la pantalla */
		max-width: 90vw;
	}

	.confirmacion-popup p {
		margin-bottom: 15px;
		color: #34495e;
		font-weight: 500;
	}

	.confirmacion-popup button {
		margin: 0 5px; /* Separación entre botones */
		/* Usamos los estilos existentes para los botones Eliminar (rojo) y Cancelar (gris) */
	}
	.confirmar-si {
		background-color: #e74c3c;
		color: white;
		border: 1px solid #e74c3c;
	}

	.confirmar-no {
		background-color: #bdc3c7;
		color: #333;
		border: 1px solid #bdc3c7;
	}

	.confirmar-si:hover {
		background-color: #c0392b;
	}

	.confirmar-no:hover {
		background-color: #95a5a6;
	}
</style>
