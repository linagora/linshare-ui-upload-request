export const validateRequestIdMw = function ({ to, next }) {
  if (to.params && to.params.id) {
    next();
  } else {
    // TODO: Implement error route and redirect to it here
  }
};