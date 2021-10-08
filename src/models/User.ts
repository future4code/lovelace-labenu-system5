import connection from "../core/connection";
import { Hobby } from "./types/hobby";

//Types
import { User } from "./types/user";

// Find hobbies
export const findHobbies = async (hobbies: string[]): Promise<any> => {
    try {
        const result = await connection.select("*").from("hobbies").whereIn("name", hobbies);

        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Create a Student
export const createUser = async (user: User): Promise<boolean> => {
    try {
        await connection("student").insert(user);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//Create Hobby
export const createHobby = async (hobby: Hobby): Promise<boolean> => {
    try {
        await connection("hobbies").insert(hobby);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const createStudentHobbies = async (studentId: number, hobbyId: number): Promise<boolean> => {
    try {
        await connection("student_hobby").insert({
            student_id: studentId,
            hobby_id: hobbyId
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
