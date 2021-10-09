import { Router } from "express";

//Endpoints
import {
    addStudentInClassApp,
    addTeacherInClassApp,
    changeModuleClass,
    createTeacherApp,
    createTurmaApp,
    createUserApp,
    getAllClassApp,
    removeStudentTheClass,
    showStudentsByClass,
    showTeachersByClass
} from "../app/app";

const router: Router = Router();

router.get("/class", getAllClassApp);
router.get("/students/class/:id", showStudentsByClass);
router.get("/teachers/class/:id", showTeachersByClass);

router.post("/students", createUserApp);
router.post("/students/addclass", addStudentInClassApp);

router.post("/teachers", createTeacherApp);
router.post("/teachers/addclass", addTeacherInClassApp);

router.post("/class", createTurmaApp);

router.put("/students/removeclass", removeStudentTheClass)
router.put("/class/module", changeModuleClass);

export default router;
