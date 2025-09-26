// IT Support Booking System JavaScript

class ITSupportBooking {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.availableTimeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00'
        ];
        
        this.init();
    }

    init() {
        this.renderCalendar();
        this.attachEventListeners();
        this.updateCurrentMonth();
    }

    attachEventListeners() {
        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updateCurrentMonth();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updateCurrentMonth();
        });

        // Form submission
        document.getElementById('booking-form').addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Form reset
        document.getElementById('reset-form').addEventListener('click', () => {
            this.resetForm();
        });

        // Real-time validation
        const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    updateCurrentMonth() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const currentMonthElement = document.getElementById('current-month');
        currentMonthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const headerDay = document.createElement('div');
            headerDay.className = 'calendar-header-day';
            headerDay.textContent = day;
            calendar.appendChild(headerDay);
        });

        // Calculate first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const today = new Date();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendar.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const currentDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            
            // Mark today
            if (this.isSameDay(currentDay, today)) {
                dayElement.classList.add('today');
            }

            // Disable past dates and weekends for booking
            if (currentDay < today || currentDay.getDay() === 0 || currentDay.getDay() === 6) {
                dayElement.classList.add('unavailable');
            } else {
                dayElement.addEventListener('click', () => {
                    this.selectDate(currentDay, dayElement);
                });
            }

            calendar.appendChild(dayElement);
        }
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Select new date
        element.classList.add('selected');
        this.selectedDate = date;

        // Show time slots
        this.renderTimeSlots();
    }

    renderTimeSlots() {
        const timeSlotsContainer = document.getElementById('time-slots');
        const slotsGrid = document.getElementById('slots-grid');
        
        timeSlotsContainer.style.display = 'block';
        slotsGrid.innerHTML = '';

        this.availableTimeSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;

            // Simulate some unavailable slots
            const isUnavailable = Math.random() < 0.3; // 30% chance of being unavailable
            if (isUnavailable) {
                slot.classList.add('unavailable');
            } else {
                slot.addEventListener('click', () => {
                    this.selectTimeSlot(time, slot);
                });
            }

            slotsGrid.appendChild(slot);
        });
    }

    selectTimeSlot(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Select new time
        element.classList.add('selected');
        this.selectedTime = time;

        // Update hidden field
        const dateTimeString = `${this.selectedDate.toDateString()} at ${this.selectedTime}`;
        document.getElementById('selected-datetime').value = dateTimeString;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation (optional but if provided should be valid)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        // Remove existing error message
        this.clearFieldError(field);

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#000000';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.fontWeight = 'bold';

        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate date and time selection
        if (!this.selectedDate || !this.selectedTime) {
            isValid = false;
            this.showMessage('Please select a date and time for your appointment.', 'error');
        }

        // Validate GDPR consent checkboxes
        const dataProcessing = document.getElementById('data-processing');
        const dataStorage = document.getElementById('data-storage');

        if (!dataProcessing.checked || !dataStorage.checked) {
            isValid = false;
            this.showMessage('Please accept the required GDPR consent terms.', 'error');
        }

        return isValid;
    }

    handleFormSubmission(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        // Simulate form processing
        this.showLoadingState(true);

        // Collect form data
        const formData = new FormData(event.target);
        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            issueType: formData.get('issue-type'),
            description: formData.get('description'),
            urgency: formData.get('urgency'),
            selectedDateTime: formData.get('selected-datetime'),
            dataProcessingConsent: formData.get('data-processing') === 'on',
            dataStorageConsent: formData.get('data-storage') === 'on',
            marketingConsent: formData.get('marketing-consent') === 'on'
        };

        // Simulate API call
        setTimeout(() => {
            this.showLoadingState(false);
            this.showMessage('Your IT support booking has been successfully submitted! We will contact you shortly to confirm your appointment.', 'success');
            console.log('Booking submitted:', bookingData);

            // Optionally reset form after successful submission
            setTimeout(() => {
                this.resetForm();
            }, 3000);
        }, 2000);
    }

    showLoadingState(isLoading) {
        const form = document.getElementById('booking-form');
        const submitButton = document.querySelector('.btn-primary');

        if (isLoading) {
            form.classList.add('loading');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
        } else {
            form.classList.remove('loading');
            submitButton.textContent = 'Book IT Support';
            submitButton.disabled = false;
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Insert at the top of the form
        const form = document.getElementById('booking-form');
        form.insertBefore(messageElement, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    resetForm() {
        // Reset form fields
        document.getElementById('booking-form').reset();

        // Clear selections
        this.selectedDate = null;
        this.selectedTime = null;

        // Clear calendar selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Hide time slots
        document.getElementById('time-slots').style.display = 'none';

        // Clear hidden field
        document.getElementById('selected-datetime').value = '';

        // Clear error messages
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

        // Clear any messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        this.showMessage('Form has been reset successfully.', 'success');
    }
}

// Initialize the booking system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ITSupportBooking();
});

// Add some CSS for error states
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #000000 !important;
        background-color: #fff5f5 !important;
    }
    
    .field-error {
        color: #000000;
        font-size: 0.9rem;
        margin-top: 0.25rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);