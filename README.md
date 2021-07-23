# LDTstore.com.cn

## Process to Deploy and Recycle

Ensure that `/server/cert` contains the 2 certificate files and the generated dhparam file `dh4096.pem`.

Log in to the remote server as root.

```bash
cd /server
nginx -s quit
tail -n 20 nginx/logs/error
tar caf nginx.tar.xz nginx
sha256sum nginx.tar.xz
# recycle (download) the remote /server/nginx.tar.xz (contains error and access log)
rm -r nginx nginx.tar.xz
# deploy (upload) [repo]/nginx to the remote /server
tree nginx
nginx -p /server/nginx -c /server/nginx/nginx.conf
cat nginx/logs/error
```

Note that after updating nginx, the service will automatically start with the default path, so it is necessary to stop the service first after the update before starting it with the specified path.
