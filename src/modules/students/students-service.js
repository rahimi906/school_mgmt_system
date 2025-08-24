const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const { processDBRequest } = require("../../../utils/process-db-request");

const {
  findAllStudents,
  findStudentDetail,
  findStudentToSetStatus,
  addOrUpdateStudent,
} = require("./students-repository");
const { findUserById } = require("../../shared/repository");

const checkStudentId = async (id) => {
  const isStudentFound = await findUserById(id);
  if (!isStudentFound) {
    throw new ApiError(404, "Student not found");
  }
};

const getAllStudents = async (payload) => {
  const students = await findAllStudents(payload);
  if (students.length <= 0) {
    throw new ApiError(404, "Students not found");
  }

  return students;
};

const getStudentDetail = async (id) => {
  await checkStudentId(id);

  const student = await findStudentDetail(id);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

// const addNewStudent = async (payload) => {
//   console.log("Payload in addNewStudent:", payload);
//   const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS =
//     "Student added and verification email sent successfully.";
//   const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL =
//     "Student added, but failed to send verification email.";
//   try {
//     const result = await addOrUpdateStudent(payload);
//     if (!result.status) {
//       throw new ApiError(500, result.message);
//     }

//     // try {
//     //   await sendAccountVerificationEmail({
//     //     userId: result.userId,
//     //     userEmail: payload.email,
//     //   });
//     //   return { message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
//     // } catch (error) {
//     //   return { message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
//     // }
//   } catch (error) {
//     throw new ApiError(500, "Unable to add student");
//   }
// };

const addNewStudent = async (payload) => {
  const { name, email, class_name, section, roll } = payload;

  const query = `
    INSERT INTO student_add_update (name, email, class_name, section, roll)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [name, email, class_name, section, roll];

  try {
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0]; // <-- only return inserted row
  } catch (err) {
    console.error("DB error (addOrUpdateStudent):", err.message);

    if (err.code === "23505") { // unique_violation
      const error = new Error("Email already exists");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    err.statusCode = err.statusCode || 500;
    throw err; // let controller handle
  }
};

const updateStudent = async (payload) => {
  const result = await addOrUpdateStudent(payload);
  if (!result.status) {
    throw new ApiError(500, result.message);
  }

  return { message: result.message };
};

const setStudentStatus = async ({ userId, reviewerId, status }) => {
  await checkStudentId(userId);

  const affectedRow = await findStudentToSetStatus({
    userId,
    reviewerId,
    status,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to disable student");
  }

  return { message: "Student status changed successfully" };
};

module.exports = {
  getAllStudents,
  getStudentDetail,
  addNewStudent,
  setStudentStatus,
  updateStudent,
};
