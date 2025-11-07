import { error } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

function isUUID(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params as { id: string };


	if (!id || id.endsWith(".css") || id.endsWith(".js") || id.endsWith(".map")) {
		throw error(404, "Recurso no válido o no encontrado.");
	}

	if (!isUUID(id)) {
		throw error(400, "El ID proporcionado no es un UUID válido.");
	}

	const { data: alumno, error: alumnoError } = await supabase
		.from("alumno")
		.select("id, nombre, apellido, dni, id_curso")
		.eq("id", id)
		.single();

	if (alumnoError) {
		console.error(" Error al obtener alumno:", alumnoError);
		throw error(500, "Error al obtener la información del alumno.");
	}

	if (!alumno) {
		throw error(404, "Alumno no encontrado.");
	}


	let cursoNombre = "Sin curso asignado";
	if (alumno.id_curso) {
		const { data: cursoData, error: cursoError } = await supabase
			.from("curso")
			.select("curso")
			.eq("id", alumno.id_curso)
			.single();

		if (cursoError) console.warn(" Error al obtener curso:", cursoError);
		else if (cursoData) cursoNombre = cursoData.curso;
	}


	const { data: historial, error: historialError } = await supabase
		.from("historial_alumno")
		.select("id, id_materia, profesor, año_de_cursada, nota_primer_cuatri,nota_segundo_cuatri,estado_materia")
		.eq("id_alumno", id);

	if (historialError) {
		console.error(" Error al obtener historial:", historialError);
		throw error(500, "Error al obtener el historial del alumno.");
	}

	const historialDetallado = await Promise.all(
		(historial ?? []).map(async (record:any) => {
			let materiaNombre = "Materia desconocida";
			let profesorNombre = "Profesor no asignado";


			if (record.id_materia) {
				const { data: materiaData } = await supabase
					.from("materias")
					.select("nombre")
					.eq("id", record.id_materia)
					.single();

				if (materiaData) materiaNombre = materiaData.nombre;
			}

			

			return {
				id: record.id,
				materia: materiaNombre,
				nota1: record.nota_primer_cuatri ?? "-",
				nota2: record.nota_segundo_cuatri ?? "-",
				estado: record.estado ?? "Desconocido",
				anio: record.año_cursada
					? new Date(record.año_cursada).getFullYear()
					: "Sin año"
			};
		})
	);

	console.log("Historial académico para:", alumno.nombre, historialDetallado.length, "materias");

	return {
		alumno: {
			id: alumno.id,
			nombre: alumno.nombre,
			apellido: alumno.apellido,
			dni: alumno.dni,
			curso: cursoNombre
		},
		historial: historialDetallado
	};
};
