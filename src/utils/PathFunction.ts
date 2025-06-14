export function getResourcePath(resource: string): string {
    let basePath = process.env.BASE_PATH || '';
    return basePath + resource;
}