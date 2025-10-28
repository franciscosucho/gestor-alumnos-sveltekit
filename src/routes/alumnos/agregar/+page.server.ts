import { fail, redirect, type Actions } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
	default: async ({ request }) => {
		console.log("Procesando formulario de registro de alumno...");
		
		const data = await request.formData();

		const alumno = {
			nombres: data.get('nombres')?.toString().trim(),
			apellidos: data.get('apellidos')?.toString().trim(),
			domicilio: data.get('domicilio')?.toString().trim(),
			dni: parseInt(data.get('dni') as string),
			email: data.get('email')?.toString().trim(),
			telefono: data.get('telefono')?.toString().trim() || null,
			fechaNacimiento: data.get('fechaNacimiento')?.toString(),
			curso: data.get('curso')?.toString() // ahora es el ID del curso
		};


		// Validaciones
		if (!alumno.nombres || !alumno.apellidos || !alumno.dni || !alumno.email || !alumno.curso )  {
			return fail(400, { error: 'Todos los campos obligatorios deben estar completos.' });
		}

		console.log("Registrando alumno en la base de datos...");

		const { error } = await supabase.from('alumno').insert([
			{
				nombre: alumno.nombres,
				apellido: alumno.apellidos, 
				dni: alumno.dni,
				email: alumno.email,
				domicilio: alumno.domicilio,
				id_curso: alumno.curso, 
				telefono_padre: alumno.telefono ? Number(alumno.telefono) : null,
				nacimiento: alumno.fechaNacimiento
			}
		]);

		if (error) {
			console.error("Error al registrar alumno:", error.message);
			return fail(500, { error: 'Error al registrar el alumno en la base de datos.' });
		}

		console.log("Alumno registrado correctamente.");
		throw redirect(303, '/alumnos/lista');
	}
};




