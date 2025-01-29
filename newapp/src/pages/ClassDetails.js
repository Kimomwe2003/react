import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // Import SweetAlert2

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function SubjectDetails() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: "", school: "" });
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${baseUrl}subjects/`); // Adjust endpoint as necessary
                setSubjects(response.data);
            } catch (err) {
                setError("Error fetching subject details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (selectedSubject) {
                // Update existing subject
                await axios.put(`${baseUrl}subjects/${selectedSubject.id}/`, formData);
                setSubjects((prev) => prev.map((subject) => (subject.id === selectedSubject.id ? { ...subject, ...formData } : subject)));
                Swal.fire("Updated!", "Subject has been updated.", "success");
            } else {
                // Add new subject
                await axios.post(`${baseUrl}subjects/`, formData);
                setSubjects((prev) => [...prev, response.data]);
                Swal.fire("Success!", "Subject has been added.", "success");
            }
            setModalVisible(false);
            setFormData({ name: "", school: "" });
            setSelectedSubject(null);
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "There was an error saving the subject.", "error");
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
                await axios.delete(`${baseUrl}subjects/${id}/`);
                setSubjects((prev) => prev.filter((subject) => subject.id !== id));
                Swal.fire("Deleted!", "Subject has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "There was an error deleting the subject.", "error");
            }
        }
    };

    const openModal = (subject) => {
        setSelectedSubject(subject);
        setFormData(subject ? { ...subject } : { name: "", school: "" });
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
                    <h1 className="text-center mb-4">Subject Details</h1>
                    <button className="btn btn-success" onClick={() => openModal(null)}>
                        <i className="fas fa-plus"></i> Add Subject
                    </button>
                </div>
                <table className="table table-striped table-bordered">
                    <thead style={{ backgroundColor: '#003366', color: 'white' }}>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>School</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">No subjects found.</td>
                            </tr>
                        ) : (
                            subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>{subject.id}</td>
                                    <td>{subject.name}</td>
                                    <td>{subject.school}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => openModal(subject)}>
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

                {/* Modal for Adding/Updating Subject */}
                {modalVisible && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedSubject ? "Update Subject" : "Add Subject"}</h5>
                                    <button type="button" className="close" onClick={() => setModalVisible(false)}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleAddOrUpdate}>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>School</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="school"
                                                value={formData.school}
                                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            {selectedSubject ? "Update Subject" : "Add Subject"}
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

export default SubjectDetails;
