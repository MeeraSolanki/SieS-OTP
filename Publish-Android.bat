@echo off
:: This batch script runs the Publish-Android.ps1 script with PowerShell ExecutionPolicy bypassed.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File .\Publish-Android.ps1
pause
