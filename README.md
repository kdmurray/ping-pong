# ping-pong
A simple DDNS client for Digital Ocean

# Introduction
This project provides a simple DDNS client written in node to update DNS records via the Digital Ocean API
on some interval. There weren't many free HTTP DDNS services out there, and I took an opportunity to just write it myself
since 1) I already have a Digital Ocean droplet and 2) the concept is so simple.

The application will run as a service on Windows. Not tested on Linux or otherwise.

# Limitations
Unfortunately, because of limitations of the Digital Ocean API, we can only perform updates on A records and not PTR records.
Because of this, this client won't be sufficient if you are running certain services (such as email) behind the DNS hostname and you'll
have to use a DDNS provider that provides this ability.