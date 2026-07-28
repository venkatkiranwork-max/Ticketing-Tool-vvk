import { Router } from 'express';
import { listTeams, createTeam } from '../controllers/team.controller.js';

const router = Router();

router.get('/', listTeams);
router.post('/', createTeam);

export default router;
