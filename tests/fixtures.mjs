import {
  default_attribute,
  private_key_attribute,
  url_attribute,
  certificate_attribute,
  hostname_attribute,
  string_attribute,
  object_attribute,
  prepareAttributesDefinitions
} from "pacc";

export const attributeDefinitionsComplex = prepareAttributesDefinitions({
  jwt: {
    description: "jwt related",
    type: object_attribute,
    attributes: {
      public: {
        ...private_key_attribute,
        description: "public key to check token against",
        mandatory: true
      }
    }
  },
  listen: {
    description: "server listen definition",
    type: object_attribute,

    attributes: {
      url: {
        ...url_attribute,
        description: "url of the http(s) server",
        needsRestart: true
      },
      address: {
        ...hostname_attribute,
        description: "hostname/ip-address of the http(s) server",
        needsRestart: true
      },
      socket: {
        ...string_attribute,
        description: "listening port|socket of the http(s) server",
        needsRestart: true
      }
    }
  },
  key: {
    ...private_key_attribute,
    description: "ssl key",
    needsRestart: true
  },
  cert: {
    ...certificate_attribute,
    description: "ssl cert",
    needsRestart: true
  },
  timeout: {
    attributes: {
      server: {
        description: "server timeout",
        ...string_attribute,
        default: 120,
        set(value, attribute) {
          if (value === undefined) {
            value = attribute.default;
          }

          if (this.timeout === undefined) {
            this.timeout = {};
          }

          this.timeout.server = value;

          if (this.server) {
            this.server.setTimeout(value * 1000);
            return true;
          }
          return false;
        }
      }
    }
  }
});

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
