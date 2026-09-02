async function checkExistingRollNumber() {
    clearAlert('alertContainer');
    const rollNumber = document.getElementById('rollNumber').value.trim();
    if (!rollNumber) return showAlert('alertContainer', 'Please enter a roll number first.');

    try {
        const students = await apiRequest(`/students/search?query=${encodeURIComponent(rollNumber)}`);
        const match = students.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());

        if (match) {
            ['studentId', 'name', 'email', 'branch', 'semester', 'skills'].forEach(f => {
                document.getElementById(f).value = match[f] || '';
            });
            showAlert('alertContainer', `Found existing profile for ${match.name}. You can update your skills now.`, 'success');
        } else {
            showAlert('alertContainer', 'No existing record found with this roll number. Fill in details to register new profile.', 'success');
        }
    } catch (err) {
        showAlert('alertContainer', 'Failed to check roll number: ' + err.message);
    }
}

async function saveStudentProfile(event) {
    event.preventDefault();
    clearAlert('alertContainer');

    const id = document.getElementById('studentId').value;
    const studentData = {
        rollNumber: document.getElementById('rollNumber').value.trim(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        branch: document.getElementById('branch').value.trim(),
        semester: parseInt(document.getElementById('semester').value),
        skills: document.getElementById('skills').value.trim(),
        allocationStatus: 'UNALLOCATED'
    };

    try {
        if (id) {
            await apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(studentData) });
            showAlert('alertContainer', 'Profile & skills updated successfully!', 'success');
        } else {
            const created = await apiRequest('/students', { method: 'POST', body: JSON.stringify(studentData) });
            document.getElementById('studentId').value = created.id;
            showAlert('alertContainer', 'Profile & skills registered successfully!', 'success');
        }
    } catch (err) {
        showAlert('alertContainer', 'Error saving profile: ' + err.message);
    }
}
