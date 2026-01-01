import os from 'os';
import fs from 'fs';
import path from 'path';

console.log("starting");

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    for (const name in interfaces) {
      const infos = interfaces[name];
      if (infos) {
        for (const addr in infos) {
          if (addr) {
            const addrInfo = infos[addr];
            if (addrInfo.family === 'IPv4' && !addrInfo.internal) {
              return addrInfo.address;
            } 
          }
        }
      }
    }
    return null;
}

const ip = getLocalIP();

const BACKEND_PORT = 8080;

const ENV_VAR_NAME = 'VITE_API_URL';

const ENV_FILE = '.env';

const envPath = path.join(process.cwd(), ENV_FILE);
const apiUrl = `http://${ip}:${BACKEND_PORT}`;

let content = '';

if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, 'utf-8');
}

const regex = new RegExp(`^${ENV_VAR_NAME}=.*`, 'm');

if (regex.test(content)) {
  content = content.replace(regex, `${ENV_VAR_NAME}=${apiUrl}`);
  console.log(`IP atualizado em ${ENV_FILE}: ${apiUrl}`);
} else {
  content += `\n${ENV_VAR_NAME}=${apiUrl}\n`;
  console.log(`IP adicionado em ${ENV_FILE}: ${apiUrl}`);
}

fs.writeFileSync(envPath, content.trim() + '\n');