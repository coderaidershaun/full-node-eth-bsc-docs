# NGINX Setup

### Install Packages

```shell
sudo apt-get update
sudo apt-get install nginx apache2-utils
sudo apt-get install python3-certbot-nginx
```

### Create SSL Cert

Replace with your server address:

```shell
sudo certbot --nginx -d ns3227623.ip-57-129-140.eu
```

Make sure cert updates monthly

```shell
sudo nano /etc/crontab
@monthly root certbot -q renew
```

### Create Username and Password

"mr_shaun" is the user in this instance. You can use anything here.

```shell
sudo htpasswd -c /etc/nginx/htpasswd.users mr_shaun
```

Enter password: MyPassword@123

### Change the Default NGINX file

first update the nginx.conf file to have this:

```shell
sudo nano /etc/nginx/nginx.conf
```

```text
http { ...
  limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

  ...

  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/default;

  ...
...
}
```

Override with the "default" file saved in this directory. Replace all url instances in the file with the correct server url.

```shell
sudo nano /etc/nginx/sites-enabled/default
```

### Test and Set NGINX

Run Test

```shell
sudo nginx -t
```

Configure to always run

```shell
sudo service nginx restart
sudo service nginx enable
```

### Final Check with Curl

Replace the below url with your correct url:

```text
curl -X POST https://ns3227623.ip-57-129-140.eu \
 -H "Content-Type: application/json" \
 -u mr_shaun:MyPassword@123 \
 --data '{"jsonrpc":"2.0", "method":"eth_blockNumber", "id": 1}'
```
