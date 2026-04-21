// JavaScript for ExploreEase packages page

document.addEventListener('DOMContentLoaded', function() {
    // API base URL - update this with your actual API URL when deploying
    const API_BASE_URL = '/tour/api';
    
    // DOM elements
    const packagesContainer = document.getElementById('packages-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const sortBtns = document.querySelectorAll('.sort-btn');
    const alertContainer = document.getElementById('alert-container');
    const packageModal = document.getElementById('packageModal');
    const packageDetails = document.getElementById('package-details');
    const bookNowBtn = document.getElementById('book-now-btn');
    
    // Current packages data
    let packagesData = [];
    
    // Check if we have a specific package ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    // Load all packages
    loadPackages();
    
    // Event listeners
    searchBtn.addEventListener('click', filterPackages);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterPackages();
        }
    });
    
    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sortType = this.getAttribute('data-sort');
            sortPackages(sortType);
            
            // Update active state
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    /* Load all packages from API*/
    function loadPackages() {
        packagesContainer.innerHTML = `
            <div class="col-12 text-center spinner-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
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
                displayPackages(packages);
                
                // If we have a package ID in the URL, show its details
                if (packageId) {
                    const selectedPackage = packages.find(p => p.id == packageId);
                    if (selectedPackage) {
                        showPackageDetails(selectedPackage);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching packages:', error);
                showAlert('Failed to load packages. Please try again later.', 'danger');
                packagesContainer.innerHTML = '';
            });
    }
    
    /**
     * Display packages in the container
     * @param {Array} packages - Array of package objects
     */
    function displayPackages(packages) {
        // Clear container
        packagesContainer.innerHTML = '';
        
        if (packages.length === 0) {
            packagesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p>No tour packages found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        // Create package cards
        packages.forEach(package => {
            const packageCard = createPackageCard(package);
            packagesContainer.appendChild(packageCard);
        });
    }
    
    /**
     * Create a package card element
     * @param {Object} package - The package data
     * @returns {HTMLElement} - The package card element
     */
    function createPackageCard(package) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';
        
        // Format date
        const startDate = new Date(package.start_date);
        const formattedDate = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create card HTML
        // Determine which image to use based on location
        let imagePath = 'images/image.png'; // Default image
        
        if (package.location.toLowerCase().includes('himalaya')) {
            imagePath = 'images/Himalayas.jpg';
        } else if (package.location.toLowerCase().includes('kerala') || package.location.toLowerCase().includes('backwater')) {
            imagePath = 'images/Kerala backwaters.jpg';
        } else if (package.location.toLowerCase().includes('mumbai') || package.location.toLowerCase().includes('gateway')) {
            imagePath = 'images/Gateway of India.jpg';
        } else if (package.location.toLowerCase().includes('rajasthan') || package.location.toLowerCase().includes('fort')) {
            imagePath = 'images/Rajasthan forts.jpg';
        }else if (package.location.toLowerCase().includes('Tajmahal') || package.location.toLowerCase().includes('tajmahal')) {
            imagePath = 'images/taj mahal.jpg';
        }
        
        col.innerHTML = `
            <div class="card package-card h-100">
                <div class="card-img-top" style="height: 200px; overflow: hidden;">
                    <img src="${imagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" alt="${package.location}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${package.package_name}</h5>
                    <p class="package-location mb-2">
                        <i class="fas fa-map-marker-alt me-2"></i>${package.location}
                    </p>
                    <p class="package-date mb-2">
                        <i class="fas fa-calendar-alt me-2"></i>${formattedDate}
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="package-price">₹${parseFloat(package.price).toFixed(2)}</span>
                        <span class="seats-available">${package.seats} seats left</span>
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-outline-primary w-100 view-details-btn" data-id="${package.id}">
                        View Details
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to view details button
        col.querySelector('.view-details-btn').addEventListener('click', function() {
            const packageId = this.getAttribute('data-id');
            const selectedPackage = packagesData.find(p => p.id == packageId);
            if (selectedPackage) {
                showPackageDetails(selectedPackage);
            }
        });
        
        return col;
    }
    
    /**
     * Show package details in modal
     * @param {Object} package - The package data
     */
    function showPackageDetails(package) {
        // Format date
        const startDate = new Date(package.start_date);
        const formattedDate = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Determine which image to use based on location
        let imagePath = 'images/image.png'; // Default image
        
        if (package.location.toLowerCase().includes('himalaya')) {
            imagePath = 'images/Himalayas.jpg';
        } else if (package.location.toLowerCase().includes('kerala') || package.location.toLowerCase().includes('backwater')) {
            imagePath = 'images/Kerala backwaters.jpg';
        } else if (package.location.toLowerCase().includes('mumbai') || package.location.toLowerCase().includes('gateway')) {
            imagePath = 'images/Gateway of India.jpg';
        } else if (package.location.toLowerCase().includes('rajasthan') || package.location.toLowerCase().includes('fort')) {
            imagePath = 'images/Rajasthan forts.jpg';
        }else if (package.location.toLowerCase().includes('Tajmahal') || package.location.toLowerCase().includes('tajmahal')) {
            imagePath = 'images/taj mahal.jpg';
        }
        
        // Update modal content
        packageDetails.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-4 mb-md-0">
                    <div style="height: 250px; overflow: hidden;">
                        <img src="${imagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" alt="${package.location}">
                    </div>
                </div>
                <div class="col-md-6">
                    <h3>${package.package_name}</h3>
                    <p class="package-location mb-2">
                        <i class="fas fa-map-marker-alt me-2"></i>${package.location}
                    </p>
                    <p class="package-date mb-2">
                        <i class="fas fa-calendar-alt me-2"></i>${formattedDate}
                    </p>
                    <p class="mb-2">
                        <i class="fas fa-users me-2"></i>${package.seats} seats available
                    </p>
                    <h4 class="package-price mt-3">₹${parseFloat(package.price).toFixed(2)}</h4>
                </div>
            </div>
            <hr>
            <div class="row mt-4">
                <div class="col-12">
                    <h4>Package Description</h4>
                    <p>Experience the beauty of ${package.location} with our exclusive tour package. This package includes accommodation, guided tours, and transportation. Don't miss this opportunity to create unforgettable memories!</p>
                    
                    <h4 class="mt-4">What's Included</h4>
                    <ul>
                        <li>Round-trip transportation</li>
                        <li>Accommodation in premium hotels</li>
                        <li>Daily breakfast and dinner</li>
                        <li>Guided tours with experienced local guides</li>
                        <li>All entrance fees to attractions</li>
                        <li>24/7 customer support</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Update book now button with package ID
        bookNowBtn.setAttribute('data-id', package.id);
        
        // Show modal
        const modal = new bootstrap.Modal(packageModal);
        modal.show();
    }
    
    /**
     * Filter packages based on search input
     */
    function filterPackages() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            displayPackages(packagesData);
            return;
        }
        
        const filteredPackages = packagesData.filter(package => {
            return (
                package.package_name.toLowerCase().includes(searchTerm) ||
                package.location.toLowerCase().includes(searchTerm)
            );
        });
        
        displayPackages(filteredPackages);
    }
    
    /**
     * Sort packages based on sort type
     * @param {string} sortType - The sort type (price-asc, price-desc)
     */
    function sortPackages(sortType) {
        let sortedPackages = [...packagesData];
        
        switch (sortType) {
            case 'price-asc':
                sortedPackages.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                sortedPackages.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            default:
                break;
        }
        
        displayPackages(sortedPackages);
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
    
    // Book Now button event listener
    bookNowBtn.addEventListener('click', function() {
        const packageId = this.getAttribute('data-id');
        alert(`Booking functionality would be implemented here for package ID: ${packageId}`);
        // Close modal
        const modal = bootstrap.Modal.getInstance(packageModal);
        modal.hide();
    });
});