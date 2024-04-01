export function getFileName(fileType, dirname) {
  return {
    entryFile: "index.tsx",
    styleFile: `${dirname}.module.less`,
    componentFile: `${dirname}.tsx`,
  }[fileType];
}

export function getFileContent(fileType, dirname) {
    const entryFileContent = `import * from './${dirname}'`;
    const styleFileContent = ``;
    const uppercaseComponentName = dirname.charAt(0).toUpperCase() + dirname.slice(1);
    const componentFileContent = `import React from "react";
import styles from "./a.module.less";

const ${uppercaseComponentName} = () => {
  return <div>a</div>;
};

export default ${uppercaseComponentName};`;

    return {
        entryFile: entryFileContent,
        styleFile: styleFileContent,
        componentFile: componentFileContent,
    }[fileType]
}