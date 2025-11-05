# Healthcare System API Tests
Write-Host "Starting API Tests..." -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"

# Test 1: Health Check
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "PASS: Health Check" -ForegroundColor Green
    }
} catch {
    Write-Host "FAIL: Health Check" -ForegroundColor Red
}

# Test 2: Get Doctors
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/doctors" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "PASS: Get Doctors" -ForegroundColor Green
    }
} catch {
    Write-Host "FAIL: Get Doctors" -ForegroundColor Red
}

# Test 3: Debug Doctors
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/debug/doctors" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "PASS: Debug Doctors" -ForegroundColor Green
        $content = $response.Content | ConvertFrom-Json
        Write-Host "Total Doctors: $($content.totalDoctors)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "FAIL: Debug Doctors" -ForegroundColor Red
}

# Test 4: Login Test
try {
    $loginData = @{
        email = "patient@demo.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "PASS: Patient Login" -ForegroundColor Green
    }
} catch {
    Write-Host "FAIL: Patient Login" -ForegroundColor Red
}

Write-Host "API Tests Complete!" -ForegroundColor Cyan