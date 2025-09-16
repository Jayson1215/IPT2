import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

function ProfileManager() {
    const [profiles, setProfiles] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", bio: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => fetchProfiles(), []);

    const fetchProfiles = () => {
        axios.get("/profiles")
            .then(res => setProfiles(res.data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            axios.put(`/profiles/${editingId}`, form)
                .then(res => {
                    setProfiles(profiles.map(p => p.id === editingId ? res.data : p));
                    resetForm();
                })
                .catch(err => handleError(err));
        } else {
            axios.post("/profiles", form)
                .then(res => {
                    setProfiles([...profiles, res.data]);
                    resetForm();
                })
                .catch(err => handleError(err));
        }
    };

    const handleEdit = (profile) => {
        setEditingId(profile.id);
        setForm({ name: profile.name, email: profile.email, bio: profile.bio || "" });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this profile?")) return;
        axios.delete(`/profiles/${id}`)
            .then(() => setProfiles(profiles.filter(p => p.id !== id)))
            .catch(err => console.error(err));
    };

    const handleError = (err) => {
        if (err.response && err.response.data.errors) {
            alert(Object.values(err.response.data.errors).flat().join("\n"));
        } else console.error(err);
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({ name: "", email: "", bio: "" });
    };

    return (
        <div className="container my-5">
            {/* Header */}
            <h2 className="mb-5 text-center text-white py-3 rounded-4" 
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                Profile Manager
            </h2>

            <div className="row g-4">

                {/* Form */}
                <div className="col-lg-5">
                    <div className="card shadow-lg p-5 rounded-4 border-0" style={{ backgroundColor: "#f8f9fa" }}>
                        <h5 className="mb-4 text-primary fw-bold">{editingId ? "Edit Profile" : "Add New Profile"}</h5>
                        <form onSubmit={handleSubmit}>

                            {/* Name */}
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="form-control form-control-lg rounded-pill border-primary shadow-sm"
                                    placeholder="Name"
                                    required
                                    style={{ transition: "0.3s" }}
                                />
                                <label htmlFor="name">Name</label>
                            </div>

                            {/* Email */}
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="form-control form-control-lg rounded-pill border-primary shadow-sm"
                                    placeholder="Email"
                                    required
                                    style={{ transition: "0.3s" }}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            {/* Bio */}
                            <div className="form-floating mb-4">
                                <textarea
                                    name="bio"
                                    id="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    className="form-control rounded-3 border-primary shadow-sm"
                                    placeholder="Bio"
                                    rows={4}
                                    style={{ minHeight: "100px", transition: "0.3s" }}
                                />
                                <label htmlFor="bio">Bio</label>
                            </div>

                            {/* Buttons */}
                            <button type="submit" 
                                className="btn btn-gradient-primary w-100 mb-2 fw-bold rounded-pill shadow-sm"
                                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", transition: "0.3s" }}>
                                {editingId ? "Update Profile" : "Save Profile"}
                            </button>

                            {editingId && (
                                <button type="button" 
                                    className="btn btn-outline-secondary w-100 rounded-pill shadow-sm"
                                    onClick={resetForm}
                                    style={{ transition: "0.3s" }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Profile List */}
                <div className="col-lg-7">
                    <div className="card shadow-lg p-5 rounded-4 border-0" style={{ backgroundColor: "#f8f9fa" }}>
                        <h5 className="mb-4 text-success fw-bold">Saved Profiles</h5>
                        {profiles.length === 0 ? (
                            <p className="text-muted fst-italic">No profiles saved yet.</p>
                        ) : (
                            <ul className="list-group">
                                {profiles.map(p => (
                                    <li key={p.id} 
                                        className="list-group-item d-flex justify-content-between align-items-start mb-2 rounded-3 shadow-sm"
                                        style={{ transition: "0.2s", cursor: "pointer" }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        <div>
                                            <h6 className="mb-1">{p.name} <small className="text-muted">({p.email})</small></h6>
                                            <p className="mb-0">{p.bio}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-warning btn-sm text-white fw-bold rounded-pill">Edit</button>
                                            <button className="btn btn-danger btn-sm fw-bold rounded-pill">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Mount React
const container = document.getElementById("profile");
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<ProfileManager />);
}
