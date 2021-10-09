import { Router } from "express";

//Endpoints
import {
    addStudentInClassApp,
    changeModuleClass,
    createTeacherApp,
    createTurmaApp,
    createUserApp,
    getAllClassApp,
    showStudentsByClass,
    showTeachersByClass
} from "../app/app";

const router: Router = Router();

router.get("/class", getAllClassApp);
router.get("/students/class/:id", showStudentsByClass);
router.get("/teachers/class/:id", showTeachersByClass);

router.post("/students", createUserApp);
router.post("/students/addclass", addStudentInClassApp);

router.post("/class", createTurmaApp);
router.post("/teachers", createTeacherApp);

router.put("/class/module", changeModuleClass);

export default router;
