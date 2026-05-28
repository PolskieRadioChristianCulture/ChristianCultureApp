# PowerShell script to generate Android launcher icons from the uploaded logo image

param (
    [string]$sourcePath = "C:\Users\czark\.gemini\antigravity\brain\a2c42294-56b2-4b3d-99be-e431d90b5e97\media__1779965700215.jpg",
    [string]$resDir = "C:\Users\czark\Downloads\christian-culture-app\android\app\src\main\res"
)

Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$srcPath,
        [string]$destPath,
        [int]$width,
        [int]$height
    )
    
    try {
        $srcImg = [System.Drawing.Image]::FromFile($srcPath)
        $destImg = New-Object System.Drawing.Bitmap($width, $height)
        $g = [System.Drawing.Graphics]::FromImage($destImg)
        
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $g.DrawImage($srcImg, 0, 0, $width, $height)
        
        # Ensure directory exists
        $dir = Split-Path $destPath
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        
        # Delete if target exists
        if (Test-Path $destPath) {
            Remove-Item $destPath -Force
        }
        
        $destImg.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        $g.Dispose()
        $destImg.Dispose()
        $srcImg.Dispose()
        Write-Host "Generated: $destPath"
    } catch {
        Write-Error "Failed to generate $destPath : $_"
    }
}

# Densities and sizes mapping for standard launcher icons (48dp base)
$standardIcons = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

# Densities and sizes mapping for adaptive foreground icons (108dp base)
$foregroundIcons = @{
    "mipmap-mdpi"    = 108
    "mipmap-hdpi"    = 162
    "mipmap-xhdpi"   = 216
    "mipmap-xxhdpi"  = 324
    "mipmap-xxxhdpi" = 432
}

# Generate Standard Icons
foreach ($folder in $standardIcons.Keys) {
    $size = $standardIcons[$folder]
    
    # Generate ic_launcher.png
    $destPath = Join-Path $resDir "$folder\ic_launcher.png"
    Resize-Image -srcPath $sourcePath -destPath $destPath -width $size -height $size
    
    # Generate ic_launcher_round.png
    $destPathRound = Join-Path $resDir "$folder\ic_launcher_round.png"
    Resize-Image -srcPath $sourcePath -destPath $destPathRound -width $size -height $size
}

# Generate Adaptive Foreground Icons
foreach ($folder in $foregroundIcons.Keys) {
    $size = $foregroundIcons[$folder]
    
    # Generate ic_launcher_foreground.png
    $destPath = Join-Path $resDir "$folder\ic_launcher_foreground.png"
    Resize-Image -srcPath $sourcePath -destPath $destPath -width $size -height $size
}

Write-Host "Launcher icons generated successfully!"
