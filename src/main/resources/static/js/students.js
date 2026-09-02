let studentList = [];

document.addEventListener('DOMContentLoaded', loadStudents);

async function loadStudents() {
    try {
        studentList = await apiRequest('/students');
        renderStudentTable(studentList);
    } catch (err) {
        showAlert('alertContainer', 'Error loading students: ' + err.message);
    }
}

function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!students || !students.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No students found.</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(s => {
        const skills = (s.skills || '').split(',').map(sk => `<span class="badge badge-skill">${sk.trim()}</span>`).join(' ');
        const status = s.allocationStatus === 'ALLOCATED'
            ? '<span class="badge badge-success">ALLOCATED</span>'
            : '<span class="badge badge-warning">UNALLOCATED</span>';

        return `<tr>
            <td><strong>${escapeHtml(s.rollNumber)}</strong></td>
            <td>${escapeHtml(s.name)}</td>
            <td>${escapeHtml(s.email)}</td>
            <td>${escapeHtml(s.branch)}</td>
            <td>${s.semester}</td>
            <td>${skills}</td>
            <td>${status}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editStudent(${s.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.id})">Delete</button>
            </td>
        </tr>`;
    }).join('');
}

let searchDebounceTimer;
function handleSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(async () => {
        const query = document.getElementById('searchInput').value.trim();
        try {
            renderStudentTable(await apiRequest(`/students/search?query=${encodeURIComponent(query)}`));
        } catch (e) {
            console.error(e);
        }
    }, 300);
}

function openStudentModal() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentForm').reset();
    document.getElementById('modalTitle').textContent = 'Add Student';
    document.getElementById('studentModal').classList.add('active');
}

function closeStudentModal() {
    document.getElementById('studentModal').classList.remove('active');
}

function editStudent(id) {
    const s = studentList.find(item => item.id === id);
    if (!s) return;
    ['studentId', 'rollNumber', 'name', 'email', 'branch', 'semester', 'skills'].forEach(f => {
        document.getElementById(f).value = s[f] || '';
    });
    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('studentModal').classList.add('active');
}

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
            await apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(studentData) });
            showAlert('alertContainer', 'Student updated successfully!', 'success');
        } else {
            await apiRequest('/students', { method: 'POST', body: JSON.stringify(studentData) });
            showAlert('alertContainer', 'Student added successfully!', 'success');
        }
        closeStudentModal();
        loadStudents();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    clearAlert('alertContainer');
    try {
        await apiRequest(`/students/${id}`, { method: 'DELETE' });
        showAlert('alertContainer', 'Student deleted successfully.', 'success');
        loadStudents();
    } catch (err) {
        showAlert('alertContainer', 'Failed to delete student: ' + err.message);
    }
}
