# Firewall Setup

### Install package

```shell
sudo apt-get update
sudo apt-get install ufw
sudo apt-get install net-tools
```

### Disable Firewall

Disable the firewall so that you do not lose connection to your port 22 SSH

```shell
sudo ufw disable
```

### Deny Incoming Connections by Default

```shell
sudo ufw default deny incoming
```

### Allow Outgoing Connections by Default

```shell
sudo ufw default allow outgoing
sudo netstat -tuln
sudo ss -tuln
```

### Allow Specific Ports

<b>WARNING: DO NOT FORGET PORT 22</b>

```shell
sudo ufw allow 22/tcp
sudo ufw allow 30311
sudo ufw allow 30304
sudo ufw allow 8545/tcp
sudo ufw allow 8546/tcp
```

For NGINX:

```shell
sudo ufw allow 80
sudo ufw allow 443
```

If wanting to disable RPC requests:

```shell
sudo ufw deny 8545/tcp
sudo ufw deny 8546/tcp
```

### Enable the Firewall

Disable the firewall so that you do not lose connection to your port 22 SSH

```shell
sudo ufw enable
```

### Check Firewall Ports

Check which ports are allowed and which ports are being listened to:

```shell
sudo ufw status verbose
sudo netstat -tlnp
```
