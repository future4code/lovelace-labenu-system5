import { Router } from "express";

//Endpoints
import { createTeacherApp, createTurmaApp, createUserApp } from '../app/app';

const router: Router = Router();

router.post("/user", createUserApp)
router.post("/class", createTurmaApp)
router.post("/teacher", createTeacherApp)


export default router;
