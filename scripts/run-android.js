const { execSync, spawn } = require('child_process');
const net = require('net');

function isPortOpen(port) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function main() {
  console.log('🔍 Checking connected Android devices / emulators...');
  let devices = '';
  try {
    devices = execSync('adb devices', { encoding: 'utf8' });
  } catch (e) {
    console.log('Starting adb server...');
    execSync('adb start-server', { stdio: 'inherit' });
    devices = execSync('adb devices', { encoding: 'utf8' });
  }

  const lines = devices
    .trim()
    .split('\n')
    .slice(1)
    .filter(line => line.includes('\tdevice'));

  if (lines.length === 0) {
    console.log('📱 No running emulator found. Launching Pixel_8_API_34...');
    const emu = spawn('emulator', ['@Pixel_8_API_34'], {
      detached: true,
      stdio: 'ignore',
    });
    emu.unref();

    console.log('⏳ Waiting for emulator to connect via ADB...');
    try {
      execSync('adb wait-for-device', { stdio: 'inherit' });
    } catch (err) {
      console.warn('adb wait-for-device warning:', err.message);
    }

    console.log('⏳ Waiting for Android system boot to complete...');
    let booted = false;
    for (let i = 0; i < 45; i++) {
      try {
        const out = execSync('adb shell getprop sys.boot_completed', {
          encoding: 'utf8',
        }).trim();
        if (out === '1') {
          booted = true;
          break;
        }
      } catch (e) {}
      execSync('node -e "setTimeout(()=>{}, 1000)"');
    }
    console.log(booted ? '✅ Emulator booted and ready!' : '⚠️ Continuing build...');
  } else {
    console.log('✅ Found active device:', lines[0].split('\t')[0]);
  }

  // Setup port reverse for reliable Metro connection
  try {
    execSync('adb reverse tcp:8081 tcp:8081', { stdio: 'ignore' });
  } catch (e) {}

  // Check if Metro bundler is already running on port 8081
  const metroRunning = await isPortOpen(8081);
  if (!metroRunning) {
    console.log('⚡ Starting Metro bundler in a new window...');
    try {
      spawn('cmd.exe', ['/c', 'start', 'Metro Bundler', 'npx', 'react-native', 'start', '--port', '8081'], {
        detached: true,
        stdio: 'ignore',
      }).unref();
      // Brief pause to allow Metro to start
      execSync('node -e "setTimeout(()=>{}, 2000)"');
    } catch (err) {
      console.warn('Could not launch separate Metro window:', err.message);
    }
  } else {
    console.log('⚡ Metro bundler is already running on port 8081.');
  }

  console.log('🚀 Building and installing Click G Service App...');
  try {
    execSync('npx react-native run-android --no-packager', { stdio: 'inherit' });
    console.log('🎉 App successfully launched on emulator!');
  } catch (e) {
    console.error('❌ Build failed with exit code:', e.status || 1);
    process.exit(e.status || 1);
  }
}

main();
