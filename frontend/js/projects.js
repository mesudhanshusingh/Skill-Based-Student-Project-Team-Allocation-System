let projectList = [];

document.addEventListener('DOMContentLoaded', loadProjects);

async function loadProjects() {
    try {
        projectList = await apiRequest('/projects');
        renderProjectTable(projectList);
    } catch (err) {
        showAlert('alertContainer', 'Error loading projects: ' + err.message);
    }
}

function renderProjectTable(projects) {
    const tbody = document.getElementById('projectTableBody');
    if (!projects || !projects.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No projects found.</td></tr>';
        return;
    }

    tbody.innerHTML = projects.map(p => {
        const skills = (p.requiredSkills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ');
        return `<tr>
            <td><strong>${escapeHtml(p.projectName)}</strong></td>
            <td><span class="badge badge-info">${escapeHtml(p.createdByName || 'Student Lead')}</span></td>
            <td>${escapeHtml(p.description || '-')}</td>
            <td>${skills}</td>
            <td><strong>${p.teamSize} Members</strong></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editProject(${p.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.id})">Delete</button>
            </td>
        </tr>`;
    }).join('');
}

function openProjectModal() {
    document.getElementById('projectId').value = '';
    document.getElementById('projectForm').reset();
    document.getElementById('modalTitle').textContent = 'Post Student Project';
    document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

function editProject(id) {
    const p = projectList.find(item => item.id === id);
    if (!p) return;
    ['projectId', 'projectName', 'createdByName', 'description', 'requiredSkills', 'teamSize'].forEach(f => {
        const el = document.getElementById(f);
        if (el) el.value = p[f === 'projectId' ? 'id' : f] || '';
    });
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectModal').classList.add('active');
}

async function saveProject(event) {
    event.preventDefault();
    clearAlert('alertContainer');
    const id = document.getElementById('projectId').value;
    const data = {
        projectName: document.getElementById('projectName').value.trim(),
        createdByName: document.getElementById('createdByName').value.trim(),
        description: document.getElementById('description').value.trim(),
        requiredSkills: document.getElementById('requiredSkills').value.trim(),
        teamSize: parseInt(document.getElementById('teamSize').value)
    };

    try {
        if (id) {
            await apiRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
            showAlert('alertContainer', 'Project updated successfully!', 'success');
        } else {
            await apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) });
            showAlert('alertContainer', 'Project posted successfully!', 'success');
        }
        closeProjectModal();
        loadProjects();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    clearAlert('alertContainer');
    try {
        await apiRequest(`/projects/${id}`, { method: 'DELETE' });
        showAlert('alertContainer', 'Project deleted successfully.', 'success');
        loadProjects();
    } catch (err) {
        showAlert('alertContainer', 'Failed to delete project: ' + err.message);
    }
}
