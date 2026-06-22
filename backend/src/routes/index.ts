import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statusRouter from "./status";
import appointmentsRouter from "./appointments";
import messagesRouter from "./messages";
import notificationsRouter from "./notifications";
import careTeamRouter from "./care-team";
import billingRouter from "./billing";
import healthReportsRouter from "./health-reports";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statusRouter);
router.use(appointmentsRouter);
router.use(messagesRouter);
router.use(notificationsRouter);
router.use(careTeamRouter);
router.use(billingRouter);
router.use(healthReportsRouter);
router.use(authRouter);

export default router;
