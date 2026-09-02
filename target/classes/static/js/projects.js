// Project Management JavaScript

let projectList = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

// Load all projects
async function loadProjects() {
    try {
        projectList = await apiRequest('/projects');
        renderProjectTable(projectList);
    } catch (error) {
        showAlert('alertContainer', 'Error loading projects: ' + error.message);
    }
}

// Render project table rows
function renderProjectTable(projects) {
    const tbody = document.getElementById('projectTableBody');
    if (!projects || projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No student projects found.</td></tr>';
        return;
    }

    tbody.innerHTML = projects.map(project => {
        const skillsBadges = (project.requiredSkills || '')
            .split(',')
            .map(s => `<span class="badge badge-skill">${s.trim()}</span>`)
            .join(' ');

        return `
            <tr>
                <td><strong>${escapeHtml(project.projectName)}</strong></td>
                <td><span class="badge badge-warning">${escapeHtml(project.createdByName || 'Student Lead')}</span></td>
                <td>${escapeHtml(project.description || '-')}</td>
                <td>${skillsBadges}</td>
                <td><span class="badge badge-info">${project.teamSize} Members</span></td>
                <td>
                    <a href="generate-team.html?projectId=${project.id}" class="btn btn-primary btn-sm">Find Teammates</a>
                    <button class="btn btn-secondary btn-sm" onclick="editProject(${project.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Open modal for add
function openProjectModal() {
    document.getElementById('projectId').value = '';
    document.getElementById('projectForm').reset();
    document.getElementById('modalTitle').textContent = 'Post Student Project';
    document.getElementById('projectModal').classList.add('active');
}

// Close modal
function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

// Open modal for edit
function editProject(id) {
    const project = projectList.find(p => p.id === id);
    if (!project) return;

    document.getElementById('projectId').value = project.id;
    document.getElementById('projectName').value = project.projectName;
    document.getElementById('createdByName').value = project.createdByName || '';
    document.getElementById('description').value = project.description || '';
    document.getElementById('requiredSkills').value = project.requiredSkills;
    document.getElementById('teamSize').value = project.teamSize;

    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectModal').classList.add('active');
}

// Save project (Add / Update)
async function saveProject(event) {
    event.preventDefault();
    clearAlert('alertContainer');

    const id = document.getElementById('projectId').value;
    const projectData = {
        projectName: document.getElementById('projectName').value.trim(),
        createdByName: document.getElementById('createdByName').value.trim(),
        description: document.getElementById('description').value.trim(),
        requiredSkills: document.getElementById('requiredSkills').value.trim(),
        teamSize: parseInt(document.getElementById('teamSize').value)
    };

    try {
        if (id) {
            await apiRequest(`/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(projectData)
            });
            showAlert('alertContainer', 'Project updated successfully!', 'success');
        } else {
            await apiRequest('/projects', {
                method: 'POST',
                body: JSON.stringify(projectData)
            });
            showAlert('alertContainer', 'Project posted successfully!', 'success');
        }

        closeProjectModal();
        loadProjects();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete project
async function deleteProject(id) {
    if (!confirm('Deleting this project will also reset any generated teams for it. Continue?')) return;
    clearAlert('alertContainer');

    try {
        await apiRequest(`/projects/${id}`, { method: 'DELETE' });
        showAlert('alertContainer', 'Project and associated teams deleted.', 'success');
        loadProjects();
    } catch (error) {
        showAlert('alertContainer', 'Failed to delete project: ' + error.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
