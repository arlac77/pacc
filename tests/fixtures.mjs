import { default_attribute } from "pacc";

export const attributeDefinitions = {
  a: { ...default_attribute, default: "ad" },
  b: default_attribute,
  c: { ...default_attribute, writable: true },
  d: {
    attributes: {
      d1: { ...default_attribute, default: "dd1" }
    }
  }
};

export class aClass {
  static attributes = attributeDefinitions;
}

export class bClass extends aClass {}
