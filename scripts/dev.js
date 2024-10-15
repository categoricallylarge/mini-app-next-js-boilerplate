const { exec } = require('child_process')
const qrcode = require('qrcode-terminal')
const dotenv = require('dotenv')

// NOTE: helper script to generate a QR code/link to interact with your Mini App
dotenv.config({ path: '.env.local' })

const LAUNCHER_URL = `${process.env.NEXT_PUBLIC_URL}/api/launcher`
const WARPCAST_COMPOSER_URL = `https://warpcast.com/~/developers/composer-actions?postUrl=${encodeURIComponent(LAUNCHER_URL)}`

// Generate QR code
qrcode.generate(LAUNCHER_URL, { small: true }, (qrcode) => {
  console.log(`


                    C A T E G O R I C A L L Y
                   __    _____ _____ _____ _____
                  |  |  |  _  | __  |   __|   __|
                  |  |__|     |    -|  |  |   __|
                  |_____|__|__|__|__|_____|_____|  

                              I N C.

      ███    ███ ██ ███    ██ ██      █████  ██████  ██████  ███████ 
      ████  ████ ██ ████   ██ ██     ██   ██ ██   ██ ██   ██ ██      
      ██ ████ ██ ██ ██ ██  ██ ██     ███████ ██████  ██████  ███████ 
      ██  ██  ██ ██ ██  ██ ██ ██     ██   ██ ██      ██           ██ 
      ██      ██ ██ ██   ████ ██     ██   ██ ██      ██      ███████ 
                                                                    
              B O I L E R P L A T E / Q U I C K S T A R T                                       


      `)
  console.log('Scan this QR code with \x1b[31m\x1b]8;;https://www.recaster.org\x07Recaster\x1b]8;;\x07\x1b[0m on mobile to interact with your Mini App:')
  console.log(qrcode)
  console.log(`Or open: \x1b[35m\x1b]8;;${WARPCAST_COMPOSER_URL}\x07${WARPCAST_COMPOSER_URL}\x1b]8;;\x07\x1b[0m`)
})

// Run Next.js dev server
const devProcess = exec('next dev', (error, stdout, stderr) => {
  if (error) {
    console.log(`exec error: ${error}`)
    return
  }
  console.log(stdout)
  console.log(stderr)
})

devProcess.stdout.pipe(process.stdout)
devProcess.stderr.pipe(process.stderr)