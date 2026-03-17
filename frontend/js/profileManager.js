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

        profileContainer.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">${user.firstName?.charAt(0)}</div>
                    <div class="profile-info">
                        <h2>${user.firstName} ${user.lastName}</h2>
                        <p class="profile-email">${user.email}</p>
                        <p class="profile-role">${user.role.toUpperCase()}</p>
                    </div>
                </div>
                <div class="profile-details">
                    <p><strong>Student/Staff ID:</strong> ${user.studentId}</p>
                    <p><strong>Department:</strong> ${user.department}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Bio:</strong> ${user.bio || 'No bio provided'}</p>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="showEditProfile()">Edit Profile</button>
                    <button class="btn btn-secondary" onclick="showChangePassword()">Change Password</button>
                    <button class="btn btn-danger" onclick="confirmDeactivate()">Deactivate Account</button>
                </div>
            </div>
        `;
    }
}

const profileManager = new UserProfileManager();
