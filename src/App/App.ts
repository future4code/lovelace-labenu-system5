import { Request, Response } from "express";

//types
import { Turma } from "../Models/Types/turma";
import { User } from "../Models/Types/user";

//Helpers
import { create_uuid, date_fmt_back } from "../Config/Helpers";

//Connections database
import { createTurma, getTurmaById } from "../Models/Turma";
import { createUser } from "../Models/User";

// Endpoint: Criar Estudante
export const createUserApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, birthDate, classId } = req.body;

        if (isNaN(classId)) {
            res.statusCode = 406;
            throw new Error("Campo 'classId' inválido.");
        }

        if (!name || !email || !birthDate) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        const turma = await getTurmaById(classId);

        if (turma === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const id: number = create_uuid();

        const newUser: User = {
            id: id,
            name: name,
            email: email,
            birth_date: date_fmt_back(birthDate),
            class_id: classId
        };

        const result = await createUser(newUser);

        if (result === false) {
            res.statusCode = 409;
            throw new Error("Oops! Não foi possível criar um novo estudante! Tente novamente mais tarde");
        } else {
            res.status(201).send({ message: `Estudante criado com sucesso!` });
        }
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
            throw new Error("Oops! Não foi possível criar uma nova turma! Tente novamente mais tarde");
        } else {
            res.status(201).send({ message: `A turma ${name} foi criada com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};
