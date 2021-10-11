import { Router } from "express";

//Endpoints
import { createTeacherApp, createTurmaApp, createUserApp,getStudeAgeByIdApp} from '../app/app';

const router: Router = Router();

router.post("/user", createUserApp)
router.post("/class", createTurmaApp)
router.post("/teacher", createTeacherApp)
router.get("/user/:id", getStudeAgeByIdApp )


export default router;
