export enum ErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    RESOURCE_NOT_FOUND = 404,
    INVALID_TOKEN = 498, // Código no estándar, pero usado por algunas APIs para tokens inválidos
    INTERNAL_SERVER_ERROR = 500,
    USER_NOT_AUTHORIZED = 4031, // Subcódigo específico para diferenciación
  }
  