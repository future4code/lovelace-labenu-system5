import connection from "../Core/connection";

//Types
import { User } from "./Types/user";

export const createUser = async (user: User): Promise<boolean> => {
    try {
        await connection("student").insert(user);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
