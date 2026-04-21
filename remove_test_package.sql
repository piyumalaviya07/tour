-- SQL script to remove test package and ensure all packages are displayed

-- Remove the test package with ID 1756786433
DELETE FROM packages WHERE id = 1756786433;

-- Update any test packages with generic names to more specific Indian tour packages
UPDATE packages SET 
    package_name = 'Taj Mahal Moonlight Tour', 
    location = 'Agra, Taj Mahal', 
    price = 18000.00, 
    start_date = '2024-07-15', 
    seats = 20
WHERE package_name LIKE '%Test%';