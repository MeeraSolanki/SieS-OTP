@echo off
:: This batch script runs the Publish-iOS.ps1 script with PowerShell ExecutionPolicy bypassed.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File .\Publish-iOS.ps1
pause
