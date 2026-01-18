import { Request, Response } from "express";

export const getAdminDashboard = (req: Request, res: Response) => {
  res.send("Admin dashboard");
};
