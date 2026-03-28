// Certificate management utilities

class CertificateManager {
    async generateCertificate(eventId) {
        const result = await certificateAPI.generate(eventId);
        return result;
    }

    async getUserCertificates(userId) {
        const result = await certificateAPI.getUserCertificates(userId);
        if (result.success) {
            return result.data.certificates;
        }
        return [];
    }

    async getCertificate(certificateId) {
        const result = await certificateAPI.get(certificateId);
        if (result.success) {
            return result.data.certificate;
        }
        return null;
    }

    displayCertificates(certificates, container = 'certificatesContainer') {
        const el = document.getElementById(container);
        if (!el) return;

        if (certificates.length === 0) {
            el.innerHTML = '<p class="empty-state">No certificates earned yet. Attend more events!</p>';
            return;
        }

        el.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'certificates-grid';

        certificates.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'certificate-card';

            const icon = document.createElement('div');
            icon.className = 'certificate-icon';
            icon.textContent = '🏆';
            card.appendChild(icon);

            const title = document.createElement('h4');
            title.textContent = cert.title || 'Certificate';
            card.appendChild(title);

            const eventInfo = document.createElement('p');
            eventInfo.innerHTML = `<strong>Event:</strong> ${cert.event?.title || 'Unknown'}`;
            card.appendChild(eventInfo);

            const issued = document.createElement('p');
            issued.innerHTML = `<strong>Issued:</strong> ${new Date(cert.issueDate).toLocaleDateString()}`;
            card.appendChild(issued);

            const downloadButton = document.createElement('button');
            downloadButton.className = 'btn btn-primary btn-sm';
            downloadButton.type = 'button';
            downloadButton.textContent = 'Download';
            downloadButton.addEventListener('click', () => this.downloadCertificate(cert.certificateId));
            card.appendChild(downloadButton);

            grid.appendChild(card);
        });

        el.appendChild(grid);
    }

    async downloadCertificate(certificateId) {
        const cert = await this.getCertificate(certificateId);
        if (!cert) {
            showNotification('Error', 'Certificate not found', 'error');
            return;
        }

        // Create a simple text certificate for download
        const content = `
CERTIFICATE OF PARTICIPATION
${'='.repeat(40)}

This is to certify that

${cert.user?.firstName} ${cert.user?.lastName}

Has successfully participated in the event

${cert.event?.title}

Held on ${new Date(cert.issueDate).toLocaleDateString()}

Certificate ID: ${certificateId}

${'='.repeat(40)}
        `;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', `${certificateId}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        showNotification('Success', 'Certificate downloaded!', 'success');
    }

    async requestCertificate(eventId) {
        const result = await this.generateCertificate(eventId);
        if (result.success) {
            showNotification('Success', 'Certificate generated!', 'success');
            return result.data.certificate;
        } else {
            showNotification('Error', result.error, 'error');
            return null;
        }
    }
}

const certificateManager = new CertificateManager();
