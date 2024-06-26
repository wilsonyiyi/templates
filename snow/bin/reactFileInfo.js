export function getFileName(fileType, dirname) {
  return {
    entryFile: "index.tsx",
    styleFile: `${dirname}.module.less`,
    componentFile: `${dirname}.tsx`,
  }[fileType];
}

export function getFileContent(fileType, dirname) {
    const entryFileContent = `export { default } from './${dirname}'`;
    const styleFileContent = ``;
    const uppercaseComponentName = dirname.charAt(0).toUpperCase() + dirname.slice(1);
    const componentFileContent = `import React from "react";
import styles from "./${dirname}.module.less";

interface IProps {}
const ${uppercaseComponentName}: React.FC<IProps> = () => {
  return <>${uppercaseComponentName}</>;
};

export default ${uppercaseComponentName};`;

    return {
        entryFile: entryFileContent,
        styleFile: styleFileContent,
        componentFile: componentFileContent,
    }[fileType]
}