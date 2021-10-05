import { Router } from "express";

//Endpoints
import { createTurmaApp, createUserApp } from '../App/app';

const router: Router = Router();

router.post("/user", createUserApp)
router.post("/class", createTurmaApp)


export default router;
