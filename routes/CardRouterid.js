 import { getVotingByAsamblea } from "../controllers/VotosbyAsambleas.js";
import express from "express";

const router_5 = express.Router();

router_5.get('/:id', getVotingByAsamblea);

export default router_5 




