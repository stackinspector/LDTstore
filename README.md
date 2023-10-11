# LDTstore

## NOTICE

The current role of this repository is **only** the configuration of **dynamic services and short/reserved domains**.

The three directories `build` (for old pages and their build system before November 2021), `nginx` (for previous nginx configuration of the main site) and `wwwroot` are reserved **for historical reasons** only.

For the source code of **current pages** and their build system, see [ldtstore-homepage](https://github.com/stackinspector/ldtstore-homepage/)

For **images** on the pages, see [ldtstore-assert](https://github.com/stackinspector/ldtstore-assert/)

For the generic http **redirect** service used on `r.ldt.pc.wiki`, see [http-redirector](https://github.com/stackinspector/http-redirector/)

## Build Docker images for redirect service

Prepare a linux VM with docker installed locally for building images. Login as `root`.

```bash
mkdir redirect && cd "$_"
# [repo]/docker/redirect/dockerfile -> [remote]/root/redirect/dockerfile
wget -O- https://github.com/stackinspector/http-redirector/releases/download/v0.8.1/http-redirector_v0.8.1_x86_64-unknown-linux-musl.tar.xz | tar xv --lzma
chmod 755 hr
docker build -t path/to/redirect:v0.8.1 .
docker push path/to/redirect:v0.8.1
```

## Build, Deploy and Recycle for Short/Reserved domains

Ensure that `/server/certs/ldtstore-domains` contains `key.pem` and `fullchain.pem` and dhparam file is on `/server/certs/dh4096.pem`.

Nginx installed from debian apt and `libnginx-mod-http-brotli-static` and `libnginx-mod-http-brotli-filter` is installed.

Log in to the remote server as `root`.

### Deploy and Recycle Nginx

```bash
cd /server
nginx -s quit
tail -n 20 nginx/logs/error # test
tar caf nginx.tar.xz nginx
sha256sum nginx.tar.xz
# [remote]/server/nginx.tar.xz -> [local](archive)
rm -r nginx nginx.tar.xz
# [repo]/nginx-domains -> [remote]/server
mv nginx-domains nginx
mkdir nginx/logs
nginx -p /server/nginx -c /server/nginx/nginx.conf
cat nginx/logs/error # test
```

Note that after updating nginx, the service will automatically start with the default path, so it is necessary to stop the service first after the update before starting it with the specified path.

### Update Guide Pages

For building see [ldtstore-homepage](https://github.com/stackinspector/ldtstore-homepage/).

```bash
# first update
cd /server
mkdir pages
# [built]/guide-page -> [remote]/server/pages
# [built]/guide-page-intl -> [remote]/server/pages
```
