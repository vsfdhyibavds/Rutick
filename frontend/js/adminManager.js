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

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Student ID</th>
                        <th>Status</th>
                        <th>Registered At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        registrations.forEach(reg => {
            const statusBadge = reg.status === 'checked-in'
                ? '<span class="badge badge-success">Checked In</span>'
                : '<span class="badge badge-warning">Registered</span>';

            html += `
                <tr>
                    <td>${reg.user?.firstName} ${reg.user?.lastName}</td>
                    <td>${reg.user?.email}</td>
                    <td>${reg.user?.studentId}</td>
                    <td>${statusBadge}</td>
                    <td>${new Date(reg.registeredAt).toLocaleDateString()}</td>
                    <td>
                        ${reg.status === 'registered' ?
                            `<button class="btn btn-sm btn-success" onclick="adminManager.checkInAttendee('${reg._id}')">Check In</button>`
                            : 'Checked In'}
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        el.innerHTML = html;
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
