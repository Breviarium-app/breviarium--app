<h1 align="center">
  <a href="https://github.com/breviarium-app/breviarium--app">
    Breviarium App 🙏🏼
  </a>
</h1>

<p align="center">
  <b>Open source Liturgy of the Hours App</b>, collaborate to build the best Divine Office library!<br><br>
  Displays liturgical content and calendars of the Roman Rite of the Roman Catholic Church.<br>
  Supports Node v18+, Modern Browsers (desktop and mobile).
</p>

<p align="center">
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?color=blue&style=flat">
</a>
</p>

## Quickstart

This app uses [Breviarium](https://www.npmjs.com/package/breviarium) library (open source) with Liturgy of the hours.

[![npm version](https://badge.fury.io/js/breviarium.svg)](https://www.npmjs.com/package/breviarium)
![ci-node](https://github.com/breviarium-app/breviarium--app/actions/workflows/ci-node.yml/badge.svg)

To run the app:

```shell
# linux and mac users:
make install
# for windows users:
npm i
```

and run the ionic web app

```shell
# linux and mac users:
make run
# for windows users:
npm run dev
```

## CI/CD flow

GitHub Actions flow.

```mermaid
flowchart TB
    A["Push"] --> B{"Branch?"}
    B -- main --> C["Test"]
    B -- dev --> G["Test"]
    C --> D["Build"]
    D --> E["Deploy store Production"] & F["Deploy to Cloudflare"]
    E --> H["Update Version"]
    F --> H
    G --> I["Build"]
    I --> J["Deploy store Internal Track"] & K["Deploy to Cloudflare"]
    J --> L["Update code version"]
    K --> L

```