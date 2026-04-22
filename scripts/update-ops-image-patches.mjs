#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const artifactsDir = requiredArg(args, "--artifacts-dir");
const opsRepoDir = requiredArg(args, "--ops-repo-dir");
const environment = requiredArg(args, "--environment");

const definitions = [
  {
    app: "web",
    artifact: "published-image-web.json",
    targetByEnvironment: {
      prod: "k8s/app/gyeoltare/web/prod/image-patch.yaml",
      stg: "k8s/app/gyeoltare/web/stg/image-patch.yaml",
    },
  },
  {
    app: "api",
    artifact: "published-image-api.json",
    targetByEnvironment: {
      prod: "k8s/app/gyeoltare/api/prod/image-patch.yaml",
      stg: "k8s/app/gyeoltare/api/stg/image-patch.yaml",
    },
  },
];

if (!["prod", "stg"].includes(environment)) {
  throw new Error(`Unsupported environment: ${environment}`);
}

for (const definition of definitions) {
  const artifactPath = resolve(artifactsDir, definition.artifact);
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  const imageTag = artifact.tags.find((tag) => tag.startsWith(`${artifact.image}:sha-`));

  if (!imageTag) {
    throw new Error(`SHA tag not found in ${artifactPath}`);
  }

  const imageReference = `${imageTag}@${artifact.digest}`;
  const targetPath = resolve(opsRepoDir, definition.targetByEnvironment[environment]);

  writeFileSync(
    targetPath,
    `- op: replace
  path: /spec/template/spec/containers/0/image
  value: ${imageReference}
`,
  );

  console.log(`Updated ${definition.app} ${environment} image patch: ${imageReference}`);
}

function parseArgs(argv) {
  const parsed = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];

    if (!key.startsWith("--")) {
      throw new Error(`Unexpected argument: ${key}`);
    }

    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${key}`);
    }

    parsed.set(key, value);
    index += 1;
  }

  return parsed;
}

function requiredArg(argsMap, key) {
  const value = argsMap.get(key);

  if (!value) {
    throw new Error(`Missing required argument: ${key}`);
  }

  return value;
}
