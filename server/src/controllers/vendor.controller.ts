import { type Request, type Response } from "express";
import Vendor from "../models/vendor.model.js";

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching vendors" });
  }
};

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating vendor" });
  }
};
