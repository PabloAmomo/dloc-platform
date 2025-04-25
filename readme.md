# DLOC Plataform

This project is a robust and efficient server designed to receive and process GPS messages from GF-07, GF-09, GF-11, GF-21, and GF-22 models. It is a comprehensive solution that facilitates the collection and management of real-time location data, providing a solid foundation for GPS tracking applications, security, and fleet management.

Demo: [Demo URL](https://maipet.es)

## Run plataform in local machine
Rename docker-compose.yml.local-environment to docker-compose.yml.

### Configure the passwords for the app
In the .env file located in the root directory, set the password for the root user (admin connection), and the service connection user (For api and server):
``` 
MYSQL_ROOT_PASSWORD=set_complex_password_mysql_root
MYSQL_PASSWORD=set_complex_password_dloc_service
```

In the dloc-server folder, modify the .docker.env, .docker.http.env, and .docker.socket.env files and set the dloc-service user password:
> The same password than MYSQL_SERVER_PASSWORD
```
MYSQL_PASSWORD=set_complex_password_dloc_service
``` 

In the dloc-api folder, modify the .docker.env, .docker.http.env, and .docker.socket.env files and set the dloc-api user password:
> This is the same password than MYSQL_API_PASSWORD
```
MYSQL_PASSWORD=set_complex_password_dloc_service
```

now, start the plataform
```
docker-compose build
docker-compose up -d
```

## DLOC Server

Server to receive information from GPS Devices.
Ready for use with traccar client. (For configure use http://url/connector/location)

### Configure GPS Device to send data to server

### Remember: You Must disbale PIN number in the mobile card.

For configure GF-22 to send data to server, you must send SMS's to the device, with the follow configuration settings.
``` 
Get IMEI from device
Send SMS with: imei#
The device will response with the device IMEI
```

``` 
Configure APN for Data
Send SMS with: APN#name#user#password#
MasMovil (Spain): APN#internet###
```

``` 
Set Upload time (Seconds) [10-60 seconds]
Send SMS with: md#seconds
Where seconds is the seconds to upload data when available.
Example: md#10 (Send data to server every 10 seconds)
```

``` 
Set Upload time (Minutes) [1-120 minutes]
Send SMS with: time#minutes
Where minutes is the minutes to upload data when available.
Example: time#10 (Send data to server every 10 minutes)
```

``` 
Set Server (First must configure APN)
Send SMS with: domain#ip#port#
Where ip is the IP Address for the server, and port is the socket port to use.
Example: domain#82.223.64.197#24666# (Send data to server on IP 82.223.64.197 to port 24666)
```

``` 
Set Heartbeat Seconds (First must configure APN)
Send SMS with: heartbeat#seconds#
Where seconds is the seconds for heartbeat. Example heartbeat#30# (Heartbeat every 30 seconds)
```

### Complete Config Example
```
imei#
response: IMEI:12345678901234
```

```
md#10
response: +IN:10
```

```
heartbeat#30#
response: Heartbeat OK
```

```
APN#internet#
response: APN set success
```

```
domain@82.223.64.197#24666#
response: Domain set success
```


## DLOC Api

Simple API for consuming data produced by the DLOC-SERVER

## DLOC Front End

Front end example for using the DLOC Platform (React App)

# Database

The project employs a MySQL database. Within the 'dloc-database-backup' file, you'll find a backup of the data structure needed by the server. To get started, simply restore this backup into a database (e.g., 'dloc') and configure the connection details in the '.env.example' file (rename it to '.env'), located in the 'dloc-server' directory. This setup ensures smooth integration and operation with the database.

# Docker

The project features a Docker Compose setup to seamlessly launch both the server and its database. Configuration is managed through .env files, which are provided in the project as .env.example. To get started, simply rename these to .env. This approach streamlines the initial setup process, ensuring a quick and efficient deployment.
