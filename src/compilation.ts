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
  dummySrcInfo,
} from "@tact-lang/compiler";
import packageJson from '../package.json';

// Direct dependency of the Tact compiler
import { Cell } from "@ton/core";

// TODO: fix compilation.
//       In the meantime, add types page and remove redundant stuff on the first one.

export async function compile(
  fs: OverwritableVirtualFileSystem,
): Promise<CompileResult> {
  const projectName = "editor";
  const tactConfig: Config = {
    projects: [{
      name: projectName,
      output: "output",
      path: "editor.tact",
    }],
  };
  const buildConfig = {
    config: tactConfig.projects[0],
    stdlib: createVirtualFileSystem('@stdlib', stdLibFiles),
    project: fs,
  };

  const tactVersion = packageJson.version;
  // TODO: custom build() function? Akin to Web IDE?
  // const res = await build(buildConfig);
  const res: BuildResult = {
    ok: false,
    error: [{
      name: "Idk",
      message: "Bad",
      loc: dummySrcInfo,
    }],
  };

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _findTactBoc(fs: Map<string, Buffer>): Cell {
  let buf: Buffer | undefined = undefined;
  for (const [k, v] of fs.entries()) {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _extractProjectConfig(tactConfig: Config, projectName: string): Project {
  const project = tactConfig.projects.find((p) => p.name === projectName);

  if (!project) {
    throw new Error(`Config for project ${projectName} not found`);
  }

  return project;
}

const sep = '/';
export class OverwritableVirtualFileSystem implements VirtualFileSystem {
  root: string;
  files: Map<string, Buffer> = new Map();

  constructor(root: string = sep) {
    this.root = this.normalizePath(root);
  }

  resolve(...path: string[]): string {
    return this.normalizePath(this.resolvePath(this.root, ...path));
  }

  exists(path: string): boolean {
    return this.files.has(this.resolve(path));
  }

  readFile(path: string): Buffer {
    const resolvedPath = this.resolve(path);
    return this.files.get(resolvedPath) ?? Buffer.from('');
  }

  writeFile(path: string, content: string | Buffer): void {
    const resolvedPath = this.resolve(path);
    const buffer = typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;
    this.files.set(resolvedPath, buffer);
  }

  private normalizePath(path: string): string {
    const res = path.trim().replaceAll(/\/{2,}/, '/');
    if (res === sep) {
      return res;
    } else {
      return res.replace(RegExp(sep + '+$'), '');
    }
  }

  private resolvePath(...pathSegments: string[]): string {
    const pathParts = this.root.split('/');
    for (const segment of pathSegments) {
      const normalizedSegment = this.normalizePath(segment);
      const parts = normalizedSegment.split('/');

      for (const part of parts) {
        if (part === '..') {
          // Go up one directory level
          if (pathParts.length > 0) {
            pathParts.pop();
          }
        } else if (part !== '.' && part !== '') {
          // Navigate down to the directory
          pathParts.push(part);
        }
        // Ignore '.' and empty segments as they represent the current directory
      }
    }
    return pathParts.join('/');
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
