import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

function Home() {
    const [profiles, setProfiles] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", bio: "" });
    const [editingId, setEditingId] = useState(null);

    // Load all profiles on mount
    useEffect(() => fetchProfiles(), []);

    const fetchProfiles = () => {
        axios.get("/api/profiles")
            .then(res => setProfiles(res.data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            // Update existing profile
            axios.put(`/api/profiles/${editingId}`, form)
                .then(res => {
                    setProfiles(profiles.map(p => p.id === editingId ? res.data : p));
                    setEditingId(null);
                    setForm({ name: "", email: "", bio: "" });
                })
                .catch(err => handleError(err));
        } else {
            // Save new profile
            axios.post("/api/profiles", form)
                .then(res => {
                    setProfiles([...profiles, res.data]);
                    setForm({ name: "", email: "", bio: "" });
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

        axios.delete(`/api/profiles/${id}`)
            .then(() => setProfiles(profiles.filter(p => p.id !== id)))
            .catch(err => console.error(err));
    };

    const handleError = (err) => {
        if (err.response && err.response.data.errors) {
            alert(Object.values(err.response.data.errors).flat().join("\n"));
        } else {
            console.error(err);
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: "900px" }}>
            <h2 className="mb-4 text-center">Profile Manager</h2>
            <div className="row g-3">

                {/* Left: Form */}
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h5>{editingId ? "Edit Profile" : "Add Profile"}</h5>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control mb-2"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control mb-2"
                                required
                            />
                            <textarea
                                name="bio"
                                placeholder="Bio"
                                value={form.bio}
                                onChange={handleChange}
                                className="form-control mb-2"
                            />
                            <button type="submit" className="btn btn-primary w-100">
                                {editingId ? "Update" : "Save"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary w-100 mt-2"
                                    onClick={() => { setEditingId(null); setForm({ name: "", email: "", bio: "" }); }}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right: List of Profiles */}
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h5>Saved Profiles</h5>
                        {profiles.length === 0 ? (
                            <p>No profiles saved yet.</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {profiles.map(p => (
                                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-start">
                                        <div>
                                            <strong>{p.name}</strong> ({p.email})
                                            <p className="mb-0">{p.bio}</p>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
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

export default Home;

if (document.getElementById("home")) {
    ReactDOM.render(<Home />, document.getElementById("home"));
}
