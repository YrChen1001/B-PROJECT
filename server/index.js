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

    let command;

    if (isWindows) {
        // Windows: Use PowerShell Start-Process with -Verb Print
        // This uses the Windows default image handler (Photos app) to print
        command = `powershell -Command "Start-Process -FilePath '${fullPath.replace(/'/g, "''")}' -Verb Print"`;
    } else {
        // macOS/Linux: Use lp command
        command = `lp -o fit-to-page "${fullPath}"`;
    }

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
});

app.listen(PORT, () => {
    console.log(`🖨️  Print Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${PUBLIC_DIR}`);
});
