export type Result<Success = void, Error = void> = {
  success?: Success;
  error?: Error;
};
