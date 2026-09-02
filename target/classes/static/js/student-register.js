// Student Self-Registration & Skill Update JavaScript

// Fetch existing record by roll number if available
async function checkExistingRollNumber() {
    clearAlert('alertContainer');
    const rollNumber = document.getElementById('rollNumber').value.trim();
    if (!rollNumber) {
        showAlert('alertContainer', 'Please enter a roll number first.');
        return;
    }

    try {
        const students = await apiRequest(`/students/search?query=${encodeURIComponent(rollNumber)}`);
        const match = students.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());

        if (match) {
            document.getElementById('studentId').value = match.id;
            document.getElementById('name').value = match.name;
            document.getElementById('email').value = match.email;
            document.getElementById('branch').value = match.branch;
            document.getElementById('semester').value = match.semester;
            document.getElementById('skills').value = match.skills;
            showAlert('alertContainer', `Found existing profile for ${match.name}. You can update your skills now.`, 'success');
        } else {
            showAlert('alertContainer', 'No existing record found with this roll number. Fill in the details to register new profile.', 'success');
        }
    } catch (error) {
        showAlert('alertContainer', 'Failed to check roll number: ' + error.message);
    }
}

// Save or Update student profile
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
            await apiRequest(`/students/${id}`, {
                method: 'PUT',
                body: JSON.stringify(studentData)
            });
            showAlert('alertContainer', 'Your student profile & skills have been updated successfully!', 'success');
        } else {
            const created = await apiRequest('/students', {
                method: 'POST',
                body: JSON.stringify(studentData)
            });
            document.getElementById('studentId').value = created.id;
            showAlert('alertContainer', 'Student profile & skills registered successfully!', 'success');
        }
    } catch (error) {
        showAlert('alertContainer', 'Error saving profile: ' + error.message);
    }
}
