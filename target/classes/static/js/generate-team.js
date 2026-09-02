// Interactive Custom Team Builder JavaScript

let projectsMap = {};
let currentProject = null;
let allStudentsList = [];
let selectedStudents = [];
let availableStudents = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadProjectsDropdown();

    const urlParams = new URLSearchParams(window.location.search);
    const projectIdParam = urlParams.get('projectId');
    if (projectIdParam) {
        document.getElementById('projectSelect').value = projectIdParam;
        onProjectSelectChange();
    }
});

// Load project dropdown
async function loadProjectsDropdown() {
    try {
        const projects = await apiRequest('/projects');
        const select = document.getElementById('projectSelect');
        select.innerHTML = '<option value="">-- Select a Project --</option>';

        projects.forEach(p => {
            projectsMap[p.id] = p;
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.projectName} (Posted by: ${p.createdByName || 'Student'})`;
            select.appendChild(option);
        });
    } catch (error) {
        showAlert('alertContainer', 'Failed to load projects: ' + error.message);
    }
}

// On project dropdown selection change
async function onProjectSelectChange() {
    clearAlert('alertContainer');
    const select = document.getElementById('projectSelect');
    const projectId = select.value;
    const preview = document.getElementById('projectPreview');
    const workspace = document.getElementById('workspaceSection');

    if (!projectId) {
        preview.style.display = 'none';
        workspace.style.display = 'none';
        currentProject = null;
        return;
    }

    currentProject = projectsMap[projectId];
    if (currentProject) {
        document.getElementById('previewTitle').textContent = currentProject.projectName;
        document.getElementById('previewCreator').textContent = `Posted by: ${currentProject.createdByName || 'Student Lead'}`;
        document.getElementById('previewDesc').textContent = currentProject.description || 'No description provided.';
        
        document.getElementById('previewSkills').innerHTML = (currentProject.requiredSkills || '')
            .split(',')
            .map(s => `<span class="badge badge-skill">${s.trim()}</span>`)
            .join(' ');

        document.getElementById('previewTeamSize').textContent = `${currentProject.teamSize} Members Needed`;

        preview.style.display = 'block';

        // Load all students and setup workspace
        await loadStudentsAndSetupWorkspace();
        workspace.style.display = 'block';
    }
}

// Load students and initialize lists
async function loadStudentsAndSetupWorkspace() {
    try {
        allStudentsList = await apiRequest('/students');

        // Filter unallocated students for candidates pool
        const unallocated = allStudentsList.filter(s => s.allocationStatus === 'UNALLOCATED');
        selectedStudents = [];
        availableStudents = [...unallocated];

        // Auto suggest 1 team draft by default
        autoSuggestOneTeam();
    } catch (error) {
        showAlert('alertContainer', 'Failed to load registered students: ' + error.message);
    }
}

// Auto suggest 1 team based on skill matching score
function autoSuggestOneTeam() {
    if (!currentProject || availableStudents.length === 0) return;

    // Combine selected back to available pool before auto suggesting
    availableStudents = [...availableStudents, ...selectedStudents];
    selectedStudents = [];

    const reqSkills = parseSkills(currentProject.requiredSkills);
    const teamSize = currentProject.teamSize;

    // Rank available students by skill match count
    availableStudents.sort((a, b) => {
        const scoreA = calculateMatchCount(a.skills, reqSkills);
        const scoreB = calculateMatchCount(b.skills, reqSkills);
        return scoreB - scoreA;
    });

    // Pick top teamSize candidates into selectedStudents
    while (selectedStudents.length < teamSize && availableStudents.length > 0) {
        const picked = availableStudents.shift();
        selectedStudents.push(picked);
    }

    updateWorkspaceUI();
}

// Clear selected team members
function clearSelectedTeam() {
    availableStudents = [...availableStudents, ...selectedStudents];
    selectedStudents = [];
    updateWorkspaceUI();
}

// Add student from available candidates to team draft
function addStudentToTeam(studentId) {
    const index = availableStudents.findIndex(s => s.id === studentId);
    if (index !== -1) {
        const student = availableStudents.splice(index, 1)[0];
        selectedStudents.push(student);
        updateWorkspaceUI();
    }
}

// Remove student from team draft back to available candidates
function removeStudentFromTeam(studentId) {
    const index = selectedStudents.findIndex(s => s.id === studentId);
    if (index !== -1) {
        const student = selectedStudents.splice(index, 1)[0];
        availableStudents.push(student);
        updateWorkspaceUI();
    }
}

// Update Interactive UI & Recalculate Skill Coverage
function updateWorkspaceUI() {
    const reqSkills = parseSkills(currentProject ? currentProject.requiredSkills : '');
    const teamSize = currentProject ? currentProject.teamSize : 4;

    // 1. Calculate Skill Coverage & Missing Skills
    const coveredLower = new Set();
    selectedStudents.forEach(student => {
        const studentSkills = parseSkills(student.skills);
        reqSkills.forEach(req => {
            if (studentSkills.some(sk => sk.toLowerCase() === req.toLowerCase())) {
                coveredLower.add(req.toLowerCase());
            }
        });
    });

    const coverage = reqSkills.length === 0 ? 100.0 : Math.round((coveredLower.size / reqSkills.length) * 1000) / 10;
    const missingSkills = reqSkills.filter(req => !coveredLower.has(req.toLowerCase()));

    // 2. Update Header Summary Badges
    document.getElementById('memberCountBadge').textContent = `${selectedStudents.length} / ${teamSize}`;
    const coverageBadge = document.getElementById('skillCoverageBadge');
    coverageBadge.textContent = `${coverage}%`;
    coverageBadge.className = `badge ${coverage >= 100 ? 'badge-success' : 'badge-warning'}`;

    const missingDisp = document.getElementById('missingSkillsDisplay');
    if (missingSkills.length > 0) {
        missingDisp.textContent = `Missing Skills: ${missingSkills.join(', ')}`;
        missingDisp.style.display = 'block';
    } else {
        missingDisp.textContent = `All required project skills covered!`;
        missingDisp.style.color = 'var(--success)';
        missingDisp.style.display = 'block';
    }

    document.getElementById('selectedCountBadge').textContent = `${selectedStudents.length} Selected`;
    document.getElementById('availableCountBadge').textContent = `${availableStudents.length} Available`;

    // 3. Render Selected Team Members List
    const selectedContainer = document.getElementById('selectedMembersContainer');
    if (selectedStudents.length === 0) {
        selectedContainer.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1.5rem; background: var(--surface); border-radius: var(--radius); border: 1px dashed var(--border);">No teammates selected yet. Click "Add to Team" on candidate students below.</div>';
    } else {
        selectedContainer.innerHTML = selectedStudents.map(student => `
            <div class="card-table" style="padding: 1rem; background: var(--surface); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${escapeHtml(student.name)}</strong> <span style="font-size: 0.8rem; color: var(--text-secondary);">(${escapeHtml(student.rollNumber)} - ${escapeHtml(student.branch)})</span>
                    <div style="margin-top: 0.3rem;">
                        ${(student.skills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ')}
                    </div>
                </div>
                <div>
                    <button class="btn btn-danger btn-sm" onclick="removeStudentFromTeam(${student.id})">Remove Member</button>
                </div>
            </div>
        `).join('');
    }

    // 4. Render Available Candidates List
    const availableContainer = document.getElementById('availableCandidatesContainer');
    if (availableStudents.length === 0) {
        availableContainer.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1.5rem; background: var(--surface); border-radius: var(--radius); border: 1px dashed var(--border);">No more unallocated candidates available.</div>';
    } else {
        availableContainer.innerHTML = availableStudents.map(student => `
            <div class="card-table" style="padding: 1rem; background: var(--surface); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${escapeHtml(student.name)}</strong> <span style="font-size: 0.8rem; color: var(--text-secondary);">(${escapeHtml(student.rollNumber)} - ${escapeHtml(student.branch)})</span>
                    <div style="margin-top: 0.3rem;">
                        ${(student.skills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ')}
                    </div>
                </div>
                <div>
                    <button class="btn btn-secondary btn-sm" onclick="addStudentToTeam(${student.id})">Add to Team</button>
                </div>
            </div>
        `).join('');
    }
}

// Save final custom team to backend REST API
async function saveFinalTeam() {
    if (!currentProject) return;

    if (selectedStudents.length === 0) {
        alert('Please select at least one teammate for your team.');
        return;
    }

    clearAlert('alertContainer');
    const studentIds = selectedStudents.map(s => s.id);

    try {
        await apiRequest('/teams/save-custom', {
            method: 'POST',
            body: JSON.stringify({
                projectId: currentProject.id,
                teamName: 'Team 1',
                studentIds: studentIds
            })
        });

        showAlert('alertContainer', 'Final project team saved successfully!', 'success');
        setTimeout(() => {
            window.location.href = `teams.html?projectId=${currentProject.id}`;
        }, 1500);
    } catch (error) {
        showAlert('alertContainer', 'Failed to save final team: ' + error.message);
    }
}

// Utility: parse comma separated skills
function parseSkills(skillsStr) {
    if (!skillsStr) return [];
    return skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Utility: calculate match count
function calculateMatchCount(studentSkillsStr, reqSkillsList) {
    const studentSkills = parseSkills(studentSkillsStr);
    let count = 0;
    reqSkillsList.forEach(req => {
        if (studentSkills.some(sk => sk.toLowerCase() === req.toLowerCase())) {
            count++;
        }
    });
    return count;
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
