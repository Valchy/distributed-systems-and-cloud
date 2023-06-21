# node-distributed-system-and-cloud

Fun coffee app built in Harbour Space university to demonstrate a variety of skills.

## Load Balancer

To run the load balancer please provide it some hosts such as:
`node load-balancer.js http://18.195.253.24 http://3.73.56.149`

## Server configuration steps

1. SSH into server, make sure your public and private key are set up correct
2. Run `sudo apt update` to update all services and packages
3. Install firewall and allow only port `22`, `80` and `443` for ssh, http and https respectively
4. Either configure it on hosting provider or use `ufw` with: `sudo apt install ufw`
5. Configure `ufw`:
    - `sudo ufw allow ssh` - allow ssh port 22
    - `sudo ufw allow http` - allow http port 80
    - `sudo ufw allow https` - allow https port 443
    - `sudo ufw enable` - activate ufw firewall
    - `sudo systemctl enable ufw` - make ufw firewall start on startup
6. Install nginx using `sudo apt install nginx` then:
    - Check version `sudo nginx -v`
    - Add basic configuration so port 80 re-routes to localhost port
    - Test configuration `sudo nginx -t`
    - Restart nginx `sudo systemctl restart nginx`
7. Install correct node.js and npm version for the project
    - `curl -sL https://deb.nodesource.com/setup_<VERSION>.x | sudo bash -`
    - `sudo apt -y install nodejs`
    - Check versions `sudo node -v` and `sudo npm -v`
    - Download `pm2` globally `sudo npm i -g pm2`
8. Run app with `pm2` and save so it starts on reboot
    - `sudo pm2 start index.js --name myapp`
    - `sudo pm2 save`
    - `sudo pm2 startup`
