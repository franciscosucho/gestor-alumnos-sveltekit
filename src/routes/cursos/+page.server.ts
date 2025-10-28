import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { data: cursos, error: fetchError } = await supabase
        .from('curso')
        .select('*')
        .order('id', { ascending: true });

    if (fetchError) {
        console.error('Error al obtener cursos:', fetchError.message);
        throw error(500, 'Error al obtener los cursos.');
    }
    if (cursos) {
        return { cursos };
    }
    error(404, 'Not found');
};

export const actions = {
    agregarCurso: async ({ request }) => {
        const data = await request.formData();
        const nombre = data.get('nombre')?.toString().trim();
        const turno = data.get('turno')?.toString().trim();

        if (!nombre || !turno) {
            return fail(400, { error: 'Todos los campos son obligatorios.' });
        }

        const { error } = await supabase.from('curso').insert([{ nombre, turno }]);

        if (error) {
            console.error('Error al agregar curso:', error.message);
            return fail(500, { error: 'Error al guardar el curso en la base de datos.' });
        }

        console.log('Curso agregado correctamente:', nombre);
        return { success: true };
    }
};