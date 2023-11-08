[![npm](https://img.shields.io/npm/v/pacc.svg)](https://www.npmjs.com/package/pacc)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![bundlejs](https://deno.bundlejs.com/?q=pacc\&badge=detailed)](https://bundlejs.com/?q=pacc)
[![downloads](http://img.shields.io/npm/dm/pacc.svg?style=flat-square)](https://npmjs.org/package/pacc)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/pacc.svg?style=flat-square)](https://github.com/arlac77/pacc/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fpacc%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/pacc/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/pacc/badge.svg)](https://snyk.io/test/github/arlac77/pacc)
[![Coverage Status](https://coveralls.io/repos/arlac77/pacc/badge.svg)](https://coveralls.io/github/arlac77/pacc)

# pacc

propetty path utils


```js
import { getAttribute } from "pacc";

const result = getAttribute({ a: [0,{ b: 4 }]}, "a[1].b");
// result === 4
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

- [pacc](#pacc)
- [API](#api)
    - [Table of Contents](#table-of-contents)
  - [AttributeDefinition](#attributedefinition)
    - [Properties](#properties)
  - [setAttribute](#setattribute)
    - [Parameters](#parameters)
  - [getAttribute](#getattribute)
    - [Parameters](#parameters-1)
  - [getAttributeAndOperator](#getattributeandoperator)
    - [Parameters](#parameters-2)
  - [tokens](#tokens)
    - [Parameters](#parameters-3)
- [install](#install)
- [license](#license)

## AttributeDefinition

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `writable` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `private` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** should the value be shown
*   `depends` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** name of an attribute we depend on
*   `additionalAttributes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** extra attributes that are present in case our attribute is set
*   `description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `default` **any?** the default value
*   `set` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** set the value
*   `get` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** get the value can be used to calculate default values
*   `env` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?** environment variable use to provide the value

## setAttribute

Set Object attribute.
The name may be a property path like 'a.b.c'.

### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `expression` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `value` **any**&#x20;

## getAttribute

Deliver attribute value.
The name may be a property path like 'a.b.c' or a\[2]

### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `expression` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **any** value associated with the given property name

## getAttributeAndOperator

Deliver attribute value and operator.
The name may be a property path like 'a.b.c <='.

### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `expression` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `getters`   (optional, default `{}`)

Returns **\[any, [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)]** value associated with the given property name

## tokens

Split property path into tokens

### Parameters

*   `string` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

# install

With [npm](http://npmjs.org) do:

```shell
npm install pacc
```

# license

BSD-2-Clause
