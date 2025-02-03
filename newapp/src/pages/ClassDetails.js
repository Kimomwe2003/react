import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // Import SweetAlert2

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function ClassDetails() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: "", level: "" });
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get(`${baseUrl}grade/`); // Adjust endpoint as necessary
                setGrades(response.data);
            } catch (err) {
                setError("Error fetching class details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, []);

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (selectedGrade) {
                // Update existing class
                await axios.put(`${baseUrl}grade/${selectedGrade.id}/`, formData);
                setGrades((prev) => prev.map((grade) => (grade.id === selectedGrade.id ? { ...grade, ...formData } : grade)));
                Swal.fire("Updated!", "Class has been updated.", "success");
            } else {
                // Add new class
                const response = await axios.post(`${baseUrl}grade/`, formData);
                setGrades((prev) => [...prev, response.data]);
                Swal.fire("Success!", "Class has been added.", "success");
            }
            setModalVisible(false);
            setFormData({ name: "", level: "" });
            setSelectedGrade(null);
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "There was an error saving the class.", "error");
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
                await axios.delete(`${baseUrl}grade/${id}/`);
                setGrades((prev) => prev.filter((grade) => grade.id !== id));
                Swal.fire("Deleted!", "Class has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "There was an error deleting the class.", "error");
            }
        }
    };

    const openModal = (grade) => {
        setSelectedGrade(grade);
        setFormData(grade ? { ...grade } : { name: "", level: "" });
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
                    <h1 className="text-center mb-4">Class Details</h1>
                    <button className="btn btn-success" onClick={() => openModal(null)}>
                        <i className="fas fa-plus"></i> Add Class
                    </button>
                </div>
                <table className="table table-striped table-bordered">
                    <thead style={{ backgroundColor: '#003366', color: 'white' }}>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">No classes found.</td>
                            </tr>
                        ) : (
                            grades.map((grade) => (
                                <tr key={grade.id}>
                                    <td>{grade.id}</td>
                                    <td>{grade.name}</td>
                                    <td>{grade.level}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => openModal(grade)}>
                                            <i className="fas fa-edit"></i> Update
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(grade.id)}>
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Modal for Adding/Updating Class */}
                {modalVisible && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedGrade ? "Update Class" : "Add Class"}</h5>
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
                                            <label>Level</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="level"
                                                value={formData.level}
                                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            {selectedGrade ? "Update Class" : "Add Class"}
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

export default ClassDetails;
