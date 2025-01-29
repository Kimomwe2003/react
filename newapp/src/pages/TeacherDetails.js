import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function TeacherDetails() {
  const [teachers, setTeachers] = useState([]);
  const [grades, setGrades] = useState([]); // For storing grades
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState({
    id: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    grade: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherResponse = await axios.get(`${baseUrl}teacher/`);
        setTeachers(teacherResponse.data);

        const gradeResponse = await axios.get(`${baseUrl}grade/`); // Fetch grades
        setGrades(gradeResponse.data);
      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}teacher/${id}/`);
          setTeachers((prevTeachers) => prevTeachers.filter((t) => t.id !== id));
          Swal.fire("Deleted!", "The teacher has been deleted.", "success");
        } catch (err) {
          console.error("Error deleting teacher:", err);
          Swal.fire("Error", "Could not delete the teacher.", "error");
        }
      }
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${baseUrl}teacher/${selectedTeacher.id}/`, selectedTeacher);
      setTeachers((prevTeachers) =>
        prevTeachers.map((t) =>
          t.id === selectedTeacher.id ? { ...t, ...selectedTeacher } : t
        )
      );
      Swal.fire("Updated!", "Teacher details have been updated.", "success");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating teacher:", err);
      Swal.fire("Error", "Could not update teacher details.", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="content-wrapper">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Teacher Details</h1>
          <Link to="/add-teacher">
            <button className="btn btn-success">
              <i className="fas fa-user-plus"></i> Add Teacher
            </button>
          </Link>
        </div>
        <table className="table table-striped table-bordered">
          <thead style={{ backgroundColor: "#007bff", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.first_name}</td>
                  <td>{teacher.last_name}</td>
                  <td>{teacher.age}</td>
                  <td>{teacher.gender}</td>
                  <td>{teacher.grade}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setIsModalOpen(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Teacher</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      value={selectedTeacher.first_name}
                      onChange={(e) =>
                        setSelectedTeacher({ ...selectedTeacher, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      value={selectedTeacher.last_name}
                      onChange={(e) =>
                        setSelectedTeacher({ ...selectedTeacher, last_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      value={selectedTeacher.age}
                      onChange={(e) =>
                        setSelectedTeacher({ ...selectedTeacher, age: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      className="form-control"
                      id="gender"
                      value={selectedTeacher.gender}
                      onChange={(e) =>
                        setSelectedTeacher({ ...selectedTeacher, gender: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="grade" className="form-label">
                      Grade
                    </label>
                    <select
                      className="form-control"
                      id="grade"
                      value={selectedTeacher.grade}
                      onChange={(e) =>
                        setSelectedTeacher({ ...selectedTeacher, grade: e.target.value })
                      }
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDetails;
