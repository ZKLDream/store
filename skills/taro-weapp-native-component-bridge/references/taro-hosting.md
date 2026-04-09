# Taro Hosting

## Host-page responsibilities

Use the Taro page as the only route entry.

The host page should:

- register the native component with `usingComponents`
- render the native component directly inside a simple shell
- keep layout, theme, and route ownership in Taro
- avoid duplicating the native page as a second runtime source

## Recommended responsibilities split

### Taro host page

- route entry
- page title
- outer layout shell
- host card or container styling
- build-time config injection

### Native component

- internal WXML/WXSS/JS behavior
- its own input, message, drawer, or internal interaction logic
- Mini Program-native rendering details

## Do not do this

- Do not let a copied raw native page overwrite the Taro route output
- Do not place `process.env` reads inside Mini Program runtime code
- Do not solve ESM issues inside Taro JSX; solve them in the native component preprocessing stage
