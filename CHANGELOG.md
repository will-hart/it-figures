# it-figures changelog

## 0.3.0 [Released 2018-10-16]

### Added

- Generation now runs synchronously by default. This is due to a [long standing bug in cairo](https://gitlab.freedesktop.org/cairo/cairo/issues/190).
- `async` command option, allowing building asynchronously
- Various dependency updates

## 0.2.1 [Released 2018-08-13]

### Fixed

- Remove redundant packages
- Fix README instructions and (hopefully) `package.json` repository field

## 0.2.0 [Released 2018-08-13]

### Fixed

- npm package naming
- Fixed incorrect binary name

### Added

- Added `mode` field in the Panel definition
- Implemented `SVG` mode - see the `README` for usage and requirements

### Changed

- `rowspan` renamed to `rows`
- `colspan` renamed to `cols`


## 0.1.1 [Released 2018-08-13]

- Initial `npm` release