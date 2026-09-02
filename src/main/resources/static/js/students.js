// Student Management JavaScript

let studentList = [];

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
});

// Load all students
async function loadStudents() {
    try {
        studentList = await apiRequest('/students');
        renderStudentTable(studentList);
    } catch (error) {
        showAlert('alertContainer', 'Error loading students: ' + error.message);
    }
}

// Render student table rows
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No students found.</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => {
        const skillsBadges = (student.skills || '')
            .split(',')
            .map(s => `<span class="badge badge-skill">${s.trim()}</span>`)
            .join(' ');

        const statusBadge = student.allocationStatus === 'ALLOCATED'
            ? '<span class="badge badge-success">ALLOCATED</span>'
            : '<span class="badge badge-warning">UNALLOCATED</span>';

        return `
            <tr>
                <td><strong>${escapeHtml(student.rollNumber)}</strong></td>
                <td>${escapeHtml(student.name)}</td>
                <td>${escapeHtml(student.email)}</td>
                <td>${escapeHtml(student.branch)}</td>
                <td>${student.semester}</td>
                <td>${skillsBadges}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Search handler
let searchDebounceTimer;
function handleSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(async () => {
        const query = document.getElementById('searchInput').value.trim();
        try {
            const results = await apiRequest(`/students/search?query=${encodeURIComponent(query)}`);
            renderStudentTable(results);
        } catch (error) {
            console.error(error);
        }
    }, 300);
}

// Open modal for add
function openStudentModal() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentForm').reset();
    document.getElementById('modalTitle').textContent = 'Add Student';
    document.getElementById('studentModal').classList.add('active');
}

// Close modal
function closeStudentModal() {
    document.getElementById('studentModal').classList.remove('active');
}

// Open modal for edit
function editStudent(id) {
    const student = studentList.find(s => s.id === id);
    if (!student) return;

    document.getElementById('studentId').value = student.id;
    document.getElementById('rollNumber').value = student.rollNumber;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('branch').value = student.branch;
    document.getElementById('semester').value = student.semester;
    document.getElementById('skills').value = student.skills;

    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('studentModal').classList.add('active');
}

// Save student (Add / Update)
async function saveStudent(event) {
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
            showAlert('alertContainer', 'Student updated successfully!', 'success');
        } else {
            await apiRequest('/students', {
                method: 'POST',
                body: JSON.stringify(studentData)
            });
            showAlert('alertContainer', 'Student added successfully!', 'success');
        }

        closeStudentModal();
        loadStudents();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    clearAlert('alertContainer');

    try {
        await apiRequest(`/students/${id}`, { method: 'DELETE' });
        showAlert('alertContainer', 'Student deleted successfully.', 'success');
        loadStudents();
    } catch (error) {
        showAlert('alertContainer', 'Failed to delete student: ' + error.message);
    }
}

// Helper to escape HTML tags
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
