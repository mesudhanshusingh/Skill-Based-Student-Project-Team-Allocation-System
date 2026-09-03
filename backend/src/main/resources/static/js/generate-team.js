let allProjects = [], allStudents = [], currentProject = null, draftTeamMembers = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    const projectId = new URLSearchParams(window.location.search).get('projectId');
    if (projectId) {
        document.getElementById('projectSelect').value = projectId;
        onProjectSelectChange();
    }
});

async function loadInitialData() {
    clearAlert('alertContainer');
    try {
        const [projects, students] = await Promise.all([apiRequest('/projects'), apiRequest('/students')]);
        allProjects = projects;
        allStudents = students;

        const select = document.getElementById('projectSelect');
        select.innerHTML = '<option value="">-- Select a Project --</option>';
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.projectName} (Posted by: ${p.createdByName || 'Student'})`;
            select.appendChild(opt);
        });
    } catch (err) {
        showAlert('alertContainer', 'Failed to load project or student data: ' + err.message);
    }
}

async function onProjectSelectChange() {
    const id = document.getElementById('projectSelect').value;
    const preview = document.getElementById('projectPreview');
    const workspace = document.getElementById('workspaceSection');

    if (!id) {
        preview.style.display = 'none';
        workspace.style.display = 'none';
        currentProject = null;
        draftTeamMembers = [];
        return;
    }

    currentProject = allProjects.find(p => p.id == id);
    if (!currentProject) return;

    document.getElementById('previewTitle').textContent = currentProject.projectName;
    document.getElementById('previewCreator').textContent = `Posted by: ${currentProject.createdByName || 'Student Lead'}`;
    document.getElementById('previewDesc').textContent = currentProject.description || 'No description provided.';
    document.getElementById('previewTeamSize').textContent = `${currentProject.teamSize} Members`;
    document.getElementById('previewSkills').innerHTML = (currentProject.requiredSkills || '')
        .split(',')
        .map(s => `<span class="badge badge-skill">${s.trim()}</span>`)
        .join(' ');

    preview.style.display = 'block';
    workspace.style.display = 'block';

    try {
        const existingTeams = await apiRequest(`/teams/project/${id}`);
        if (existingTeams && existingTeams.length > 0 && existingTeams[0].members) {
            draftTeamMembers = existingTeams[0].members.map(m => allStudents.find(s => s.id === m.id) || m);
        } else {
            draftTeamMembers = [];
        }
    } catch (e) {
        draftTeamMembers = [];
    }

    renderWorkspace();
}

function autoSuggestOneTeam() {
    if (!currentProject) return;
    const reqSkills = (currentProject.requiredSkills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const unallocated = allStudents.filter(s => s.allocationStatus === 'UNALLOCATED');

    if (unallocated.length < currentProject.teamSize) {
        return showAlert('alertContainer', `Need at least ${currentProject.teamSize} unallocated candidates. Available: ${unallocated.length}`);
    }

    const scored = unallocated.map(s => {
        const skills = (s.skills || '').split(',').map(sk => sk.trim().toLowerCase());
        const matches = reqSkills.filter(r => skills.includes(r)).length;
        return { student: s, matches };
    }).sort((a, b) => b.matches - a.matches);

    draftTeamMembers = scored.slice(0, currentProject.teamSize).map(item => item.student);
    showAlert('alertContainer', 'Auto-suggested top matching team!', 'success');
    renderWorkspace();
}

function clearSelectedTeam() {
    draftTeamMembers = [];
    renderWorkspace();
}

function addMemberToDraft(studentId) {
    if (draftTeamMembers.length >= currentProject.teamSize) {
        return showAlert('alertContainer', `Team size limit reached (${currentProject.teamSize} max).`);
    }
    const student = allStudents.find(s => s.id === studentId);
    if (student && !draftTeamMembers.some(m => m.id === studentId)) {
        draftTeamMembers.push(student);
        renderWorkspace();
    }
}

function removeMemberFromDraft(studentId) {
    draftTeamMembers = draftTeamMembers.filter(m => m.id !== studentId);
    renderWorkspace();
}

function renderWorkspace() {
    if (!currentProject) return;

    const selectedContainer = document.getElementById('selectedMembersContainer');
    const availableContainer = document.getElementById('availableCandidatesContainer');
    const draftIds = new Set(draftTeamMembers.map(m => m.id));

    document.getElementById('memberCountBadge').textContent = `${draftTeamMembers.length} / ${currentProject.teamSize}`;
    document.getElementById('selectedCountBadge').textContent = `${draftTeamMembers.length} Members`;

    const availableCandidates = allStudents.filter(s => !draftIds.has(s.id));
    document.getElementById('availableCountBadge').textContent = `${availableCandidates.length} Candidates`;

    selectedContainer.innerHTML = draftTeamMembers.length ? draftTeamMembers.map(m => `
        <div class="team-card" style="padding: 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div style="font-weight: 700;">${escapeHtml(m.name)}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(m.rollNumber)} &bull; ${escapeHtml(m.branch)}</div>
                    <div style="margin-top: 0.4rem;">
                        ${(m.skills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ')}
                    </div>
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeMemberFromDraft(${m.id})">Remove</button>
            </div>
        </div>
    `).join('') : '<div style="color: var(--text-secondary); padding: 1.5rem; text-align: center; background: var(--surface); border-radius: var(--radius); border: 1px dashed var(--border);">No team members selected yet.</div>';

    availableContainer.innerHTML = availableCandidates.length ? availableCandidates.map(c => `
        <div class="team-card" style="padding: 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div style="font-weight: 700;">${escapeHtml(c.name)} <span class="badge ${c.allocationStatus === 'ALLOCATED' ? 'badge-success' : 'badge-warning'}" style="font-size: 0.7rem;">${c.allocationStatus}</span></div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(c.rollNumber)} &bull; ${escapeHtml(c.branch)}</div>
                    <div style="margin-top: 0.4rem;">
                        ${(c.skills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ')}
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="addMemberToDraft(${c.id})">Add</button>
            </div>
        </div>
    `).join('') : '<div style="color: var(--text-secondary); padding: 1.5rem; text-align: center;">No candidate students available.</div>';

    calculateLiveCoverage();
}

function calculateLiveCoverage() {
    if (!currentProject) return;
    const reqSkills = (currentProject.requiredSkills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const coveredSkills = new Set();

    draftTeamMembers.forEach(m => {
        const studentSkills = (m.skills || '').split(',').map(s => s.trim().toLowerCase());
        reqSkills.forEach(req => {
            if (studentSkills.includes(req)) coveredSkills.add(req);
        });
    });

    const pct = reqSkills.length === 0 ? 100 : Math.round((coveredSkills.size / reqSkills.length) * 100);
    const missing = reqSkills.filter(req => !coveredSkills.has(req));

    const badge = document.getElementById('skillCoverageBadge');
    badge.textContent = `${pct}%`;
    badge.className = `badge ${pct >= 100 ? 'badge-success' : 'badge-warning'}`;

    const missingDiv = document.getElementById('missingSkillsDisplay');
    missingDiv.innerHTML = missing.length
        ? `Missing Project Skills: <strong>${missing.join(', ')}</strong>`
        : '<span style="color: var(--success); font-weight: 600;">100% Skill Coverage Achieved!</span>';
}

async function saveFinalTeam() {
    if (!currentProject) return;
    if (draftTeamMembers.length === 0) return showAlert('alertContainer', 'Please select at least 1 team member.');

    const payload = {
        projectId: currentProject.id,
        teamName: 'Team 1',
        studentIds: draftTeamMembers.map(m => m.id)
    };

    try {
        await apiRequest('/teams/save-custom', { method: 'POST', body: JSON.stringify(payload) });
        showAlert('alertContainer', 'Final team saved successfully!', 'success');
        setTimeout(() => { window.location.href = 'teams.html'; }, 1000);
    } catch (err) {
        showAlert('alertContainer', 'Failed to save team: ' + err.message);
    }
}
