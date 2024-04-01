#! /usr/bin/env node
import { existsSync, mkdir, mkdirSync, readFileSync, writeFileSync } from "fs";
import { program } from "commander";
import Handlebars from "handlebars";
import shelljs from "shelljs";
import { downloadTemplate } from "giget";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import { version, getPromptOptions, gitRemoteMap } from "./config.js";
import { getFileContent, getFileName } from "./reactFileInfo.js";

program
  .name("snow")
  .description("snow is for creating a new project")
  .version(version)
  .command("create")
  .description("create a new project")
  .argument("projectName", "project name")
  .action(async (projectName) => {
    const { valid, message } = checkProjectName(projectName);
    if (!valid) {
      return console.log(chalk.red(message));
    }

    const { template } = await prompts(getPromptOptions());
    const remote = gitRemoteMap.get(template);

    await gitClone(remote, projectName);
    updatePackageJson(projectName);
    await startProject(projectName);
  });

// 生成资源目录和文件，现在只支持react项目
program
  .command("g")
  .description("generate resource directory and files")
  .argument("dirname", "directory name")
  .action((dirname) => {
    const fileTypes = ['entryFile',  'styleFile', 'componentFile'];
    mkdirSync(`${process.cwd()}/${dirname}`);
    fileTypes.forEach((fileType) => {
      const fileName = getFileName(fileType, dirname);
      const filePath = `${process.cwd()}/${dirname}/${fileName}`;
      if (existsSync(filePath)) {
        console.log(chalk.red(`${filePath} 文件已存在`));
        return;
      }
      writeFileSync(filePath, getFileContent(fileType, dirname), { encoding: "utf-8", flag: "w" });

      console.log(chalk.green(`${filePath} 文件创建成功`));
    });
  });

program.parse();

function checkProjectName(val) {
  if (!val) {
    return {
      valid: false,
      message: "项目名称不能为空",
    };
  }

  if (existsSync(val)) {
    return {
      valid: false,
      message: "项目名称已存在",
    };
  }

  if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
    return {
      valid: false,
      message: "项目名称只能包含字母、数字、中文、下划线、中划线",
    };
  }

  return { valid: true };
}

function gitClone(remote, projectName) {
  const downSpinner = ora("正在下载模板...").start();

  return new Promise((resolve, reject) => {
    downloadTemplate(remote, { dir: projectName })
      .then(() => {
        downSpinner.succeed("模板下载成功");
        resolve();
      })
      .catch((err) => {
        downSpinner.fail("模板下载失败");
        console.log(chalk.red(err));
        reject(err);
      });
  });
}

function updatePackageJson(projectName) {
  const packageJsonPath = `./${projectName}/package.json`;
  const packageJson = readFileSync(packageJsonPath).toString();
  const result = Handlebars.compile(packageJson)({ projectName });
  writeFileSync(packageJsonPath, result);
}

async function startProject(projectDir) {
  startInstallProject(projectDir);
  startRunProject();
}

function useNpmOrPnpm() {
  if (shelljs.which("pnpm")) return "pnpm";
  return "npm";
}

function startInstallProject(projectDir) {
  const npmOrPnpm = useNpmOrPnpm();
  shelljs.cd(projectDir);

  const startSpinner = ora("正在安装项目依赖...").start();
  const { code } = shelljs.exec(`${npmOrPnpm} install`);

  if (code !== 0) {
    startSpinner.fail("项目依赖安装失败");
    process.exit(1);
  }
  startSpinner.stop();
}

function startRunProject() {
  const npmOrPnpm = useNpmOrPnpm();

  const startSpinner = ora("正在启动项目...").start();
  const { code } = shelljs.exec(`${npmOrPnpm} run dev`);

  if (code !== 0) {
    startSpinner.fail("项目启动失败");
    process.exit(1);
  }

  startSpinner.stop();
}
