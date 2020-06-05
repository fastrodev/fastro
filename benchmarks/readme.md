# Benchmarks

- __Machine__: MacBook Air, 1.8 GHz Dual-Core Intel Core i5, 8 GB 1600 MHz DDR3

- __Node.js__: v14.3.0

- __Deno__: v1.0.2

## Method

Setup & start PHP Server
- https://jasonmccreary.me/articles/install-apache-php-mysql-mac-os-x-catalina/

Setup & start Python Flask Server
- https://flask.palletsprojects.com/en/1.1.x/installation/

Start all node & deno server:
  ```
  npm start
  ```
Compare:
  ```
  npm run compare
  ```

Compile the benchmark results and write them to readme:
  ```
  npm run compile
  ```

Shutdown server:
  ```
  npm run kill
  ```