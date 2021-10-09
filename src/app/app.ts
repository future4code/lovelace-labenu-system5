import { Request, Response } from "express";

//types
import { Turma } from "../models/types/turma";
import { User } from "../models/types/user";
import { Teacher } from "../models/types/teacher";
import { Hobby } from "../models/types/hobby";

//Helpers
import { create_uuid, date_fmt_back, isEmpty } from "../config/helpers";

//Connections database
import { createTurma, getAllClass, getTurmaById, updateModule } from "../models/Turma";
import { createHobby, createStudentHobbies, createUser, findHobbies, getStudentsByClass } from "../models/User";
import { createTeacher, createTeacherSpecialty, findSpecially, getTeacherByClass } from "../models/Teacher";

/**
 * ####################
 * ###   Students   ###
 * ####################
 */

//Endpoint: Exibir estudantes de uma turma.
export const showStudentsByClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const turmaId = Number(req.params.id);

        if (!turmaId) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        if (isNaN(turmaId)) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        const result = await getStudentsByClass(turmaId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

// Endpoint: Criar Estudante
export const createUserApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, birthDate, classId, hobbies } = req.body;

        if (isEmpty(hobbies) || hobbies[0] === "") {
            res.statusCode = 406;
            throw new Error("Hobbies Inválidos! Informe no mínimo 1 hobby do estudante.");
        }

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

        let existingHobbies = await findHobbies(hobbies);

        for (let i = 0; i < hobbies.length; i++) {
            const contains = existingHobbies.some((j: any) => {
                return j.name === hobbies[i];
            });

            if (contains === false) {
                const newHobbyId = create_uuid();
                const newHobby: Hobby = {
                    id: newHobbyId,
                    name: hobbies[i]
                };

                const create = await createHobby(newHobby);

                if (create === false) {
                    res.statusCode = 400;
                    throw new Error("Não foi possível criar hobbies. Tente novamente mais tarde.");
                }
            }
        }

        existingHobbies = await findHobbies(hobbies);

        const result = await createUser(newUser);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível criar um novo estudante! Tente novamente mais tarde");
        } else {
            for (let i: number = 0; i < hobbies.length; i++) {
                const studentHobbies = await createStudentHobbies(newUser.id, existingHobbies[i].id);

                if (studentHobbies === false) {
                    res.statusCode = 400;
                    throw new Error("Não foi possível registrar os hobbies do estudante. Tente novamente mais tarde.");
                }
            }

            res.status(201).send({ message: `Estudante criado com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

/**
 * ###################
 * ###   Teacher   ###
 * ###################
 */

//Endpoint: Exibir docentes de uma turma;
export const showTeachersByClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const turmaId = Number(req.params.id);

        if (!turmaId) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        if (isNaN(turmaId)) {
            res.statusCode = 406;
            throw new Error("Não foi possível identificar turma.");
        }

        const result = await getTeacherByClass(turmaId);

        if (result === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

//Endpoint: Criar docente
export const createTeacherApp = async (req: Request, res: Response): Promise<void> => {
    try {
        let { name, email, birthDate, classId, specialtyName } = req.body;

        if (isEmpty(specialtyName)) {
            res.statusCode = 406;
            throw new Error("Informe no mínimo 1 especialidade do docente.");
        }

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

        const specialty = await findSpecially(specialtyName);

        if (typeof specialty === "string") {
            res.statusCode = 404;
            throw new Error(`Não foi possivel encontrar especialidade '${specialty}'. Verifique novamente.`);
        }

        const id: number = create_uuid();

        const newTeacher: Teacher = {
            id: id,
            name: name,
            email: email,
            birth_date: date_fmt_back(birthDate),
            class_id: classId
        };

        const result = await createTeacher(newTeacher);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível criar um novo docente! Tente novamente mais tarde");
        } else {
            for (let i: number = 0; i < specialtyName.length; i++) {
                const createSpeacialty = await createTeacherSpecialty(newTeacher.id, specialty[i].id);

                if (createSpeacialty === false) {
                    res.statusCode = 400;
                    throw new Error("Não foi possível registrar especialidade do docente. Tente novamente mais tarde.");
                }
            }

            res.status(201).send({ message: `Docente criado e alocado a turma ${turma.name} com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};

/**
 * #################
 * ###   Class   ###
 * #################
 */

//Endpoint: pegar todas as turmas
export const getAllClassApp = async (req: Request, res: Response): Promise<void> => {
    try {
        const allClasses = await getAllClass();

        if (allClasses === false) {
            res.statusCode = 404;
            throw new Error("Nenhuma turma encontrada!");
        } else {
            res.status(200).json(allClasses);
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
            res.statusCode = 400;
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

// Endpoint: Mudar modulo da turma
export const changeModuleClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.query.id);
        const module = Number(req.query.module);

        if (!id || !module) {
            res.statusCode = 406;
            throw new Error("Campos inválidos.");
        }

        if (isNaN(module) || isNaN(id)) {
            res.statusCode = 406;
            throw new Error("Campo 'id' ou 'module' inválidos.");
        }

        const checkClass = await getTurmaById(id);

        if (checkClass === false) {
            res.statusCode = 404;
            throw new Error("Turma não encontrada.");
        }

        const result = await updateModule(id, module);

        if (result === false) {
            res.statusCode = 400;
            throw new Error("Oops! Não foi possível o modulo dessa turma! Tente novamente mais tarde");
        } else {
            res.status(201).send({ message: `Módulo atualizado com sucesso!` });
        }
    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    }
};
