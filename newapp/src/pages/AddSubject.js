import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // Import SweetAlert2

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function AddSubject() {
    const [name, setName] = useState("");
    const [gradeOptions, setGradeOptions] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState("");

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get(`${baseUrl}/grade/`); // Adjust endpoint as necessary
                setGradeOptions(response.data); // Assuming response data is an array of grades
            } catch (err) {
                console.error(err);
                Swal.fire("Error!", "Failed to fetch grades.", "error");
            }
        };

        fetchGrades();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/subjects/`, {
                name,
                grade: selectedGrade,
            });

            // Notify the user of success
            Swal.fire("Success!", "Subject has been added.", "success");

            // Clear the form fields
            setName("");
            setSelectedGrade("");
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "There was an error adding the subject.", "error");
        }
    };

    return (
        <div className="content-wrapper">
            <div className="container mt-4">
                <h1 className="text-center">Add Subject</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Grade</label>
                        <select
                            className="form-control"
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            required
                        >
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade) => (
                                <option key={grade.id} value={grade.name}>
                                    {grade.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add Subject
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddSubject;