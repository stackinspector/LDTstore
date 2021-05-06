# NGINX Config and Static Pages for ldtstore.com.cn

## Process to Deploy and Recycle

Ensure that /root/cert contains the 2 certificate files and the generated dhparam file dh4096.pem.

Log in to the remote server as root.

```bash
nginx -s quit
tar caf nginx.tar.xz nginx
# recycle (download) the remote /root/nginx.tar.xz (contains error and access log)
rm -r nginx.tar.xz nginx
# deploy (upload) [repo]/nginx to the remote /root
tree nginx
nginx -p /root/nginx -c /root/nginx/nginx.conf
cat ./nginx/logs/error # verify that the startup was successful
```

Note that after updating nginx, the service will automatically start with the default path, so it is necessary to stop the service first before starting it with the specified path.