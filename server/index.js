import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs';

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
        // Windows: Write PowerShell script to temp file, then execute
        const psScript = `
Add-Type -AssemblyName System.Drawing
$imagePath = "${fullPath.replace(/\\/g, '\\\\')}"
$tempPath = "$env:TEMP\\print_temp_$(Get-Date -Format 'yyyyMMddHHmmss').png"

try {
    $img = [System.Drawing.Image]::FromFile($imagePath)
    
    if ($img.Width -gt $img.Height) {
        Write-Host "Rotating landscape to portrait..."
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    }
    
    $img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    
    Write-Host "Printing: $tempPath"
    Start-Process mspaint -ArgumentList "/p `"$tempPath`"" -Wait

        Start - Sleep - Seconds 2
        Remove - Item $tempPath - ErrorAction SilentlyContinue
        Write - Host "Done"
    } catch {
        Write - Host "Error: $_"
    exit 1
    }
    `;

        const psFilePath = path.join(os.tmpdir(), 'print_script.ps1');
        fs.writeFileSync(psFilePath, psScript, 'utf8');

        const command = `powershell - ExecutionPolicy Bypass - File "${psFilePath}"`;

        console.log(`🔧 Executing PowerShell script from file: ${ psFilePath } `);

        exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            // Clean up script file
            try { fs.unlinkSync(psFilePath); } catch (e) {}
            
            if (error) {
                console.error(`❌ Print Error: ${ error.message } `);
                return res.status(500).json({ error: error.message });
            }
            if (stderr) {
                console.error(`⚠️ Print Stderr: ${ stderr } `);
            }
            console.log(`📝 Output: ${ stdout } `);
            console.log(`✅ Print Job Sent`);
            res.json({ success: true, message: 'Print job sent successfully' });
        });
    } else {
        // macOS/Linux: Use lp command
        const command = `lp - o fit - to - page "${fullPath}"`;

        console.log(`🔧 Executing: ${ command } `);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Print Error: ${ error.message } `);
                return res.status(500).json({ error: error.message });
            }
            if (stderr) {
                console.error(`⚠️ Print Stderr: ${ stderr } `);
            }
            console.log(`✅ Print Job Sent: ${ stdout || 'Success' } `);
            res.json({ success: true, message: 'Print job sent successfully' });
        });
    }
});

app.listen(PORT, () => {
    console.log(`🖨️  Print Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${PUBLIC_DIR}`);
});
