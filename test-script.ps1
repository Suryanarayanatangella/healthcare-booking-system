# Healthcare Appointment Booking System - Automated Test Script
# PowerShell Test Script for API Endpoints

Write-Host "🧪 Starting Healthcare Booking System Tests..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"
$frontendUrl = "http://localhost:3000"
$testResults = @()

# Function to test API endpoint
function Test-ApiEndpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$TestName,
        [hashtable]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "✅ $TestName - PASSED" -ForegroundColor Green
            return @{ Test = $TestName; Status = "PASSED"; StatusCode = $response.StatusCode }
        } else {
            Write-Host "❌ $TestName - FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
            return @{ Test = $TestName; Status = "FAILED"; StatusCode = $response.StatusCode }
        }
    }
    catch {
        Write-Host "❌ $TestName - FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
        return @{ Test = $TestName; Status = "FAILED"; Error = $_.Exception.Message }
    }
}

# Test 1: System Health
Write-Host "`n🔍 Testing System Health..." -ForegroundColor Yellow
$testResults += Test-ApiEndpoint -Url "$baseUrl/health" -TestName "API Health Check"

# Test 2: Authentication Endpoints
Write-Host "`n🔐 Testing Authentication..." -ForegroundColor Yellow
$loginData = @{
    email = "patient@demo.com"
    password = "password123"
}
$testResults += Test-ApiEndpoint -Url "$baseUrl/auth/login" -Method "POST" -Body $loginData -TestName "Patient Login"

$doctorLoginData = @{
    email = "doctor@demo.com"
    password = "password123"
}
$testResults += Test-ApiEndpoint -Url "$baseUrl/auth/login" -Method "POST" -Body $doctorLoginData -TestName "Doctor Login"

# Test 3: Doctor Endpoints
Write-Host "`n👨‍⚕️ Testing Doctor Endpoints..." -ForegroundColor Yellow
$testResults += Test-ApiEndpoint -Url "$baseUrl/doctors" -TestName "Get Doctors List"
$testResults += Test-ApiEndpoint -Url "$baseUrl/doctors/meta/specializations" -TestName "Get Specializations"
$testResults += Test-ApiEndpoint -Url "$baseUrl/doctors/1" -TestName "Get Doctor Details"

# Test 4: Debug Endpoints
Write-Host "`n🔍 Testing Debug Endpoints..." -ForegroundColor Yellow
$testResults += Test-ApiEndpoint -Url "$baseUrl/debug/doctors" -TestName "Debug - Doctors List"
$testResults += Test-ApiEndpoint -Url "$baseUrl/debug/users" -TestName "Debug - Users List"

# Test 5: Appointment Endpoints
Write-Host "`n📅 Testing Appointment Endpoints..." -ForegroundColor Yellow
$testResults += Test-ApiEndpoint -Url "$baseUrl/appointments/doctor/1/availability?date=2024-12-01" -TestName "Get Available Slots"

# Test 6: Registration Test
Write-Host "`n📝 Testing Registration..." -ForegroundColor Yellow
$newDoctorData = @{
    email = "testdoctor@test.com"
    password = "password123"
    firstName = "Test"
    lastName = "Doctor"
    role = "doctor"
    specialization = "Neurology"
    licenseNumber = "MD999999"
    yearsOfExperience = 5
    consultationFee = 175
    bio = "Test doctor for automated testing"
}
$testResults += Test-ApiEndpoint -Url "$baseUrl/auth/register" -Method "POST" -Body $newDoctorData -TestName "Doctor Registration"

# Test 7: Verify New Doctor in List
Write-Host "`n🔄 Testing New Doctor Integration..." -ForegroundColor Yellow
Start-Sleep -Seconds 1  # Wait for registration to complete
$testResults += Test-ApiEndpoint -Url "$baseUrl/debug/doctors" -TestName "Verify New Doctor Added"

# Test Results Summary
Write-Host "`n📊 TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_.Status -eq "PASSED" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAILED" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passed / $total) * 100, 2))%" -ForegroundColor Yellow

if ($failed -gt 0) {
    Write-Host "`n❌ Failed Tests:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAILED" } | ForEach-Object {
        Write-Host "  - $($_.Test)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "    Error: $($_.Error)" -ForegroundColor DarkRed
        }
    }
}

Write-Host "`n🎯 Frontend URL: $frontendUrl" -ForegroundColor Cyan
Write-Host "🔗 Backend URL: $baseUrl" -ForegroundColor Cyan
Write-Host "`nTesting Complete!" -ForegroundColor Green