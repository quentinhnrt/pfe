export const templates = {
    'test-template': {
        'render': await import('@/components/templates/test-template/render'),
        'settings': await import('@/components/templates/test-template/settings'),
    }
}