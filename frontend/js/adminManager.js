// Admin management utilities

class AdminManager {
    async getEventRegistrations(eventId, page = 1) {
        const result = await registrationAPI.getEventRegistrations(eventId, page);
        if (result.success) {
            return result.data.registrations;
        }
        return [];
    }

    async checkInAttendee(registrationId) {
        const result = await registrationAPI.checkIn(registrationId);
        return result;
    }

    async getEventCertificates(eventId) {
        const result = await certificateAPI.getEventCertificates(eventId);
        if (result.success) {
            return result.data.certificates;
        }
        return [];
    }

    displayRegistrations(registrations, container = 'registrationsContainer') {
        const el = document.getElementById(container);
        if (!el) return;

        if (registrations.length === 0) {
            el.innerHTML = '<p>No registrations found</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'admin-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Status</th>
                <th>Registered At</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        registrations.forEach(reg => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = `${reg.user?.firstName || ''} ${reg.user?.lastName || ''}`;
            row.appendChild(nameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = reg.user?.email || '';
            row.appendChild(emailCell);

            const studentIdCell = document.createElement('td');
            studentIdCell.textContent = reg.user?.studentId || '';
            row.appendChild(studentIdCell);

            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            statusBadge.className = reg.status === 'checked-in' ? 'badge badge-success' : 'badge badge-warning';
            statusBadge.textContent = reg.status === 'checked-in' ? 'Checked In' : 'Registered';
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            const registeredAtCell = document.createElement('td');
            registeredAtCell.textContent = new Date(reg.registeredAt).toLocaleDateString();
            row.appendChild(registeredAtCell);

            const actionsCell = document.createElement('td');
            if (reg.status === 'registered') {
                const checkInButton = document.createElement('button');
                checkInButton.className = 'btn btn-sm btn-success';
                checkInButton.type = 'button';
                checkInButton.textContent = 'Check In';
                checkInButton.addEventListener('click', () => this.checkInAttendee(reg._id));
                actionsCell.appendChild(checkInButton);
            } else {
                actionsCell.textContent = 'Checked In';
            }
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        el.innerHTML = '';
        el.appendChild(table);
    }

    displayCertificates(certificates, container = 'certificatesListContainer') {
        const el = document.getElementById(container);
        if (!el) return;

        if (certificates.length === 0) {
            el.innerHTML = '<p>No certificates issued yet</p>';
            return;
        }

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Certificate ID</th>
                        <th>Issued Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        certificates.forEach(cert => {
            html += `
                <tr>
                    <td>${cert.user?.firstName} ${cert.user?.lastName}</td>
                    <td>${cert.certificateId}</td>
                    <td>${new Date(cert.issueDate).toLocaleDateString()}</td>
                    <td><span class="badge badge-success">Issued</span></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        el.innerHTML = html;
    }

    async checkInAttendeeAction(registrationId) {
        const result = await this.checkInAttendee(registrationId);
        if (result.success) {
            showNotification('Success', 'Attendee checked in!', 'success');
            return true;
        } else {
            showNotification('Error', result.error, 'error');
            return false;
        }
    }
}

const adminManager = new AdminManager();
