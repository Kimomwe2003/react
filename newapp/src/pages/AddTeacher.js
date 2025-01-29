import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function AddTeacher() {
  const [grades, setGrades] = useState([]);
  const [teacherData, setTeacherData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    grade: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(`${baseUrl}grade/`);
        setGrades(response.data);
      } catch (err) {
        setError("Failed to load grades. Please try again later.");
        console.error(err);
      }
    };

    fetchGrades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure all fields are filled
    if (
      !teacherData.first_name ||
      !teacherData.last_name ||
      !teacherData.age ||
      !teacherData.gender ||
      !teacherData.grade
    ) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }
  
    // Get the grade name corresponding to the selected grade ID
    const selectedGrade = grades.find((grade) => grade.id === parseInt(teacherData.grade));
  
    // Prepare the payload with the grade name
    const payload = {
      ...teacherData,
      grade: selectedGrade ? selectedGrade.name : "",
    };
  
    console.log("Data being sent:", payload); // Log the payload for debugging
  
    try {
      setLoading(true);
      // eslint-disable-next-line no-unused-vars
      // const response = 
      await axios.post(`${baseUrl}teacher/`, payload);
      Swal.fire("Success", "Teacher added successfully.", "success");
  
      // Reset the form
      setTeacherData({
        first_name: "",
        last_name: "",
        age: "",
        gender: "",
        grade: "",
      });
    } catch (err) {
      console.error("Error adding teacher:", err);
      Swal.fire("Error", "Failed to add the teacher. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="content-wrapper">
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Teacher</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            value={teacherData.first_name}
            onChange={(e) =>
              setTeacherData({ ...teacherData, first_name: e.target.value })
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
            value={teacherData.last_name}
            onChange={(e) =>
              setTeacherData({ ...teacherData, last_name: e.target.value })
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
            value={teacherData.age}
            onChange={(e) =>
              setTeacherData({ ...teacherData, age: e.target.value })
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
            value={teacherData.gender}
            onChange={(e) =>
              setTeacherData({ ...teacherData, gender: e.target.value })
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
            value={teacherData.grade}
            onChange={(e) =>
              setTeacherData({ ...teacherData, grade: e.target.value })
            }
          >
            <option value="">Select Class</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Teacher"}
        </button>
      </form>
    </div>
    </div>
  );
}

export default AddTeacher;
