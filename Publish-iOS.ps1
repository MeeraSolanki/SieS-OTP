# Publish-iOS.ps1
# This script publishes the OTPGenerator.Mobile project for iOS (.ipa).
# NOTE: Generating an iOS package requires a macOS machine with Xcode installed,
# either locally on a Mac, connected via Visual Studio "Pair to Mac", or through Cloud CI/CD (e.g. GitHub Actions).

param(
    [string]$ServerAddress = "",
    [string]$ServerUser = "",
    [string]$ServerPassword = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Publishing SieS OTP Generator for iOS  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Define relative path to the mobile csproj
$csprojPath = "OTPGenerator.Mobile\OTPGenerator.Mobile.csproj"

# Run dotnet clean to clear out cached assets
Write-Host "`n[1/2] Cleaning previous build artifacts..." -ForegroundColor Yellow
dotnet clean $csprojPath -c Release -f net10.0-ios

# Build arguments for iOS publishing
$publishArgs = @(
    "publish",
    $csprojPath,
    "-f", "net10.0-ios",
    "-c", "Release",
    "-r", "ios-arm64",
    "-p:PlatformTarget=ARM64",
    "-p:BuildIpa=true",
    "-p:ArchiveOnBuild=true"
)

# If Mac host details were provided, pass them to dotnet
if ($ServerAddress -ne "") {
    Write-Host "Targeting Mac build host at $ServerAddress..." -ForegroundColor Cyan
    $publishArgs += "-p:ServerAddress=$ServerAddress"
    if ($ServerUser -ne "") { $publishArgs += "-p:ServerUser=$ServerUser" }
    if ($ServerPassword -ne "") { $publishArgs += "-p:ServerPassword=$ServerPassword" }
}

Write-Host "`n[2/2] Publishing iOS application (.ipa)..." -ForegroundColor Yellow
dotnet @publishArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] iOS Publish completed!" -ForegroundColor Green
    
    # Check possible output locations
    $outputDir = "OTPGenerator.Mobile\bin\Release\net10.0-ios\ios-arm64\publish"
    if (Test-Path $outputDir) {
        $resolvedDir = Resolve-Path $outputDir
        Write-Host "`nOutput directory:" -ForegroundColor Yellow
        Write-Host $resolvedDir -ForegroundColor White
        explorer $resolvedDir
    }
} else {
    Write-Host "`n[ERROR] iOS Publish failed." -ForegroundColor Red
    Write-Host "Remember: Compiling an iOS executable requires Xcode on macOS." -ForegroundColor DarkYellow
    Write-Host "Ensure you are either on a Mac, connected via 'Pair to Mac', or using GitHub Actions." -ForegroundColor DarkYellow
}
