<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile Manager</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <style>
    body {
      background: #f8f9fa;
    }
    .profile-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .profile-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    .profile-actions button {
      transition: all 0.2s;
    }
    .profile-actions button:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
<div class="container my-5" style="max-width: 900px;">
  <h2 class="mb-4 text-center text-primary fw-bold">Profile Manager</h2>

  <!-- Form -->
  <div class="card shadow-sm p-4 mb-5">
    <h5 id="form-title" class="mb-3">➕ Add Profile</h5>
    <form id="profile-form">
      <input type="hidden" id="profile-id">
      <div class="row g-3">
        <div class="col-md-6">
          <input type="text" id="name" class="form-control" placeholder="Full Name" required>
        </div>
        <div class="col-md-6">
          <input type="email" id="email" class="form-control" placeholder="Email Address" required>
        </div>
        <div class="col-12">
          <textarea id="bio" class="form-control" placeholder="Write a short bio..." rows="3"></textarea>
        </div>
      </div>
      <div class="mt-4">
        <button type="submit" class="btn btn-primary px-4">💾 Save</button>
        <button type="button" id="cancel-edit" class="btn btn-secondary d-none">❌ Cancel</button>
      </div>
    </form>
  </div>

  <!-- Profiles Grid -->
  <div>
    <h5 class="mb-3">👤 Saved Profiles</h5>
    <div id="profile-list" class="row g-4"></div>
  </div>
</div>

<script>
  const form = document.getElementById('profile-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const bioInput = document.getElementById('bio');
  const profileIdInput = document.getElementById('profile-id');
  const profileList = document.getElementById('profile-list');
  const formTitle = document.getElementById('form-title');
  const cancelEditBtn = document.getElementById('cancel-edit');

  let editing = false;

  // Load profiles
  function loadProfiles() {
    axios.get('/profiles').then(res => {
      profileList.innerHTML = '';
      res.data.forEach(profile => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
          <div class="card profile-card shadow-sm h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-primary">${profile.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${profile.email}</h6>
              <p class="card-text flex-grow-1">${profile.bio ?? ''}</p>
              <div class="profile-actions mt-3">
                <button class="btn btn-sm btn-warning me-2" onclick="editProfile(${profile.id}, '${profile.name}', '${profile.email}', '${profile.bio ?? ''}')">✏️ Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProfile(${profile.id})">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `;
        profileList.appendChild(col);
      });
    });
  }

  // Save / Update
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: nameInput.value,
      email: emailInput.value,
      bio: bioInput.value
    };

    if (editing) {
      axios.put(`/profiles/${profileIdInput.value}`, data).then(() => {
        resetForm();
        loadProfiles();
      });
    } else {
      axios.post('/profiles', data).then(() => {
        resetForm();
        loadProfiles();
      });
    }
  });

  // Edit
  function editProfile(id, name, email, bio) {
    editing = true;
    formTitle.innerText = "✏️ Edit Profile";
    profileIdInput.value = id;
    nameInput.value = name;
    emailInput.value = email;
    bioInput.value = bio;
    cancelEditBtn.classList.remove('d-none');
  }

  // Cancel Edit
  cancelEditBtn.addEventListener('click', () => {
    resetForm();
  });

  // Reset Form
  function resetForm() {
    editing = false;
    formTitle.innerText = "➕ Add Profile";
    profileIdInput.value = '';
    nameInput.value = '';
    emailInput.value = '';
    bioInput.value = '';
    cancelEditBtn.classList.add('d-none');
  }

  // Delete
  function deleteProfile(id) {
    if (confirm("Are you sure you want to delete this profile?")) {
      axios.delete(`/profiles/${id}`).then(() => loadProfiles());
    }
  }

  // Initial load
  loadProfiles();
</script>
</body>
</html>
