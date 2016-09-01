# [SWSSEM ERP SYSTEM](https://github.com/SWMEM-ONLINE/ERP-SYSTEM)
*Suwon Samsung Membership Erp System*

## Table of contents

* [Quick start](#quick-start)
* [Documentation](#documentation)
* [Copyright and license](#copyright-and-license)

## Quick start

### Requirements
* [Node.js (v4.2.x)](https://nodejs.org/en/download/)
* [node-mysql](https://github.com/felixge/node-mysql)

### Windows
* Make sure you have 'node.js' installed

* Clone the repo:
```bash
> git clone https://github.com/SWMEM-ONLINE/ERP-SYSTEM.git
> cd ERP-SYSTEM
```

* Run the server:
```bash
> node app.js
```

* Port Forwarding:
```bash
> sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 3000
```


## Documentation

* [Meeting minutes](https://trello.com/swssmonline)


## Copyright and license

Code and documentation copyright 2015 Team SWSSM-ONLINE. Code released under [the MIT license](https://github.com/twbs/bootstrap/blob/master/LICENSE).
