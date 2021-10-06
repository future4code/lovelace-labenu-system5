import { Router } from "express";

//Endpoints
import { createTurmaApp, createUserApp } from '../App/App';

const router: Router = Router();

router.post("/user", createUserApp)
router.post("/class", createTurmaApp)


export default router;
