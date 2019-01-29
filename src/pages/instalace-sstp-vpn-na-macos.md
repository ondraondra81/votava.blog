---
date: 2019-01-29T13:28:11.996Z
title: ' Instalace SSTP VPN na MacOS'
featuredImage: /images/mac-os-logo.jpg
---
## Pomocí iSSTP clienta

Stáhnout soubor
<http://www.axot.org/wp-content/uploads/2015/03/iSSTP_v1.3_20161009.zip>

a pak do **advanced options** zadat:

```
usepeerdns require-mschap-v2 refuse-eap noauth noipdefault defaultroute
```

## nebo pokud by Vám to nešlo:

1. nainstalovat macports (pokud námáte) viz: <https://guide.macports.org/#installing.macports>
2. nainstalovat sstp clienta: `port install sstp-client`
3. upravit si script nize (vpn.sh) a nastavit mu práva pro spuštění `chmod +x vpn.sh`
4. spustit vpn.sh a připojit se :)

```sh
#!/bin/bash

SERVICE_NAME='<nazev-vpn-pripojeni>'
SERVICE_URL='<adresa-serveru>'

UN='<uzivatelske_jmeno'

PW_KC=$(security find-generic-password -a $UN -s $SERVICE_NAME -w 2> /dev/null)
PW=''

if [[ ${#PW_KC} > 1 ]]
then
    read -p "Use password from keychain? [y/n] " UPWKC
    if [[ $UPWKC == 'y' ]] || [[ $UPWKC == 'Y' ]] || [[ $UPWKC == '' ]]
    then
        PW=$PW_KC
    fi
fi

if [[ ${#PW} == 0 ]]
then
    read -sp "VPN Password: " PW

    echo
    read -p "Store password in keychain? [y/n] " UPWKC
    if [[ $UPWKC == 'y' ]] || [[ $UPWKC == 'Y' ]]
    then
        security add-generic-password -a $UN -s $SERVICE_NAME -w $PW
    fi
fi

echo -e "\nConnecting after sudo.."
sudo sstpc --log-stderr --log-level 4 --cert-warn --user $UN --password $PW $SERVICE_URL usepeerdns require-mschap-v2 noauth noipdefault defaultroute refuse-eap noccp
```
