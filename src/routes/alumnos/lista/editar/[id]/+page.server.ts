import type { PageServerLoad } from './$types';


export const load: PageServerLoad = ({ params }) => {
    const idAlumno = params.id;

    if (!idAlumno) {
    
        console.error("ID de alumno no encontrado en los parámetros.");
        return {
            alumno: null,
            error: true
        };
    }

  
    return {
   
        idAlumno: idAlumno, 
        alumno: null 
    };
};