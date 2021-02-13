export const container = `// Define dependency injection: https://en.wikipedia.org/wiki/Dependency_injection
// You can customize this type according to your needs
export type Container = {
  repository: any;
};

// Dependency injection: https://en.wikipedia.org/wiki/Dependency_injection#Other_types
// You can put all your dependencies to this variable
const container: Container = {
  repository: new Promise((resolve) => resolve("connected!")),
};

export default () => container;

`;
