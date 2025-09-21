import test from "ava";
import { sast } from "./util.mjs";
import {
  prepareAttributesDefinitions,
  private_key_attribute,
  url_attribute,
  certificate_attribute,
  hostname_attribute,
  string_attribute
} from "pacc";

const definitions = prepareAttributesDefinitions({
  jwt: {
    description: "jwt related",
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

test("default", sast, {}, {}, definitions, (t, object) =>
  t.deepEqual(object.listen, undefined)
);

test(
  sast,
  {},
  { listen: { socket: "/run/service/socket" } },
  definitions,
  (t, object) => t.deepEqual(object.listen, { socket: "/run/service/socket" })
);
