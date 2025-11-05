import { fail, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad, Actions } from './$types';

/**
 * Carga inicial de alumnos desde Supabase
 */
export const load: PageServerLoad = async () => {
    // Consulta a la tabla 'alumno' y une con la tabla 'curso' (opcional)
    const { data: alumnos, error: fetchError } = await supabase
        .from('alumno')
        .select(`
			id,
			nombre,
			apellido,
			dni,
			email,
			domicilio,
			telefono_padre,
			nacimiento,
			id_curso (
                curso,
                turno  
            )
		`)
        .order('apellido', { ascending: true });
    if (fetchError) {
        console.error('Error al obtener alumnos:', fetchError.message);
        throw error(500, 'Error al obtener la lista de alumnos.');
    }


    const { data: cursos, error: cursoError } = await supabase
        .from('curso')
        .select(`id, curso, turno`);
    if (cursoError) {
        console.error('Error al obtener cursos:', cursoError.message);
        throw error(500, 'Error al obtener la lista de cursos.');
    }
    return { alumnos, cursos };
};


export const actions: Actions = {



    eliminar: async ({ request }) => {
        const form = await request.formData();
        const id = form.get('id') as string;

        const { error: deleteError } = await supabase.from('alumno').delete().eq('id', id);

        if (deleteError) {
            console.error('Error al eliminar alumno:', deleteError.message);
            return fail(500, { message: 'No se pudo eliminar el alumno.' });
        }

        return { success: true, message: 'Alumno eliminado correctamente.' };
    },

    /**
     * Acción para editar datos de un alumno existente
     */
    editar: async ({ request }) => {
        const form = await request.formData();
        const id = form.get('id') as string;

        const alumnoActualizado = {
            nombre: form.get('nombre') as string,
            apellido: form.get('apellido') as string,
            dni: Number(form.get('dni')),
            email: form.get('email') as string,
            domicilio: form.get('domicilio') as string,
            telefono_padre: Number(form.get('telefono_padre')),
            nacimiento: form.get('nacimiento') as string,
            id_curso: form.get('id_curso') as string
        };

        const { error: updateError } = await supabase.from('alumno').update(alumnoActualizado).eq('id', id);

        if (updateError) {
            console.error('Error al editar alumno:', updateError.message);
            return fail(500, { message: 'No se pudo actualizar el alumno.' });
        }

        return { success: true, message: 'Alumno actualizado correctamente.' };
    }
};
