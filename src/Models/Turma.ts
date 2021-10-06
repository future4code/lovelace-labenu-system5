import connection from "../Core/connection";

//Types
import { Turma } from "./Types/turma";

//get class by id
export const getTurmaById = async (id: number): Promise<Turma | boolean> => {
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
