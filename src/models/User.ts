import connection from "../core/connection";

//Types
import { User } from "./types/user";

export const createUser = async (user: User): Promise<boolean> => {
    try {
        await connection("student").insert(user);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};


export const getStudentId = async (
        id:string
):Promise<void>=>{
    await connection
    .select ({
      id:id,
    }).from(
        "student")

}


// get student age by ID
export const ageFromDateOfBirthday = (dateOfBirth: string): number => {
    const today = new Date();
    const newDateOfBirth = dateOfBirth.split("/");
    const day = Number(newDateOfBirth[0]);
    const month = Number(newDateOfBirth[1]);
    const year = Number(newDateOfBirth[2]);
    const birthDate = new Date(year, month, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
