document.addEventListener('DOMContentLoaded', loadAllocatedTeams);

async function loadAllocatedTeams() {
    clearAlert('alertContainer');
    const container = document.getElementById('allocatedTeamsContainer');

    try {
        const data = await apiRequest('/teams/all');
        const allocatedGroups = (data || []).filter(g => g.teams && g.teams.length > 0);
        renderAllocatedTeamsGrid(allocatedGroups, container);
    } catch (err) {
        showAlert('alertContainer', 'Failed to load allocated teams: ' + err.message);
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--danger);">Failed to load teams. Please ensure backend is running.</div>`;
    }
}

function renderAllocatedTeamsGrid(allocatedGroups, container) {
    container.innerHTML = '';

    if (!allocatedGroups || !allocatedGroups.length) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 3rem; background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border);">
                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">No Teams Allocated Yet</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">No student teams have been generated or saved yet.</p>
                <a href="generate-team.html" class="btn btn-primary btn-sm">Find Teammates Now</a>
            </div>
        `;
        return;
    }

    allocatedGroups.forEach(group => {
        const reqSkills = (group.requiredSkills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ');

        group.teams.forEach(team => {
            const membersHtml = team.members.map(m => `
                <li class="member-item">
                    <div class="member-name">${escapeHtml(m.name)} <span class="member-info">(${escapeHtml(m.rollNumber)} - ${escapeHtml(m.branch)})</span></div>
                    <div style="margin-top: 0.2rem;">${(m.skills || '').split(',').map(s => `<span class="badge badge-skill">${s.trim()}</span>`).join(' ')}</div>
                </li>
            `).join('');

            const missingSkillsHtml = team.missingSkills && team.missingSkills.length > 0
                ? `<div class="missing-skills">Missing Skills: ${team.missingSkills.join(', ')}</div>`
                : `<div style="color: var(--success); font-size: 0.8rem; font-weight: 600; margin-top: 0.25rem;">All Required Skills Covered</div>`;

            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <div>
                    <div class="team-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span class="team-name">${escapeHtml(team.teamName)} &bull; ${escapeHtml(group.projectName)}</span>
                            <div style="margin-top: 0.25rem;"><span class="badge badge-warning">Posted by: ${escapeHtml(group.createdByName || 'Student Lead')}</span></div>
                        </div>
                        <span class="badge badge-info">${team.members.length} Members</span>
                    </div>

                    <div style="margin-bottom: 0.75rem; font-size: 0.8rem; color: var(--text-secondary);">
                        <strong>Project Requirements:</strong> ${reqSkills}
                    </div>

                    <ul class="member-list">${membersHtml}</ul>
                </div>

                <div>
                    <div class="coverage-box">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="font-size: 0.9rem;">Skill Coverage:</strong>
                            <span class="badge ${team.skillCoverage >= 100 ? 'badge-success' : 'badge-warning'}" style="font-size: 0.85rem;">${team.skillCoverage}%</span>
                        </div>
                        ${missingSkillsHtml}
                    </div>

                    <div style="margin-top: 1rem; text-align: right;">
                        <button class="btn btn-danger btn-sm" onclick="resetTeamsForProject(${group.projectId})">Reset Team</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

async function resetTeamsForProject(projectId) {
    if (!confirm('Are you sure you want to reset/delete this team? Members will be set back to UNALLOCATED.')) return;

    try {
        await apiRequest(`/teams/project/${projectId}`, { method: 'DELETE' });
        showAlert('alertContainer', 'Team reset successfully. Students marked as UNALLOCATED.', 'success');
        loadAllocatedTeams();
    } catch (err) {
        showAlert('alertContainer', 'Failed to reset team: ' + err.message);
    }
}
