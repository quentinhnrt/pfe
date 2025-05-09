export const templates = {
  "test-template": {
    render: await import("@/features/templates/test-template/render"),
    settings: await import("@/features/templates/test-template/settings"),
  },
};
