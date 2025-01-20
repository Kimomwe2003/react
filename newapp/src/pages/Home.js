import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function Home() {
    const [data, setData] = useState({ teachers: 0, students: 0, classes: 0, subjects: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    teachersResponse,
                    studentsResponse,
                    classesResponse,
                    subjectsResponse
                ] = await Promise.all([
                    axios.get(`${baseUrl}/teacher/`),
                    axios.get(`${baseUrl}/students/`),
                    axios.get(`${baseUrl}/grade/`),
                    axios.get(`${baseUrl}/subjects/`)
                ]);

                setData({
                    teachers: teachersResponse.data.length || 0,
                    students: studentsResponse.data.length || 0,
                    classes: classesResponse.data.length || 0,
                    subjects: subjectsResponse.data.length || 0
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setData({ teachers: 0, students: 0, classes: 0, subjects: 0 });
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active">Dashboard v1</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-info">
                                    <div className="inner">
                                        <h3>{data.teachers}</h3>
                                        <p>Number of Teachers</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-user-tie" /> {/* Teacher icon */}
                                    </div>
                                    <Link to="/teachers" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-success">
                                    <div className="inner">
                                        <h3>{data.students}</h3>
                                        <p>Number of Students</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-graduation-cap" /> {/* Student icon */}
                                    </div>
                                    <Link to="/students" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-warning">
                                    <div className="inner">
                                        <h3>{data.classes}</h3>
                                        <p>Number of Classes</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-chalkboard-teacher" /> {/* Classroom icon */}
                                    </div>
                                    <Link to="/classes" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-danger">
                                    <div className="inner">
                                        <h3>{data.subjects}</h3>
                                        <p>Number of Subjects</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-book" /> {/* Book icon */}
                                    </div>
                                    <Link to="/subjects" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;