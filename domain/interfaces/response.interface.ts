// Interface pour les réponses d'erreur
export interface ErrorResponse {
  success: false;
  message: string;
}

// Interface pour les réponses réussies
export interface SuccessResponse<T = null> {
  success: true;
  data: T;
}
