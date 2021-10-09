import { Router } from "express";

//Endpoints
import { createTeacherApp, createTurmaApp, createUserApp, showStudentsClass } from '../app/app';

const router: Router = Router();

router.get("/students/class/:id", showStudentsClass);

router.post("/students", createUserApp)
router.post("/class", createTurmaApp)
router.post("/teacher", createTeacherApp)


export default router;
