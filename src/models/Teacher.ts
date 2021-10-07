import connection from "../core/connection";

import { Teacher } from "../models/types/teacher";

export const createTeacher = async (teacher: Teacher): Promise<boolean> => {
    try {
        await connection("teacher").insert(teacher);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
