[![npm](https://img.shields.io/npm/v/pacc.svg)](https://www.npmjs.com/package/pacc)
[![License](https://img.shields.io/badge/License-0BSD-blue.svg)](https://spdx.org/licenses/0BSD.html)
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

*   [prepareAttributesDefinitions](#prepareattributesdefinitions)
    *   [Parameters](#parameters)
*   [mergeAttributeDefinitions](#mergeattributedefinitions)
    *   [Parameters](#parameters-1)
*   [AttributeDefinition](#attributedefinition)
    *   [Properties](#properties)
*   [default\_attribute](#default_attribute)
*   [default\_attribute](#default_attribute-1)
*   [default\_attribute](#default_attribute-2)
*   [default\_attribute\_writable](#default_attribute_writable)
*   [default\_attribute\_writable](#default_attribute_writable-1)
*   [default\_attribute\_writable](#default_attribute_writable-2)
*   [default\_attribute\_writable](#default_attribute_writable-3)
*   [string\_collection\_attribute\_writable](#string_collection_attribute_writable)
*   [name\_attribute](#name_attribute)
*   [email\_attribute](#email_attribute)
*   [version\_attribute\_writable](#version_attribute_writable)
*   [description\_attribute](#description_attribute)
*   [boolean\_attribute\_writable](#boolean_attribute_writable)
*   [boolean\_attribute\_writable\_true](#boolean_attribute_writable_true)
*   [boolean\_attribute\_writable\_true](#boolean_attribute_writable_true-1)
*   [boolean\_attribute\_writable\_false](#boolean_attribute_writable_false)
*   [boolean\_attribute\_false](#boolean_attribute_false)
*   [empty\_attribute](#empty_attribute)
*   [uuid\_attribute](#uuid_attribute)
*   [secret\_attribute](#secret_attribute)
*   [secret\_attribute](#secret_attribute-1)
*   [secret\_attribute](#secret_attribute-2)
*   [secret\_attribute](#secret_attribute-3)
*   [secret\_attribute](#secret_attribute-4)
*   [private\_key\_attribute](#private_key_attribute)
*   [public\_key\_attribute](#public_key_attribute)
*   [number\_attribute](#number_attribute)
*   [number\_attribute](#number_attribute-1)
*   [number\_attribute\_writable](#number_attribute_writable)
*   [integer\_attribute](#integer_attribute)
*   [integer\_attribute](#integer_attribute-1)
*   [integer\_attribute](#integer_attribute-2)
*   [integer\_attribute\_writable](#integer_attribute_writable)
*   [object\_attribute](#object_attribute)
*   [url\_attribute](#url_attribute)
*   [hostname\_attribute](#hostname_attribute)
*   [port\_attribute](#port_attribute)
*   [id\_attribute](#id_attribute)
*   [title\_attribute](#title_attribute)
*   [priority\_attribute](#priority_attribute)
*   [timeout\_attribute](#timeout_attribute)
*   [language\_attribute](#language_attribute)
*   [filter](#filter)
    *   [Parameters](#parameters-2)
*   [setAttributes](#setattributes)
    *   [Parameters](#parameters-3)
*   [getAttributes](#getattributes)
    *   [Parameters](#parameters-4)
*   [tokens](#tokens)
*   [tokens](#tokens-1)
    *   [Parameters](#parameters-5)
*   [setAttribute](#setattribute)
    *   [Parameters](#parameters-6)
*   [getAttribute](#getattribute)
    *   [Parameters](#parameters-7)
*   [getAttributeAndOperator](#getattributeandoperator)
    *   [Parameters](#parameters-8)
*   [lookup](#lookup)
*   [Token](#token)
    *   [Properties](#properties-1)
*   [createToken](#createtoken)
    *   [Parameters](#parameters-9)
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

## prepareAttributesDefinitions

Create attributes from its definition.

### Parameters

*   `newDefinitions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `presentDefinitions` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** optional merg in attributes

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** attributes

## mergeAttributeDefinitions

Merge attribute definitions.

### Parameters

*   `dest` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** attribute definitions to be used also the merge target
*   `atts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** attribute definitions to be used

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** merged definitions (dest)

## AttributeDefinition

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `isKey` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `writable` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `mandatory` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `collection` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**&#x20;
*   `private` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** should the value be shown
*   `depends` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** name of an attribute we depend on
*   `description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** human readable
*   `default` **any?** the default value
*   `set` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** set the value
*   `get` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** get the value can be used to calculate default values
*   `env` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?** environment variable(s) used to provide the value

## default\_attribute

Common attribute properties.

Type: [AttributeDefinition](#attributedefinition)

## default\_attribute

Type: [AttributeDefinition](#attributedefinition)

## default\_attribute

Type: [AttributeDefinition](#attributedefinition)

## default\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## default\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## default\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## default\_attribute\_writable

The body text.

Type: [AttributeDefinition](#attributedefinition)

## string\_collection\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## name\_attribute

Type: [AttributeDefinition](#attributedefinition)

## email\_attribute

Type: [AttributeDefinition](#attributedefinition)

## version\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## description\_attribute

The description of the object content.

Type: [AttributeDefinition](#attributedefinition)

## boolean\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## boolean\_attribute\_writable\_true

Type: [AttributeDefinition](#attributedefinition)

## boolean\_attribute\_writable\_true

Type: [AttributeDefinition](#attributedefinition)

## boolean\_attribute\_writable\_false

Type: [AttributeDefinition](#attributedefinition)

## boolean\_attribute\_false

Type: [AttributeDefinition](#attributedefinition)

## empty\_attribute

Type: [AttributeDefinition](#attributedefinition)

## uuid\_attribute

Type: [AttributeDefinition](#attributedefinition)

## secret\_attribute

Type: [AttributeDefinition](#attributedefinition)

## secret\_attribute

Type: [AttributeDefinition](#attributedefinition)

## secret\_attribute

Type: [AttributeDefinition](#attributedefinition)

## secret\_attribute

Type: [AttributeDefinition](#attributedefinition)

## secret\_attribute

Type: [AttributeDefinition](#attributedefinition)

## private\_key\_attribute

Type: [AttributeDefinition](#attributedefinition)

## public\_key\_attribute

Type: [AttributeDefinition](#attributedefinition)

## number\_attribute

Type: [AttributeDefinition](#attributedefinition)

## number\_attribute

Type: [AttributeDefinition](#attributedefinition)

## number\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## integer\_attribute

Type: [AttributeDefinition](#attributedefinition)

## integer\_attribute

Type: [AttributeDefinition](#attributedefinition)

## integer\_attribute

Type: [AttributeDefinition](#attributedefinition)

## integer\_attribute\_writable

Type: [AttributeDefinition](#attributedefinition)

## object\_attribute

Type: [AttributeDefinition](#attributedefinition)

## url\_attribute

Type: [AttributeDefinition](#attributedefinition)

## hostname\_attribute

Type: [AttributeDefinition](#attributedefinition)

## port\_attribute

Type: [AttributeDefinition](#attributedefinition)

## id\_attribute

Unique id within.

Type: [AttributeDefinition](#attributedefinition)

## title\_attribute

The one line description.

Type: [AttributeDefinition](#attributedefinition)

## priority\_attribute

In case there are several providers able to support a given source which one sould be used ?
this defines the order.

Type: [AttributeDefinition](#attributedefinition)

## timeout\_attribute

Type: [AttributeDefinition](#attributedefinition)

## language\_attribute

Type: [AttributeDefinition](#attributedefinition)

## filter

Generate filter function.

### Parameters

*   `filterBy` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?**&#x20;

Returns **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)**&#x20;

## setAttributes

Copies attribute values from a source object into a destination object.

### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** target object to be modified
*   `source` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** origin of the data to be copied
*   `definitions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** attribute definitions to be used
*   `cb` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)?** callback to be executed for each copied value
*   `prefix` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** name parefix

## getAttributes

Retrive attribute values from an object.

### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** attribute value source
*   `definitions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** values

## tokens

## tokens

Split property path into tokens

### Parameters

*   `string` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

## setAttribute

Set object attribute.
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
