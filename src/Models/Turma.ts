import connection from '../Core/connection'

//Types
import { Turma } from './Types/turma'

// Create a new class
export const createTurma = async (turma: Turma): Promise<boolean> => {
    try {
        await connection("class")
        .insert(turma)

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
