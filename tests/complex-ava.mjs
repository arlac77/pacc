import test from "ava";
import { sast } from "./util.mjs";
import { prepareAttributesDefinitions, types } from "pacc";

const definitions = prepareAttributesDefinitions({
  jwt: {
    description: "jwt related",
    attributes: {
      public: {
        description: "public key to check token against",
        mandatory: true,
        private: true,
        type: "blob"
      }
    }
  },
  listen: {
    description: "server listen definition",

    attributes: {
      url: {
        description: "url of the http(s) server",
        needsRestart: true,
        type: types.url
      },
      address: {
        description: "hostname/ip-address of the http(s) server",
        needsRestart: true,
        type: "hostname"
      },
      socket: {
        description: "listening port|socket of the http(s) server",
        needsRestart: true,
        type: "listen-socket"
      }
    }
  },
  key: {
    description: "ssl key",
    needsRestart: true,
    private: true,
    type: "blob"
  },
  cert: {
    description: "ssl cert",
    needsRestart: true,
    private: true,
    type: "blob"
  },
  timeout: {
    attributes: {
      server: {
        description: "server timeout",
        type: "duration",
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
