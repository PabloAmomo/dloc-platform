# Run in Local
Rename .env.example to .env
```
npm install

npm run dev
```

# Configure GF-22
SMS: SL DP82.223.64.197#24670#
response: Set Ok!IP:82.223.64.197 24670

SMS: SL FT
response: Reset to factory Set OK!

# Configure ZX908
SMS: SERVER,1,82.223.64.197,24671,0#
response: Current server:1:82.223.64.197

SMS: SERVER#82.223.64.197#24671#
response: Current server:82.223.64.197:24671

SMS: APN#apn-id#user#password# (2G & 4G v2)
or
SMS: APN,apn-id,user,password# (4G v1)

## Others SMS commands (ZX908)
1 - Reset to default password: “pwrst”
2 - Restore factory settings: “1122” (4G V1 FACTORY#) (4G V2 1122#)
3 - Inquire IMEI: “imei#”
4 - Modify IMEI: “imei#+no.ofimei" ( for example: IMEI#200000000000001 )
5 - LED light on/off: “led#on/led#off”
6 - Modify upload time interval:
    “time#+No. ( for example: time#1, time interval 1minutes, from 1-60minutes )
    "MD#+number" ( for example: MD#10 , time interval 10seconds, available set to 10-60 seconds)

7a - Modify IP: “DOMAIN#domain name or IP#Port ID#” ( will return to default 365gps server if the new server unavailable )
7b - Modify a fixed IP: SERVER#domain name or IP#Port ID# ( never return to 365gps server )
8 - APN setting: “APN#parameter#account#password#” (if there is no account password, don't need to fill in.)
9 - Restart the device: “SYSRST#”
10 - Vibration Alarm: 6666#on# / 6666#off# ( open / close vibration alarm )
11 - Remote Pickup Call: monitor#Number# ( set the monitor number) , monitor## ( cancel monitor )
12- 999 : SMS Coordinate Positioning