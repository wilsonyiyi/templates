export const version = "1.0.3";

export const gitRemoteMap = new Map([
  ["vite-react", "github:wilsonyiyi/templates/vite-react#main"],
]);

export function getPromptOptions() {
  return [
    {
      type: "select",
      name: "template",
      message: "请选择项目模板",
      choices: [
        {
          title: "vite-react",
          value: "vite-react",
        },
      ],
    },
  ];
}
