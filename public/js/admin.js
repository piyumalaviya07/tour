// JavaScript for ExploreEase admin page

document.addEventListener('DOMContentLoaded', function() {
    // API base URL - update this with your actual API URL when deploying
    const API_BASE_URL = '/tour/api';
    
    // DOM elements
    const managePackagesSection = document.getElementById('manage-packages-section');
    const packageFormSection = document.getElementById('package-form-section');
    const packagesTableBody = document.getElementById('packages-table-body');
    const packagesLoading = document.getElementById('packages-loading');
    const noPackagesMessage = document.getElementById('no-packages-message');
    const packageForm = document.getElementById('package-form');
    const formTitle = document.getElementById('form-title');
    const packageIdInput = document.getElementById('package-id');
    const packageNameInput = document.getElementById('package-name');
    const locationInput = document.getElementById('location');
    const priceInput = document.getElementById('price');
    const startDateInput = document.getElementById('start-date');
    const seatsInput = document.getElementById('seats');
    const alertContainer = document.getElementById('alert-container');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // Navigation elements
    const managePackagesLink = document.getElementById('manage-packages-link');
    const addPackageLink = document.getElementById('add-package-link');
    const addPackageBtn = document.getElementById('add-package-btn');
    const backToPackagesBtn = document.getElementById('back-to-packages-btn');
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    
    // Current packages data
    let packagesData = [];
    let packageToDelete = null;
    
    // Load all packages
    loadPackages();
    
    // Event listeners for navigation
    managePackagesLink.addEventListener('click', function(e) {
        e.preventDefault();
        showManagePackagesSection();
    });
    
    addPackageLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAddPackageForm();
    });
    
    addPackageBtn.addEventListener('click', showAddPackageForm);
    backToPackagesBtn.addEventListener('click', showManagePackagesSection);
    cancelFormBtn.addEventListener('click', showManagePackagesSection);
    
    // Package form submission
    packageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        savePackage();
    });
    
    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', function() {
        if (packageToDelete) {
            deletePackage(packageToDelete);
        }
    });
    
    /**
     * Load all packages from API
     */
    function loadPackages() {
        // Show loading spinner
        packagesLoading.style.display = 'block';
        noPackagesMessage.style.display = 'none';
        packagesTableBody.innerHTML = '';
        
        // Fetch packages from API
        fetch(`${API_BASE_URL}/packages`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(packages => {
                packagesData = packages;
                displayPackagesTable(packages);
            })
            .catch(error => {
                console.error('Error fetching packages:', error);
                showAlert('Failed to load packages. Please try again later.', 'danger');
                packagesLoading.style.display = 'none';
            });
    }
    
    /**
     * Display packages in the table
     * @param {Array} packages - Array of package objects
     */
    function displayPackagesTable(packages) {
        // Hide loading spinner
        packagesLoading.style.display = 'none';
        
        // Clear table body
        packagesTableBody.innerHTML = '';
        
        if (packages.length === 0) {
            noPackagesMessage.style.display = 'block';
            return;
        }
        
        noPackagesMessage.style.display = 'none';
        
        // Create table rows
        packages.forEach(package => {
            const row = document.createElement('tr');
            
            // Format date
            const startDate = new Date(package.start_date);
            const formattedDate = startDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${package.id}</td>
                <td>${package.package_name}</td>
                <td>${package.location}</td>
                <td>₹${parseFloat(package.price).toFixed(2)}</td>
                <td>${formattedDate}</td>
                <td>${package.seats}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${package.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${package.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            packagesTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const packageId = this.getAttribute('data-id');
                editPackage(packageId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const packageId = this.getAttribute('data-id');
                confirmDelete(packageId);
            });
        });
    }
    
    /**
     * Show the add package form
     */
    function showAddPackageForm() {
        // Update navigation
        managePackagesLink.classList.remove('active');
        addPackageLink.classList.add('active');
        
        // Update form title
        formTitle.textContent = 'Add New Package';
        
        // Reset form
        packageForm.reset();
        packageIdInput.value = '';
        
        // Set minimum date for start date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        startDateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Clear validation errors
        clearValidationErrors();
        
        // Show form section, hide manage section
        managePackagesSection.style.display = 'none';
        packageFormSection.style.display = 'block';
    }
    
    /**
     * Show the edit package form
     * @param {string} packageId - The ID of the package to edit
     */
    function editPackage(packageId) {
        const package = packagesData.find(p => p.id == packageId);
        
        if (!package) {
            showAlert('Package not found', 'danger');
            return;
        }
        
        // Update navigation
        managePackagesLink.classList.remove('active');
        addPackageLink.classList.add('active');
        
        // Update form title
        formTitle.textContent = 'Edit Package';
        
        // Fill form with package data
        packageIdInput.value = package.id;
        packageNameInput.value = package.package_name;
        locationInput.value = package.location;
        priceInput.value = package.price;
        startDateInput.value = package.start_date;
        seatsInput.value = package.seats;
        
        // Set minimum date for start date (today)
        const today = new Date();
        startDateInput.min = today.toISOString().split('T')[0];
        
        // Clear validation errors
        clearValidationErrors();
        
        // Show form section, hide manage section
        managePackagesSection.style.display = 'none';
        packageFormSection.style.display = 'block';
    }
    
    /**
     * Show the manage packages section
     */
    function showManagePackagesSection() {
        // Update navigation
        managePackagesLink.classList.add('active');
        addPackageLink.classList.remove('active');
        
        // Show manage section, hide form section
        packageFormSection.style.display = 'none';
        managePackagesSection.style.display = 'block';
        
        // Reload packages
        loadPackages();
    }
    
    /**
     * Save package (create or update)
     */
    function savePackage() {
        // Clear validation errors
        clearValidationErrors();
        
        // Get form data
        const packageId = packageIdInput.value.trim();
        const packageData = {
            package_name: packageNameInput.value.trim(),
            location: locationInput.value.trim(),
            price: parseFloat(priceInput.value),
            start_date: startDateInput.value,
            seats: parseInt(seatsInput.value)
        };
        
        // Client-side validation
        const errors = validatePackageData(packageData);
        
        if (Object.keys(errors).length > 0) {
            // Display validation errors
            for (const field in errors) {
                const errorElement = document.getElementById(`${field.replace('_', '-')}-error`);
                if (errorElement) {
                    errorElement.textContent = errors[field];
                }
            }
            return;
        }
        
        // Determine if creating or updating
        const isUpdate = packageId !== '';
        const url = isUpdate ? `${API_BASE_URL}/packages/${packageId}` : `${API_BASE_URL}/packages`;
        const method = isUpdate ? 'PUT' : 'POST';
        
        // Send API request
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(packageData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to save package');
                });
            }
            return response.json();
        })
        .then(data => {
            showAlert(`Package ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
            showManagePackagesSection();
        })
        .catch(error => {
            console.error('Error saving package:', error);
            showAlert(error.message || 'Failed to save package. Please try again.', 'danger');
        });
    }
    
    /**
     * Confirm package deletion
     * @param {string} packageId - The ID of the package to delete
     */
    function confirmDelete(packageId) {
        packageToDelete = packageId;
        const modal = new bootstrap.Modal(deleteModal);
        modal.show();
    }
    
    /**
     * Delete a package
     * @param {string} packageId - The ID of the package to delete
     */
    function deletePackage(packageId) {
        fetch(`${API_BASE_URL}/packages/${packageId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to delete package');
                });
            }
            return response.json();
        })
        .then(data => {
            // Close modal
            const modal = bootstrap.Modal.getInstance(deleteModal);
            modal.hide();
            
            // Reset packageToDelete
            packageToDelete = null;
            
            showAlert('Package deleted successfully', 'success');
            loadPackages();
        })
        .catch(error => {
            console.error('Error deleting package:', error);
            showAlert(error.message || 'Failed to delete package. Please try again.', 'danger');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(deleteModal);
            modal.hide();
            
            // Reset packageToDelete
            packageToDelete = null;
        });
    }
    
    /**
     * Validate package data
     * @param {Object} data - The package data to validate
     * @returns {Object} - Validation errors
     */
    function validatePackageData(data) {
        const errors = {};
        
        // Package name validation
        if (!data.package_name) {
            errors.package_name = 'Package name cannot be empty';
        }
        
        // Price validation
        if (isNaN(data.price) || data.price <= 0) {
            errors.price = 'Price must be numeric and greater than 0';
        }
        
        // Location validation
        if (!data.location) {
            errors.location = 'Location cannot be empty';
        }
        
        // Start date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(data.start_date);
        if (!data.start_date || startDate <= today) {
            errors.start_date = 'Start date must be a future date';
        }
        
        // Seats validation
        if (isNaN(data.seats) || data.seats <= 0 || !Number.isInteger(data.seats)) {
            errors.seats = 'Seats must be an integer greater than 0';
        }
        
        return errors;
    }
    
    /**
     * Clear validation errors
     */
    function clearValidationErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    /**
     * Show alert message
     * @param {string} message - The alert message
     * @param {string} type - The alert type (success, danger, etc.)
     */
    function showAlert(message, type = 'info') {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = alertContainer.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
});