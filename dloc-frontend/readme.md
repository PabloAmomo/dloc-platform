# Device configuration
old GF-22:
  Obtain the IMEI of your tracker (Necessary to activate it on the platform).
  imei#

  Set up access to the data network of the mobile operator of the SIM card. (Example: MasMovil Spain APN#internet###)
  APN#name#user#password#

  Configure the server of the platform where the tracker will report.
  DOMAIN#82.223.64.197#24666#

new GF-22:
  Obtain the IMEI of your tracker (Necessary to activate it on the platform).
  Get the ID/IMEI of your tracker (Its the number on the device label, but with 0000 at the beginning)

  Configure the server of the platform where the tracker will report.
  SL DP82.223.64.197#24670#

# Run in Local
Rename .env.example to .env
```
yarn install

yarn start
```
