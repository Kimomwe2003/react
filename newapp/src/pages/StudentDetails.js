import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // Import SweetAlert2

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function StudentDetails() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [grades, setGrades] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({ first_name: "", last_name: "", age: "", gender: "", grade: "" });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${baseUrl}/students/`);
                setStudents(response.data);
            } catch (err) {
                setError("Error fetching student details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchGrades = async () => {
            try {
                const response = await axios.get(`${baseUrl}/grade/`);
                setGrades(response.data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error!", "Failed to fetch grades.", "error");
            }
        };

        fetchStudents();
        fetchGrades();
    }, []);

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (selectedStudent) {
                // Update existing student
                await axios.put(`${baseUrl}/students/${selectedStudent.id}/`, formData);
                setStudents((prev) => prev.map((student) => (student.id === selectedStudent.id ? { ...student, ...formData } : student)));
                Swal.fire("Updated!", "Student details have been updated.", "success");
            } else {
                // Add new student
                const response = await axios.post(`${baseUrl}/students/`, formData);
                setStudents((prev) => [...prev, response.data]);
                Swal.fire("Success!", "Student has been added.", "success");
            }
            setModalVisible(false);
            setFormData({ first_name: "", last_name: "", age: "", gender: "", grade: "" });
            setSelectedStudent(null);
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "There was an error saving the student.", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${baseUrl}/students/${id}/`);
                setStudents((prev) => prev.filter((student) => student.id !== id));
                Swal.fire("Deleted!", "Student has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "There was an error deleting the student.", "error");
            }
        }
    };

    const openModal = (student) => {
        setSelectedStudent(student);
        setFormData(student ? { ...student } : { first_name: "", last_name: "", age: "", gender: "", grade: "" });
        setModalVisible(true);
    };

    if (loading) {
        return <div className="text-center"><h4>Loading...</h4></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="content-wrapper">
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="text-center mb-4">Student Details</h1>
                    <button className="btn btn-success" onClick={() => openModal(null)}>
                        <i className="fas fa-plus"></i> Add Student
                    </button>
                </div>
                <table className="table table-striped table-bordered">
                    <thead style={{ backgroundColor: '#003366', color: 'white' }}>
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
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">No students found.</td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.first_name}</td>
                                    <td>{student.last_name}</td>
                                    <td>{student.age}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.grade}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => openModal(student)}>
                                            <i className="fas fa-edit"></i> Update
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Modal for Adding/Updating Student */}
                {modalVisible && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedStudent ? "Update Student" : "Add Student"}</h5>
                                    <button type="button" className="close" onClick={() => setModalVisible(false)}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleAddOrUpdate}>
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Age</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="age"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select
                                                className="form-control"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Grade</label>
                                            <select
                                                className="form-control"
                                                name="grade"
                                                value={formData.grade}
                                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Grade</option>
                                                {grades.map((grade) => (
                                                    <option key={grade.id} value={grade.name}>
                                                        {grade.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            {selectedStudent ? "Update Student" : "Add Student"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentDetails;