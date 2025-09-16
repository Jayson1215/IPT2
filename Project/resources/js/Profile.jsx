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
        <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh", padding: "50px 0" }}>
            <div className="container" style={{ maxWidth: "1000px" }}>
                <h2 style={{ textAlign: "center", color: "#4b6cb7", marginBottom: "40px", fontWeight: "bold" }}>
                    Profile Manager
                </h2>
                <div className="row" style={{ gap: "30px", justifyContent: "center" }}>

                    {/* Form */}
                    <div className="col-md-5">
                        <div style={{
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "15px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style={{ marginBottom: "20px", color: "#4b6cb7" }}>
                                {editingId ? "Edit Profile" : "Add New Profile"}
                            </h4>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 15px",
                                        marginBottom: "15px",
                                        borderRadius: "10px",
                                        border: "1px solid #ccc",
                                        outline: "none",
                                        transition: "0.3s",
                                        fontSize: "16px"
                                    }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 15px",
                                        marginBottom: "15px",
                                        borderRadius: "10px",
                                        border: "1px solid #ccc",
                                        outline: "none",
                                        transition: "0.3s",
                                        fontSize: "16px"
                                    }}
                                />
                                <textarea
                                    name="bio"
                                    placeholder="Bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: "12px 15px",
                                        marginBottom: "20px",
                                        borderRadius: "10px",
                                        border: "1px solid #ccc",
                                        outline: "none",
                                        transition: "0.3s",
                                        fontSize: "16px",
                                        resize: "none"
                                    }}
                                />

                                <button type="submit" style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#4b6cb7",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "0.3s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#182848"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#4b6cb7"}
                                >
                                    {editingId ? "Update Profile" : "Save Profile"}
                                </button>
                                {editingId && (
                                    <button type="button"
                                        onClick={resetForm}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            marginTop: "10px",
                                            background: "#ddd",
                                            color: "#333",
                                            border: "none",
                                            borderRadius: "25px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            transition: "0.3s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#bbb"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#ddd"}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Profile List */}
                    <div className="col-md-6">
                        <div style={{
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "15px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style={{ marginBottom: "20px", color: "#4caf50" }}>Saved Profiles</h4>

                            {profiles.length === 0 ? (
                                <p style={{ color: "#777" }}>No profiles saved yet.</p>
                            ) : (
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {profiles.map(p => (
                                        <li key={p.id} style={{
                                            background: "#f9f9f9",
                                            padding: "15px 20px",
                                            borderRadius: "10px",
                                            marginBottom: "15px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
                                            transition: "0.2s"
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                        >
                                            <div>
                                                <strong>{p.name}</strong> <span style={{ color: "#555" }}>({p.email})</span>
                                                <p style={{ margin: "5px 0 0 0" }}>{p.bio}</p>
                                            </div>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "20px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        background: "#ff9800",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        transition: "0.3s"
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#e67e22"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "#ff9800"}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "20px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        background: "#f44336",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        transition: "0.3s"
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#d32f2f"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "#f44336"}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
