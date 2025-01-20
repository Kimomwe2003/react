import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure Font Awesome is imported
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function SubjectDetails() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${baseUrl}/subjects/`); // Adjust endpoint as necessary
                setSubjects(response.data); // Assuming response data is an array of subjects
            } catch (err) {
                setError("Error fetching subject details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const handleUpdate = (subject) => {
        setSelectedSubject(subject);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${baseUrl}/subjects/${id}/`); // Adjust endpoint as necessary
                setSubjects((prev) => prev.filter((subject) => subject.id !== id));
                Swal.fire("Deleted!", "Your subject has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "There was an error deleting the subject.", "error");
            }
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`${baseUrl}/subjects/${selectedSubject.id}/`, selectedSubject); // Adjust endpoint as necessary
            setSubjects((prev) => prev.map((subject) => (subject.id === selectedSubject.id ? selectedSubject : subject)));
            setModalVisible(false);
            Swal.fire("Updated!", "Your subject has been updated.", "success");
        } catch (err) {
            Swal.fire("Error!", "There was an error updating the subject.", "error");
        }
    };

    const handleChange = (e) => {
        setSelectedSubject({ ...selectedSubject, [e.target.name]: e.target.value });
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
                    <h1 className="text-center">Subject Details</h1>
                    <Link to="/add-subjects"><button className="btn btn-success" onClick={() => handleUpdate({ id: null, name: "", grade: "" })}>
                        <i className="fas fa-plus"></i> Add Subject
                    </button></Link>
                </div>
                <table className="table table-striped table-bordered">
                    <thead style={{ backgroundColor: "#003366", color: "white" }}>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No subjects found.
                                </td>
                            </tr>
                        ) : (
                            subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>{subject.id}</td>
                                    <td>{subject.name}</td>
                                    <td>{subject.grade}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdate(subject)}>
                                            <i className="fas fa-edit"></i> Update
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(subject.id)}>
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Modal for Updating Subject */}
                {modalVisible && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedSubject.id ? "Update Subject" : "Add Subject"}</h5>
                                    <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={selectedSubject.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Grade</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="grade"
                                            value={selectedSubject.grade}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubjectDetails;