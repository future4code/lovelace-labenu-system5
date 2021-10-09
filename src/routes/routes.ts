import { Router } from "express";

//Endpoints
import { createTeacherApp, createTurmaApp, createUserApp, getAllClassApp, showStudentsByClass, showTeachersByClass } from '../app/app';

const router: Router = Router();

router.get("/class", getAllClassApp)
router.get("/students/class/:id", showStudentsByClass);
router.get("/teachers/class/:id", showTeachersByClass);

router.post("/students", createUserApp)
router.post("/class", createTurmaApp)
router.post("/teachers", createTeacherApp)


export default router;
