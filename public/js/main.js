// Main JavaScript for ExploreEase homepage

document.addEventListener('DOMContentLoaded', function() {
    // API base URL - update this with your actual API URL when deploying
    const API_BASE_URL = '/tour/api';
    
    // Load featured packages on homepage
    loadFeaturedPackages();
    
    /**
     * Load featured packages for homepage
     */
    function loadFeaturedPackages() {
        const featuredPackagesContainer = document.getElementById('featured-packages');
        
        // Make API request to get packages
        fetch(`${API_BASE_URL}/packages`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(packages => {
                // Clear loading spinner
                featuredPackagesContainer.innerHTML = '';
                
                // If no packages, show message
                if (packages.length === 0) {
                    featuredPackagesContainer.innerHTML = `
                        <div class="col-12 text-center">
                            <p>No tour packages available at the moment. Please check back later.</p>
                        </div>
                    `;
                    return;
                }
                
                // Display up to 6 featured packages
                const featuredPackages = packages.slice(0, 6);
                
                // Create HTML for each package
                featuredPackages.forEach(package => {
                    const packageCard = createPackageCard(package);
                    featuredPackagesContainer.appendChild(packageCard);
                });
            })
            .catch(error => {
                console.error('Error fetching packages:', error);
                featuredPackagesContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-danger" role="alert">
                            Failed to load packages. Please try again later.
                        </div>
                    </div>
                `;
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
                    <a href="packages.html?id=${package.id}" class="btn btn-outline-primary w-100">View Details</a>
                </div>
            </div>
        `;
        
        return col;
    }
});