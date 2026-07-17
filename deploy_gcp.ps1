# ArenaOS GCP / Firebase Deployment Helper Script
# Project ID: arenaos-502718

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "     ArenaOS Google Cloud Platform (GCP) Deployment       " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "Target Project ID: arenaos-502718`n" -ForegroundColor Cyan

# Check for gcloud CLI
$hasGcloud = $null -ne (Get-Command gcloud -ErrorAction SilentlyContinue)
# Check for Firebase CLI
$hasFirebase = $null -ne (Get-Command firebase -ErrorAction SilentlyContinue)

if ($hasGcloud) {
    Write-Host "[✓] Google Cloud SDK (gcloud) detected." -ForegroundColor Green
    Write-Host "Proceeding with GCP App Engine Deployment..." -ForegroundColor Green
    
    # 1. Login check
    Write-Host "`n[1/3] Authenticating with Google Cloud..." -ForegroundColor Yellow
    gcloud auth login --brief
    
    # 2. Config project
    Write-Host "`n[2/3] Setting project ID to arenaos-502718..." -ForegroundColor Yellow
    gcloud config set project arenaos-502718
    
    # 3. Deploy static site
    Write-Host "`n[3/3] Deploying static website to App Engine..." -ForegroundColor Yellow
    gcloud app deploy app.yaml --quiet
    
    Write-Host "`n[✓] Deployment Complete! Your site is live at: https://arenaos-502718.uc.r.appspot.com" -ForegroundColor Green
}
elseif ($hasFirebase) {
    Write-Host "[✓] Firebase CLI detected." -ForegroundColor Green
    Write-Host "Proceeding with Firebase Hosting Deployment..." -ForegroundColor Green
    
    # 1. Login check
    Write-Host "`n[1/2] Authenticating with Firebase..." -ForegroundColor Yellow
    firebase login
    
    # 2. Deploy
    Write-Host "`n[2/2] Deploying site to Firebase Hosting..." -ForegroundColor Yellow
    firebase deploy --only hosting --project arenaos-502718
    
    Write-Host "`n[✓] Deployment Complete! Your site is live at: https://arenaos-502718.web.app" -ForegroundColor Green
}
else {
    Write-Host "[!] Neither Google Cloud SDK (gcloud) nor Firebase CLI was detected on this system's PATH." -ForegroundColor Red
    Write-Host "`nTo deploy to GCP project 'arenaos-502718', please follow one of these simple methods:`n" -ForegroundColor Yellow

    Write-Host "OPTION A: Deploy via GCP App Engine (Recommended)" -ForegroundColor Yellow
    Write-Host "1. Download & install Google Cloud SDK: https://cloud.google.com/sdk/docs/install#windows"
    Write-Host "2. Open PowerShell, navigate to this folder, and run:"
    Write-Host "   gcloud auth login"
    Write-Host "   gcloud config set project arenaos-502718"
    Write-Host "   gcloud app deploy app.yaml"
    
    Write-Host "`nOPTION B: Deploy via Firebase Hosting" -ForegroundColor Yellow
    Write-Host "1. Open PowerShell and run: npm install -g firebase-tools"
    Write-Host "2. Run: firebase login"
    Write-Host "3. Run: firebase deploy --project arenaos-502718"
}

Write-Host "`n==========================================================" -ForegroundColor Yellow
