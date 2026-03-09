// Event management utilities

class EventManager {
    async loadEvents(category = 'all', page = 1, search = '') {
        const result = await eventAPI.getAll(category, page, PAGE_LIMIT, search);
        if (result.success) {
            return {
                events: result.data.events,
                total: result.data.total,
                pages: result.data.pages
            };
        }
        return { events: [], total: 0, pages: 0 };
    }

    async getEvent(id) {
        const result = await eventAPI.getById(id);
        if (result.success) {
            return result.data.event;
        }
        return null;
    }

    async createEvent(eventData) {
        const result = await eventAPI.create(eventData);
        return result;
    }

    async updateEvent(id, eventData) {
        const result = await eventAPI.update(id, eventData);
        return result;
    }

    async deleteEvent(id) {
        const result = await eventAPI.delete(id);
        return result;
    }

    async getMyEvents() {
        const result = await eventAPI.getMyEvents();
        if (result.success) {
            return result.data.events;
        }
        return [];
    }

    displayEvents(events, container = 'eventsGrid') {
        const grid = document.getElementById(container);
        if (!grid) return;

        grid.innerHTML = '';

        if (events.length === 0) {
            grid.innerHTML = `<div class="empty-state">
                <h3>No events found</h3>
                <p>Check back later for new events!</p>
            </div>`;
            return;
        }

        events.forEach(event => {
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            const category = event.category || 'other';

            const card = document.createElement('div');
            card.className = 'event-card';
            card.setAttribute('data-event-id', event._id);

            let html = `
                <div class="event-image" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                    📅
                </div>
                <span class="event-category category-${category}">${category.toUpperCase()}</span>
                <div class="event-title">${event.title}</div>
                <div class="event-details">📅 ${new Date(event.date).toLocaleDateString()}</div>
                <div class="event-details">⏰ ${event.time}</div>
                <div class="event-details">📍 ${event.location}</div>
                <div class="event-details">👥 ${event.registeredCount}/${event.capacity}</div>
            `;

            if (event.rating > 0) {
                html += `<div class="event-rating">
                    <span class="stars">${'⭐'.repeat(Math.round(event.rating))}</span>
                    <span>(${event.rating})</span>
                </div>`;
            }

            if (event.isRegistered) {
                html += `<span class="badge badge-success">✓ Registered</span>`;
            }

            if (isPast) {
                html += `<span class="badge badge-danger">Past Event</span>`;
            }

            html += `<div class="event-actions">
                <button class="btn btn-info" onclick="eventManager.viewEvent('${event._id}')">View Details</button>`;

            if (!event.isRegistered && !isPast) {
                html += `<button class="btn btn-success" onclick="eventManager.registerEvent('${event._id}')">Register</button>`;
            }

            if (event.isRegistered) {
                html += `<button class="btn btn-warning" onclick="eventManager.viewTicket('${event._id}')">View Ticket</button>`;
            }

            html += `</div>`;

            card.innerHTML = html;
            grid.appendChild(card);
        });
    }

    async viewEvent(eventId) {
        const event = await this.getEvent(eventId);
        if (!event) {
            showNotification('Error', 'Event not found', 'error');
            return;
        }

        const modal = document.getElementById('eventModal');
        const content = document.getElementById('modalEventContent');

        content.innerHTML = `
            <div class="event-details-modal">
                <h3>${event.title}</h3>
                <span class="event-category category-${event.category}">${event.category.toUpperCase()}</span>
                <p>${event.description}</p>
                <p><strong>📅 Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p><strong>⏰ Time:</strong> ${event.time}</p>
                <p><strong>📍 Location:</strong> ${event.location}</p>
                <p><strong>👥 Capacity:</strong> ${event.registeredCount}/${event.capacity}</p>
                <p><strong>👤 Organizer:</strong> ${event.organizer?.firstName} ${event.organizer?.lastName}</p>
            </div>
        `;

        modal.classList.add('active');
    }

    async registerEvent(eventId) {
        const result = await registrationAPI.register(eventId);
        if (result.success) {
            showNotification('Success', 'Registered for event!', 'success');
            // Reload events
            const events = await this.loadEvents();
            this.displayEvents(events.events);
        } else {
            showNotification('Error', result.error, 'error');
        }
    }

    async viewTicket(eventId) {
        const result = await registrationAPI.getMyRegistration(eventId);
        if (result.success) {
            const modal = document.getElementById('eventModal');
            const content = document.getElementById('modalEventContent');

            const reg = result.data.registration;
            content.innerHTML = `
                <div class="qr-code-container">
                    <h3>Your Event Ticket</h3>
                    <p><strong>${reg.event.title}</strong></p>
                    <div class="qr-code">📱</div>
                    <p><strong>Ticket ID:</strong> ${reg.ticketId}</p>
                    <p><strong>Status:</strong> ${reg.status}</p>
                </div>
            `;

            modal.classList.add('active');
        }
    }
}

const eventManager = new EventManager();
const PAGE_LIMIT = 20;
