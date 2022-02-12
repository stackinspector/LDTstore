# LDTstore.com.cn

## NOTICE

The current role of this repository is **only** the configuration of **dynamic services**. The three directories `build` (for old pages and their build system before November 2021), `nginx` (for previous nginx configuration of the main site) and `wwwroot` are reserved **for historical reasons** only.

For the source code of **current pages** and their build system, see [ldtstore-homepage](https://github.com/stackinspector/ldtstore-homepage/)

For **images** on the pages, see [ldtstore-assert](https://github.com/stackinspector/ldtstore-assert/)

For the generic http **redirect** service used on `/r` and `/r2`, see [http-redirector](https://github.com/stackinspector/http-redirector/)

## Build Docker Images for Redirect Service

Prepare a linux VM with docker installed locally for building images. Login as `root`.

```bash
mkdir redirect && cd "$_"
# upload [repo]/docker/redirect/dockerfile to [remote]/root/redirect/dockerfile
wget -O- https://download.fastgit.org/stackinspector/http-redirector/releases/download/[version]/http-redirector_[version]_x86_64-unknown-linux-musl.tar.xz | tar xv --lzma
chmod 755 hr
docker build -t path/to/redirect:[version] .
docker push path/to/redirect:[version]
```
