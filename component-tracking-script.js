const fs = require("fs").promises;
const glob = require("glob");
const path = require("path");

const rootFolder = "ui";
const ignoreFolder = path.join(rootFolder, "components", "component-library");

const components = new Set([
  // Add component names here
  "AvatarAccount",
  "AvatarFavicon",
  "AvatarIcon",
  "AvatarNetwork",
  "AvatarToken",
  "AvatarBase",
  "BadgeWrapper",
  "Box",
  "Button",
  "ButtonBase",
  "ButtonIcon",
  "ButtonLink",
  "ButtonPrimary",
  "ButtonSecondary",
  "Checkbox",
  "Container",
  "FormTextField",
  "HeaderBase",
  "HelpText",
  "Icon",
  "Label",
  "PickerNetwork",
  "Tag",
  "TagUrl",
  "Text",
  "Input",
  "TextField",
  "TextFieldSearch",
  "ModalContent",
  "ModalOverlay",
  "ModalFocus",
  "Modal",
  "ModalBody",
  "BannerBase",
  "BannerAlert",
  "BannerTip",
  "PopoverHeader",
  "Popover",
  "ModalHeader",
  "SelectButton",
  "SelectOption",
  "SelectWrapper",
]);

const componentInstances = new Map();

const processFile = async (filePath) => {
  try {
    // Read the file content
    const content = await fs.readFile(filePath, "utf8");

    // Regular expression to match the import statement from the component library
    const importRegex =
      /import\s+{([^}]*)}\s+from\s+['"][^'"]*\/component-library['"]/g;

    // Execute the regular expression to get the import statement
    const importMatch = importRegex.exec(content);

    // If the file imports anything from the component library
    if (importMatch) {
      // Parse the import statement to get a list of imported components
      const importedComponents = importMatch[1]
        .split(",")
        .map((name) => name.trim());

      console.log(`Processing file ${filePath}`);
      console.log(`Imported components: ${importedComponents}`);

      // Regular expression to match the JSX components used in the file
      const matches = content.match(/<([A-Z]\w*)(?=\s|\/|>)/g);

      console.log(`Matches: ${matches}`);

      // If any JSX components are used in the file
      if (matches) {
        // For each matched component
        matches.forEach((match) => {
          // Get the component name
          const componentName = match.substring(1);

          // If the component is in the list of components to count
          // and it's included in the import from the component library
          if (
            components.has(componentName) &&
            importedComponents.includes(componentName)
          ) {
            // Get the current count of the component
            const count = componentInstances.get(componentName) || 0;

            // Increment the count of the component
            componentInstances.set(componentName, count + 1);

            console.log(`Matched component: ${componentName}`);
            console.log(`Current count: ${count + 1}`);
          } else {
            console.log(
              `Component not in list or not imported from component library: ${componentName}`
            );
          }
        });
      }
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
};

glob(
  `${rootFolder}/**/*.{js,tsx}`,
  { ignore: [`${ignoreFolder}/**`, `${rootFolder}/**/*.test.{js,tsx}`] },
  async (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      return;
    }

    await Promise.all(files.map(processFile));

    console.log("Component Adoption Metrics:");
    components.forEach((componentName) => {
      const instanceCount = componentInstances.get(componentName) || 0;
      console.log(`${componentName}: ${instanceCount} instances`);
    });
  }
);
