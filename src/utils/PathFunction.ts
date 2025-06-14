export function getResourcePath(resource: string): string {
    const basePath = process.env.BASE_PATH || '';
    return basePath + resource;
}