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
  },
  {
    app: "api",
    artifact: "published-image-api.json",
  },
];

if (!["prod", "stg"].includes(environment)) {
  throw new Error(`Unsupported environment: ${environment}`);
}

for (const definition of definitions) {
  const targetPath = resolve(opsRepoDir, `k8s/app/gyeoltare/${environment}/${definition.app}/kustomization.yaml`);
  const content = readFileSync(targetPath, "utf8");
  const artifactPath = resolve(artifactsDir, definition.artifact);
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  const imageTag = artifact.tags.find((tag) => tag.startsWith(`${artifact.image}:sha-`));

  if (!imageTag) {
    throw new Error(`SHA tag not found in ${artifactPath}`);
  }

  const newTag = imageTag.slice(`${artifact.image}:`.length);
  const updatedContent = updateImageEntry(content, artifact.image, newTag, artifact.digest, targetPath);

  writeFileSync(targetPath, updatedContent);

  console.log(
    `Updated ${definition.app} ${environment} image in ${targetPath}: ${artifact.image}:${newTag}@${artifact.digest}`,
  );
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

function updateImageEntry(content, imageName, newTag, digest, filePath) {
  const pattern = new RegExp(`(^\\s*- name: ${escapeRegExp(imageName)}\\n)(\\s+)newTag: .*\\n\\2digest: .*\\n`, "m");

  if (!pattern.test(content)) {
    throw new Error(`Image entry not found for ${imageName} in ${filePath}`);
  }

  return content.replace(pattern, `$1$2newTag: ${newTag}\n$2digest: ${digest}\n`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
