import Department from "../models/Department.js";

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required"
      });
    }

    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      name,
      description: description || ""
    });

    res.status(201).json({
      success: true,
      department
    });
  } catch (error) {
    next(error);
  }
};
