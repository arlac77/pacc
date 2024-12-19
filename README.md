[![npm](https://img.shields.io/npm/v/pacc.svg)](https://www.npmjs.com/package/pacc)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://spdx.org/licenses/0BSD.html)
[![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript\&label\&labelColor=blue\&color=555555)](https://typescriptlang.org)
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

*   [AttributeDefinition](#attributedefinition)
    *   [Properties](#properties)
*   [tokens](#tokens)
*   [tokens](#tokens-1)
    *   [Parameters](#parameters)
*   [setAttribute](#setattribute)
    *   [Parameters](#parameters-1)
*   [getAttribute](#getattribute)
    *   [Parameters](#parameters-2)
*   [getAttributeAndOperator](#getattributeandoperator)
    *   [Parameters](#parameters-3)
*   [lookup](#lookup)
*   [Token](#token)
    *   [Properties](#properties-1)
*   [createToken](#createtoken)
    *   [Parameters](#parameters-4)
*   [PLUS](#plus)
*   [MINUS](#minus)
*   [STAR](#star)
*   [DIVIDE](#divide)
*   [NOT](#not)
*   [NOT\_EQUAL](#not_equal)
*   [GREATER](#greater)
*   [GREATER\_EQUAL](#greater_equal)
*   [LESS](#less)
*   [LESS\_EQUAL](#less_equal)
*   [EQUAL](#equal)
*   [OPEN\_ROUND](#open_round)
*   [CLOSE\_ROUND](#close_round)
*   [OPEN\_BRACKET](#open_bracket)
*   [CLOSE\_BRACKET](#close_bracket)
*   [OPEN\_CURLY](#open_curly)
*   [CLOSE\_CURLY](#close_curly)
*   [QUESTION](#question)
*   [COLON](#colon)
*   [SEMICOLON](#semicolon)
*   [COMMA](#comma)
*   [DOT](#dot)
*   [AMPERSAND](#ampersand)
*   [DOUBLE\_AMPERSAND](#double_ampersand)
*   [BAR](#bar)
*   [DOUBLE\_BAR](#double_bar)

## AttributeDefinition

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `isKey` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `writable` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `mandatory` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `private` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** should the value be shown
*   `depends` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** name of an attribute we depend on
*   `additionalAttributes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** extra attributes that are present in case our attribute is set
*   `description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** human readable
*   `default` **any?** the default value
*   `set` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** set the value
*   `get` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** get the value can be used to calculate default values
*   `env` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?** environment variable(s) used to provide the value

## tokens

## tokens

Split property path into tokens

### Parameters

*   `string` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

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

Returns **\[any, [Token](#token)]** value associated with the given property name

## lookup

Token lookup

## Token

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `str` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

## createToken

### Parameters

*   `str` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **[Token](#token)**&#x20;

## PLUS

Type: [Token](#token)

## MINUS

Type: [Token](#token)

## STAR

Type: [Token](#token)

## DIVIDE

Type: [Token](#token)

## NOT

Type: [Token](#token)

## NOT\_EQUAL

Type: [Token](#token)

## GREATER

Type: [Token](#token)

## GREATER\_EQUAL

Type: [Token](#token)

## LESS

Type: [Token](#token)

## LESS\_EQUAL

Type: [Token](#token)

## EQUAL

Type: [Token](#token)

## OPEN\_ROUND

Type: [Token](#token)

## CLOSE\_ROUND

Type: [Token](#token)

## OPEN\_BRACKET

Type: [Token](#token)

## CLOSE\_BRACKET

Type: [Token](#token)

## OPEN\_CURLY

Type: [Token](#token)

## CLOSE\_CURLY

Type: [Token](#token)

## QUESTION

Type: [Token](#token)

## COLON

Type: [Token](#token)

## SEMICOLON

Type: [Token](#token)

## COMMA

Type: [Token](#token)

## DOT

Type: [Token](#token)

## AMPERSAND

Type: [Token](#token)

## DOUBLE\_AMPERSAND

Type: [Token](#token)

## BAR

Type: [Token](#token)

## DOUBLE\_BAR

Type: [Token](#token)

# install

With [npm](http://npmjs.org) do:

```shell
npm install pacc
```

# license

BSD-2-Clause
