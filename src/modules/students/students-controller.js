const asyncHandler = require("express-async-handler");
const {
  getAllStudents,
  addNewStudent,
  getStudentDetail,
  setStudentStatus,
  updateStudent,
} = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
  const payload = req.query; // filters (name, className, section, roll)
  const students = await getAllStudents(payload);
  res.status(200).json({ data: students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
  try {
    const payload = req.body;
    const result = await addNewStudent(payload);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});


const handleUpdateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body, id };
  const result = await updateStudent(payload);
  res.status(200).json(result);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await getStudentDetail(id);
  res.status(200).json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reviewerId } = req.body;
  const result = await setStudentStatus({ userId: id, reviewerId, status });
  res.status(200).json(result);
});

module.exports = {
  handleGetAllStudents,
  handleGetStudentDetail,
  handleAddStudent,
  handleStudentStatus,
  handleUpdateStudent,
};
