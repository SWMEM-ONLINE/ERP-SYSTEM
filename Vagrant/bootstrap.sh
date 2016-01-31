#!/usr/bin/env bash
sed -i 's/us.archive.ubuntu.com/ftp.daum.net/g' /etc/apt/sources.list
sed -i 's/kr.archive.ubuntu.com/ftp.daum.net/g' /etc/apt/sources.list
sed -i 's/archive.ubuntu.com/ftp.daum.net/g' /etc/apt/sources.list
sed -i 's/security.ubuntu.com/ftp.daum.net/g' /etc/apt/sources.list
sed -i 's/extras.ubuntu.com/ftp.daum.net/g' /etc/apt/sources.list

sudo add-apt-repository -y ppa:snwh/pulp
apt-get update
apt-get install -y gcc g++ vim git openjdk-7-jdk curl build-essential
# apt-get install -y gradle
#
# curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
# apt-get install -y nodejs
npm install forever -g
npm install nodemon -g
npm install express -g

apt-get -y upgrade

cd /home/vagrant/ERP-SYSTEM

git pull


if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi
