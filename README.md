# LDTstore.com.cn

## Build, Deploy and Recycle

Ensure that `/server/cert` contains the 2 certificate files and the generated dhparam file `dh4096.pem`.

Log in to the remote server as root.

### Deploy and Recycle Nginx

```bash
cd /server
nginx -s quit
tail -n 20 nginx/logs/error # test
tar caf nginx.tar.xz nginx
sha256sum nginx.tar.xz
# download the remote /server/nginx.tar.xz (contains error and access log)
rm -r nginx nginx.tar.xz
mkdir ./nginx ./nginx/logs
cd nginx
wget https://cdn.jsdelivr.net/gh/stackinspector/LDTstore/nginx/nginx.conf
cd ..
nginx -p /server/nginx -c /server/nginx/nginx.conf
cat nginx/logs/error # test
```

Note that after updating nginx, the service will automatically start with the default path, so it is necessary to stop the service first after the update before starting it with the specified path.

### Update Pages

First run the build script locally. Make sure that deno is installed locally.

Considering that dealing with deno compatibility of npm packages is not an easy task, currently `html-minifier` is run by calling node. So you also need to make sure that the global npm package `html-minifier` is installed in your local environment. The build script can currently only be run under Windows due to a minor detail in the calling under Windows. In the future it will be possible to make `html-minifier` run directly in deno.

When you get ready, run `deno run --allow-read --allow-write --allow-run build/build.ts` locally in the repo directory, then log in to the remote server.

```bash
cd /server
rm -r wwwroot
# (immediately) upload [repo]/wwwroot to the remote /server
```

### Update Redirect Routes

```bash
cd /server/apps/http-redirector
pkill http-redirector
nohup ./http-redirector -p 10305 -c "https://cdn.jsdelivr.net/gh/stackinspector/LDTstore/app/redirect/redirect" &
```

### Update Redirect Service

```bash
cd /server/apps/http-redirector
pkill http-redirector
rm http-redirector
wget -O tmp.zip https://download.fastgit.org/stackinspector/http-redirector/releases/download/[version]/http-redirector_[version]_x86_64-unknown-linux-musl.zip
unzip tmp.zip
rm tmp.zip
nohup ./http-redirector -p 10305 -c "https://cdn.jsdelivr.net/gh/stackinspector/LDTstore/app/redirect/redirect" &
```
