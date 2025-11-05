# Test New Doctor Registration
Write-Host "Testing Doctor Registration..." -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"

# Register a new doctor
$newDoctorData = @{
    email = "testdoctor@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "Neurologist"
    role = "doctor"
    specialization = "Neurology"
    licenseNumber = "MD888888"
    yearsOfExperience = 7
    consultationFee = 180
    bio = "Experienced neurologist specializing in brain disorders"
} | ConvertTo-Json

try {
    Write-Host "Registering new doctor..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $newDoctorData -ContentType "application/json" -UseBasicParsing
    
    if ($response.StatusCode -eq 201) {
        Write-Host "PASS: Doctor Registration" -ForegroundColor Green
        
        # Wait a moment for the registration to complete
        Start-Sleep -Seconds 1
        
        # Check if doctor appears in the list
        Write-Host "Checking if doctor appears in list..." -ForegroundColor Yellow
        $doctorsResponse = Invoke-WebRequest -Uri "$baseUrl/debug/doctors" -UseBasicParsing
        $doctorsData = $doctorsResponse.Content | ConvertFrom-Json
        
        Write-Host "Total Doctors Now: $($doctorsData.totalDoctors)" -ForegroundColor Cyan
        
        # Check if our new doctor is in the list
        $newDoctor = $doctorsData.doctors | Where-Object { $_.name -like "*Test Neurologist*" }
        if ($newDoctor) {
            Write-Host "PASS: New doctor found in list!" -ForegroundColor Green
            Write-Host "Doctor Name: $($newDoctor.name)" -ForegroundColor Yellow
            Write-Host "Specialization: $($newDoctor.specialization)" -ForegroundColor Yellow
        } else {
            Write-Host "FAIL: New doctor not found in list" -ForegroundColor Red
        }
        
        # Test if doctor appears in public doctors endpoint
        Write-Host "Checking public doctors endpoint..." -ForegroundColor Yellow
        $publicDoctorsResponse = Invoke-WebRequest -Uri "$baseUrl/doctors" -UseBasicParsing
        $publicDoctorsData = $publicDoctorsResponse.Content | ConvertFrom-Json
        
        $publicNewDoctor = $publicDoctorsData.doctors | Where-Object { $_.name -like "*Test Neurologist*" }
        if ($publicNewDoctor) {
            Write-Host "PASS: New doctor available for booking!" -ForegroundColor Green
        } else {
            Write-Host "FAIL: New doctor not available for booking" -ForegroundColor Red
        }
        
    } else {
        Write-Host "FAIL: Doctor Registration (Status: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "FAIL: Doctor Registration - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Registration Test Complete!" -ForegroundColor Cyan