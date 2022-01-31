# LDTstore.com.cn

## NOTICE

The current role of this repository is **only** the configuration of **dynamic services**. The three directories `build` (for old pages and their build system before November 2021), `nginx` (for previous nginx configuration of the main site) and `wwwroot` are reserved **for historical reasons** only.

For the source code of **current pages** and their build system, see [ldtstore-homepage](https://github.com/stackinspector/ldtstore-homepage/)

For **images** on the pages, see [ldtstore-assert](https://github.com/stackinspector/ldtstore-assert/)

For the generic http **redirect** service used on `/r` and `/r2`, see [http-redirector](https://github.com/stackinspector/http-redirector/)

## Build Docker Images for `redirect-r` and `redirect-r2`

Prepare a linux VM with docker installed locally for building images. Login as `root`.

```bash
mkdir redirect-r redirect-r2
# upload [repo]/docker/redirect-r/dockerfile to [remote]/root/redirect-r/dockerfile
# upload [repo]/docker/redirect-r2/dockerfile to [remote]/root/redirect-r2/dockerfile
wget https://download.fastgit.org/stackinspector/http-redirector/releases/download/[version]/http-redirector_[version]_x86_64-unknown-linux-musl.tar.xz -O hr.tar.xz
tar xvf hr.tar.xz --lzma
rm hr.tar.xz
cp ./hr ./redirect-r/
cp ./hr ./redirect-r2/
chmod 755 ./redirect-r/hr
chmod 755 ./redirect-r2/hr
docker build redirect-r # => [imgid-r]
docker build redirect-r2 # => [imgid-r2]
docker tag [imgid-r] path/to/redirect-r:[version]
docker tag [imgid-r2] path/to/redirect-r2:[version]
docker push path/to/redirect-r:[version]
docker push path/to/redirect-r2:[version]
```
