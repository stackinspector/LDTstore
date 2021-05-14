# NGINX Config and Static Pages for ldtstore.com.cn

## Process to Deploy and Recycle

Ensure that `/root/cert` contains the 2 certificate files and the generated dhparam file `dh4096.pem`.

Log in to the remote server as root and ensure the current directory is `/root/`.

```bash
# stop the service and verify that the service has indeed stopped
nginx -s quit
tail -n 20 ./nginx/logs/error
# pack the current nginx directory in preparation of recycle
tar caf ./nginx.tar.gz ./nginx
# EXECUTE LOCALLY: recycle (download) the remote `/root/nginx.tar.xz` (contains error and access log) with `scp`
# remove the current nginx directory
rm -r ./nginx
# download the package from GitHub and extract the new nginx directory
wget -o ./nginx-new.tar.gz https://github.com/stackinspector/ldtstore-static/archive/refs/heads/main.tar.gz
tar xzvf ./nginx-new.tar.gz ldtstore-static-main/nginx/
# place the new nginx directory correctly and create the `logs` directory
mv ./ldtstore-static-main/nginx ./nginx
mkdir ./nginx/logs
# remove the used files
rm ./nginx.tar.gz ./nginx-new.tar.gz ./ldtstore-static-main
# start the service and verify that the service was started successfully
nginx -p ./nginx -c ./nginx/nginx.conf
cat ./nginx/logs/error
```
<!-- tree ./nginx # verify that the file deployment was successful -->

Note that after updating nginx, the service will automatically start with the default path, so it is necessary to stop the service first after the update before starting it with the specified path.