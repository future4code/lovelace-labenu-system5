import { Request, Response } from "express";

//types
import { Turma } from "../Models/Types/turma";

//Helpers
import { create_uuid, date_fmt_back } from "../Config/Helpers";
import { createTurma } from "../Models/Turma";

// Endpoint: Criar Estudante
export const createUserApp = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Criar Turma
export const createTurmaApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, module, initialDate, finalDate } = req.body;

        if (isNaN(module)) {
            res.statusCode = 406;
            throw new Error("Campo 'module' inválido.");
        }

        if (!name || !initialDate || !finalDate) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        const id: number = create_uuid();

        const newTurma: Turma = {
            id: id,
            name: name,
            module: module,
            initial_date: date_fmt_back(initialDate),
            final_date: date_fmt_back(finalDate)
        };

        const result = await createTurma(newTurma);

        if (result === false) {
            res.statusCode = 409;
            throw new Error("Oops! Não foi possível criar uma nova turma! Tente novamete mais tarde");
        } else {
            res.status(201).send({ message: `A turma ${name} foi criada com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};
