import test from "ava";
import { environmentValues } from "pacc";
import { string_attribute, token_attribute, object_attribute } from "pacc";

test("environmentValues default empty", t => {
  t.is(environmentValues(), undefined);
  t.is(environmentValues({}), undefined);
});

const attributes = {
  host: {
    ...string_attribute,
    env: "{{instanceIdentifier}}HOST",
    default: "somewhere.com"
  },
  authentication: {
    ...object_attribute,
    attributes: {
      token: {
        ...token_attribute,
        env: ["{{instanceIdentifier}}TOKEN", "XXX_TOKEN"],
        additionalValues: { "authentication.type": "token" },
        mandatory: true
      }
    }
  },
  api: {
    env: "{{instanceIdentifier}}API"
  }
};

test("environmentValues", t => {
  t.deepEqual(
    environmentValues(
      attributes,
      {
        GITEA_HOST: "somewhere",
        GITEA_TOKEN: "abc"
      },
      "GITEA_"
    ),
    { host: "somewhere", authentication: { token: "abc" } }
  );
});


/*
test(
  providerOptionsFromEnvironmentTest,
  MyProviderB,
  {
    GITEA_HOST: "somewhere",
    GITEA_TOKEN: "abc"
  },
  {
    host: "somewhere",
    "authentication.token": "abc",
    "authentication.type": "token"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProviderB,
  {
    GITEA_API: "http://somewhere/api",
    GITEA_TOKEN: "abc",
    GIT_CLONE_OPTIONS: "-A 1"
  },
  {
    "authentication.token": "abc",
    "authentication.type": "token",
    api: "http://somewhere/api",
    cloneOptions: "-A 1"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProviderB,
  {
    XXX_TOKEN: "abc"
  },
  {
    "authentication.token": "abc",
    "authentication.type": "token"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProviderA,
  {
    BITBUCKET_USERNAME: "aName",
    BITBUCKET_PASSWORD: "aSecret"
  },
  {
    "authentication.username": "aName",
    "authentication.password": "aSecret",
    "authentication.type": "basic"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProviderA,
  {
    BITBUCKET_USERNAME: "aName",
    BITBUCKET_APP_PASSWORD: "aAppSecret",
    BITBUCKET_PASSWORD: "aSecret"
  },
  {
    "authentication.username": "aName",
    "authentication.password": "aAppSecret",
    "authentication.type": "basic"
  },
  true
);

*/