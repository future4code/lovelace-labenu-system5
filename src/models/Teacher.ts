import connection from "../core/connection";

import { Teacher } from "../models/types/teacher";

//Find specialty
export const findSpecially = async (names: string[]): Promise<any> => {
    try {
        const result = await connection.select("*").from("specialty").whereIn("name", names);

        let notContains: string = "";

        for (let i = 0; i <= names.length; i++) {
            const contains = result.some((j: any) => {
                return j.name === names[i];
            });

            if (contains === false) {
                notContains = names[i];
                i = names.length;
            }
        }

        if (notContains) {
            return notContains;
        } else {
            return result;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Create A Teacher
export const createTeacher = async (teacher: Teacher): Promise<boolean> => {
    try {
        await connection("teacher").insert(teacher);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Create specialty teacher
export const createTeacherSpecialty = async (teacherId: number, specialtyId: number): Promise<boolean> => {
    try {
        await connection("teacher_specialty").insert({
            teacher_id: teacherId,
            specialty_id: specialtyId
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
