<h1 align="center">
🧘‍♂️<br>
Express Scaffold.
</h1>

## 🧎‍♂️ Usage.

- Setup.
  - Local HTTPS.
    - `make ssl`
- Init.
  - `make build`
- Development.
  - `make up`
- CI Check Locally.
  - `make act JOB=JobName`
    - In Advance Need `Act`
      - `brew install act`
      - https://github.com/nektos/act
      - https://hub.docker.com/r/catthehacker/ubuntu
      - https://github.com/nektos/act/issues/280

## 👓 Memo.

- Modules to Fix Version.
  - `./client`
    - `del`: `6.1.1`
      - `7.*.*`: For ESM.
    - `gulp-imagemin`: `7.1.0`
      - `8.*.*`: For ESM.
    - `imagemin-mozjpeg`: `9.0.0`
      - `10.*.*`: For ESM.

<h2 align="center">🚶‍♂️🚶‍♂️🚶‍♂️</h2>
