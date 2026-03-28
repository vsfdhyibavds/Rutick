// Profile management utilities

class UserProfileManager {
    async loadProfile(userId) {
        const result = await userAPI.getProfile(userId);
        if (result.success) {
            return result.data.user;
        }
        return null;
    }

    async updateProfile(userData) {
        const result = await userAPI.updateProfile(userData);
        return result;
    }

    async changePassword(currentPassword, newPassword) {
        const result = await userAPI.changePassword(currentPassword, newPassword);
        return result;
    }

    async getAttendanceRecord(userId) {
        const result = await userAPI.getAttendance(userId);
        if (result.success) {
            return result.data.attendanceRecord;
        }
        return [];
    }

    async getDashboardStats() {
        const result = await userAPI.getDashboardStats();
        if (result.success) {
            return result.data.stats;
        }
        return null;
    }

    async deactivateAccount() {
        const result = await userAPI.deactivateAccount();
        return result;
    }

    displayProfile(user) {
        const profileContainer = document.getElementById('profileContainer');
        if (!profileContainer) return;

        profileContainer.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'profile-card';

        const header = document.createElement('div');
        header.className = 'profile-header';

        const avatar = document.createElement('div');
        avatar.className = 'profile-avatar';
        avatar.textContent = user.firstName?.charAt(0) || '?';
        header.appendChild(avatar);

        const info = document.createElement('div');
        info.className = 'profile-info';

        const name = document.createElement('h2');
        name.textContent = `${user.firstName || ''} ${user.lastName || ''}`;
        info.appendChild(name);

        const email = document.createElement('p');
        email.className = 'profile-email';
        email.textContent = user.email || '';
        info.appendChild(email);

        const role = document.createElement('p');
        role.className = 'profile-role';
        role.textContent = user.role?.toUpperCase() || '';
        info.appendChild(role);

        header.appendChild(info);
        card.appendChild(header);

        const details = document.createElement('div');
        details.className = 'profile-details';
        details.innerHTML = `
            <p><strong>Student/Staff ID:</strong> ${user.studentId || ''}</p>
            <p><strong>Department:</strong> ${user.department || ''}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
            <p><strong>Bio:</strong> ${user.bio || 'No bio provided'}</p>
        `;
        card.appendChild(details);

        const actions = document.createElement('div');
        actions.className = 'profile-actions';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-primary';
        editButton.type = 'button';
        editButton.textContent = 'Edit Profile';
        editButton.addEventListener('click', () => this.showEditProfile());
        actions.appendChild(editButton);

        const changePasswordButton = document.createElement('button');
        changePasswordButton.className = 'btn btn-secondary';
        changePasswordButton.type = 'button';
        changePasswordButton.textContent = 'Change Password';
        changePasswordButton.addEventListener('click', () => this.showChangePassword());
        actions.appendChild(changePasswordButton);

        const deactivateButton = document.createElement('button');
        deactivateButton.className = 'btn btn-danger';
        deactivateButton.type = 'button';
        deactivateButton.textContent = 'Deactivate Account';
        deactivateButton.addEventListener('click', () => this.confirmDeactivate());
        actions.appendChild(deactivateButton);

        card.appendChild(actions);
        profileContainer.appendChild(card);
    }

    async showEditProfile() {
        showNotification('Info', 'Profile editing is not implemented yet.', 'info');
    }

    async showChangePassword() {
        showNotification('Info', 'Password change flow is not implemented yet.', 'info');
    }

    async confirmDeactivate() {
        const confirmed = window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.');
        if (!confirmed) return;

        const result = await this.deactivateAccount();
        if (result.success) {
            showNotification('Success', 'Account deactivated.', 'success');
            logout();
        } else {
            showNotification('Error', result.error || 'Failed to deactivate account.', 'error');
        }
    }
}

const profileManager = new UserProfileManager();
