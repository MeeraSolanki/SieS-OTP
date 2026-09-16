# Publish-Android.ps1
# This script publishes the OTPGenerator.Mobile project for Android and generates a .apk file.

Write-Host "Publishing SI OTP Generator for Android..." -ForegroundColor Cyan

# Define relative path to the mobile csproj
$csprojPath = "OTPGenerator.Mobile\OTPGenerator.Mobile.csproj"

# Run dotnet clean to clear out cached assets and ensure the new icon is rebuilt
dotnet clean $csprojPath -c Release

# Run dotnet publish with release configuration and force APK format
dotnet publish $csprojPath -f net10.0-android -c Release -p:AndroidPackageFormat=Apk

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Publish completed successfully!" -ForegroundColor Green
    
    # Locate output directory
    $outputDir = Resolve-Path "OTPGenerator.Mobile\bin\Release\net10.0-android"
    
    Write-Host "`nYour APK file is ready in the following directory:" -ForegroundColor Yellow
    Write-Host $outputDir -ForegroundColor White
    
    # Open the folder in file explorer
    explorer $outputDir
} else {
    Write-Host "`n[ERROR] Publish failed. Please check the logs above." -ForegroundColor Red
}
