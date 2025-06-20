import { resolve, normalize, sep } from "path";
import { existsSync, readFileSync } from "fs";

import {
  // precompile,
  // run,
  build,
  createVirtualFileSystem,
  stdLibFiles,
  type VirtualFileSystem,
  type Config,
  // type Options,
  type Project,
  type BuildResult,
} from "@tact-lang/compiler";

// Direct dependency of the Tact compiler
import { Cell } from "@ton/core";

export async function compile(
  tactConfig: Config,
  projectName: string,
): Promise<CompileResult> {
  const fs = new OverwritableVirtualFileSystem('.');
  // const fs = createVirtualFileSystem('/', {}, false);
  // fs.writeFile();

  const buildConfig = {
    config: extractProjectConfig(tactConfig, projectName),
    stdlib: createVirtualFileSystem('@stdlib', stdLibFiles),
    project: fs,
  };

  const tactVersion = await getTactVersion();
  const res = await build(buildConfig);

  if (res.ok === false) {
    return {
      ok: false,
      version: tactVersion,
      error: res.error,
    };
  }

  // NOTE: can be done later, on demand
  // const _code = findTactBoc(fs.overwrites);

  return {
    ok: true,
    version: tactVersion,
    files: fs.files,
    projectConfig: buildConfig.config,
  };
}

async function getTactVersion() {
  const packageJsonPath = require.resolve('@tact-lang/compiler/package.json');
  const { version } = await import(packageJsonPath);
  return version;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _findTactBoc(fs: Map<string, Buffer>): Cell {
  let buf: Buffer | undefined = undefined;
  for (const [k, v] of fs) {
    if (k.endsWith('.code.boc')) {
      buf = v;
      break;
    }
  }
  if (buf === undefined) {
    throw new Error('Could not find BoC in Tact compilation result');
  }
  return Cell.fromBoc(buf)[0];
}

function extractProjectConfig(tactConfig: Config, projectName: string): Project {
  const project = tactConfig.projects.find((p) => p.name === projectName);

  if (!project) {
    throw new Error(`Config for project ${projectName} not found`);
  }

  return project;
}

export class OverwritableVirtualFileSystem implements VirtualFileSystem {
  root: string;
  files: Map<string, Buffer> = new Map();

  constructor(root: string) {
    this.root = normalize(root);
    if (!this.root.endsWith(sep)) {
      this.root += sep;
    }
  }

  resolve(...path: string[]): string {
    return normalize(resolve(this.root, ...path));
  }

  exists(path: string): boolean {
    return existsSync(path);
  }

  readFile(path: string): Buffer {
    return this.files.get(path) ?? readFileSync(path);
  }

  writeFile(path: string, content: string | Buffer): void {
    this.files.set(path, typeof content === 'string' ? Buffer.from(content, 'utf-8') : content);
  }
}

export type CompileResult = {
  ok: false;
  version: string;
  error: BuildResult["error"];
} | {
  ok: true;
  version: string;
  files: Map<string, Buffer>;
  projectConfig: Project;
};
