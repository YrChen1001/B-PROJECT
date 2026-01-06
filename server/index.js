import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Resolve public folder path
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Detect operating system
const isWindows = os.platform() === 'win32';

app.post('/print', (req, res) => {
    const { imagePath } = req.body;

    if (!imagePath) {
        return res.status(400).json({ error: 'Missing imagePath' });
    }

    // Clean up path: remove initial slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(PUBLIC_DIR, cleanPath);

    console.log(`🖨️  Receiving Print Request: ${fullPath}`);
    console.log(`📍 Operating System: ${os.platform()}`);

    if (isWindows) {
        // Windows: Use PowerShell to rotate image if needed, then print
        // This script:
        // 1. Loads the image
        // 2. Checks if width > height (landscape)
        // 3. If so, rotates it 90 degrees
        // 4. Saves to temp file
        // 5. Prints with mspaint
        const psScript = `
$imagePath = '${fullPath.replace(/'/g, "''")}'
$tempPath = [System.IO.Path]::GetTempPath() + 'print_temp.png'

Add-Type -AssemblyName System.Drawing

try {
    $img = [System.Drawing.Image]::FromFile($imagePath)
    
    # Check if landscape (width > height)
    if ($img.Width -gt $img.Height) {
        Write-Host "Rotating image from landscape to portrait..."
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    }
    
    $img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    
    Write-Host "Printing from: $tempPath"
    Start-Process mspaint -ArgumentList "/p `"$tempPath`"" -Wait
    
    # Clean up temp file after a delay
        Start - Sleep - Seconds 3
        Remove - Item $tempPath - ErrorAction SilentlyContinue
    } catch {
        Write - Host "Error: $_"
    exit 1
    }
    `;
        
        const command = `powershell - ExecutionPolicy Bypass - Command "${psScript.replace(/" / g, '\\"').replace(/\n/g, ' ')}"`;

console.log(`🔧 Executing PowerShell script for rotation + print`);

exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Print Error: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
    if (stderr) {
        console.error(`⚠️ Print Stderr: ${stderr}`);
    }
    console.log(`📝 PowerShell Output: ${stdout}`);
    console.log(`✅ Print Job Sent`);
    res.json({ success: true, message: 'Print job sent successfully' });
});
    } else {
    // macOS/Linux: Use lp command with orientation
    const command = `lp -o fit-to-page -o portrait "${fullPath}"`;

    console.log(`🔧 Executing: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Print Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`⚠️ Print Stderr: ${stderr}`);
        }
        console.log(`✅ Print Job Sent: ${stdout || 'Success'}`);
        res.json({ success: true, message: 'Print job sent successfully' });
    });
}
});

app.listen(PORT, () => {
    console.log(`🖨️  Print Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${PUBLIC_DIR}`);
});
