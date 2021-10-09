import { date_fmt } from '../config/helpers';
import connection from "../core/connection";

//Types
import { Turma } from "./types/turma";


// get all classes
export const getAllClass = async (): Promise<Turma[] | boolean> => {
    try {
        const result = await connection("class");

        const resultModified = result.map((turma: Turma) => {
            return {
                id: turma.id,
                name: turma.name,
                module: turma.module,
                initialDate: date_fmt(turma.initial_date),
                finalDate: date_fmt(turma.final_date)
            };
        });

        return resultModified; 
    } catch (error) {
        console.log(error);
        return false;
    }
};

//get class by id
export const getTurmaById = async (id: number): Promise<any> => {
    try {
        const result = await connection.select("*").from("class").where({ id: id });

        if (result.length > 0) {
            return result[0];
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Create a new class
export const createTurma = async (turma: Turma): Promise<boolean> => {
    try {
        await connection("class").insert(turma);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
