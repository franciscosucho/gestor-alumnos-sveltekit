export interface Curso {
    id: number;
    nombre: string;
    turno: string;

}

export interface CursoData {    
    cursos: Curso[];
    curso_seleccionado?: Curso;
}