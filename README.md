# LDTstore.com.cn

## Build, Deploy and Recycle

Ensure that `/server/cert` contains the 2 certificate files and the generated dhparam file `dh4096.pem`.

Log in to the remote server as root.

### Deploy and Recycle Nginx

```bash
cd /server
# (when full restart) ps -ef|grep hr|grep -v grep|cut -c 10-16|xargs kill -9
nginx -s quit
tail -n 20 nginx/logs/error # test
tar caf nginx.tar.xz nginx
sha256sum nginx.tar.xz
# download the remote /server/nginx.tar.xz (contains error and access log)
rm -r nginx nginx.tar.xz
mkdir ./nginx ./nginx/logs
cd nginx
wget https://cdn.jsdelivr.net/gh/stackinspector/LDTstore@latest/nginx/nginx.conf
# when full restart, go to "Update Redirect Routes"
cd ..
nginx -p /server/nginx -c /server/nginx/nginx.conf
cat nginx/logs/error # test
```

Note that after updating nginx, the service will automatically start with the default path, so it is necessary to stop the service first after the update before starting it with the specified path.

### Update Pages

**see github.com/stackinspector/ldtstore-homepage/**

### Update Redirect Routes / Service

```bash
cd /server/apps/redirect
ps -ef|grep hr|grep -v grep|cut -c 10-16|xargs kill -9
# if update service
rm hr
wget -O- https://download.fastgit.org/stackinspector/http-redirector/releases/download/[version]/http-redirector_[version]_x86_64-unknown-linux-musl.tar.xz | tar xv --lzma
# end if update service
nohup ./hr -p 10305 -c "https://cdn.jsdelivr.net/gh/stackinspector/LDTstore@latest/app/redirect/r" -l "/server/apps/redirect/data/r/" &
nohup ./hr -p 20610 -c "https://cdn.jsdelivr.net/gh/stackinspector/LDTstore@latest/app/redirect/r2" -l "/server/apps/redirect/data/r2/" &
```
