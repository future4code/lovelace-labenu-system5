import { Request, Response } from "express";
import connection from "../core/connection";


//types
import { Turma } from "../models/types/turma";
import { User } from "../models/types/user";
import { Teacher } from "../models/types/teacher";

//Helpers
import { create_uuid, date_fmt_back } from "../config/helpers";

//Connections database
import { createTurma, getTurmaById } from "../models/Turma";
import { createUser, ageFromDateOfBirthday,getStudentId } from "../models/User";
import { createTeacher, createTeacherSpecialty, findSpecially } from "../models/Teacher";

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
            res.statusCode = 400;
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

//Endpoint: Criar docente
export const createTeacherApp = async (req: Request, res: Response): Promise<void> => {
    try {
        let { name, email, birthDate, classId, specialtyName } = req.body;

        if (specialtyName.length === 0) {
            res.statusCode = 406;
            throw new Error("Informe a especialidade do docente.");
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


//Endpoint get studentAge By ID 

export const getStudeAgeByIdApp = async (res: Response, req: Request): Promise<void> => {


    try {
        const id = req.params.id

        const studentId:any = await getStudentId(id)

        const birth_date: string|any = connection.raw(`SELECT birth_date FROM students WHERE id = "${id}"`)

        if(studentId){
            res.status(200).send(ageFromDateOfBirthday(birth_date))
        }  else if(!studentId){
            throw new Error("Id not found or incorrect"); 
        }

    } catch (e) {
        const error = e as Error;
        console.log(error);
        res.send({ message: error.message });
    };

};







