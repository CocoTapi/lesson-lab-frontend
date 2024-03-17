//import express and express related types
import express, { Request, Response, NextFunction, RequestHandler }  from 'express';
/**
 * Wrapper function which will be used with EVERY route function to catch async errors.
 *   - use this instead of putting a "try catch" in every function
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Catches any error that would otherwise crash our server.
 *  use this during initial development testing to find unhandled errors. 
 *  Idealy you want to handle all possible errors so when you find an unhandled error, 
 *  you should change your code to handle it.
 *  Afterwards, that type of error shouldn't be caught in this function
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // TODO: Log error to a service?
});

/**
 * if an exception happens, your program will likely still crash.
 * Catching it here simply helps you identify where it happened more easily.
 * What you can do is output an exit code before your program exits.
 * For example exit code 1 means something went wrong.
 * You can use listener programs such as PM2 to listen for your program to exit
 * with certain exit codes, and based on that code, perform different actions
 * such as restart your program
 */
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // TODO: perform restart?
    // process.exit(1); TODO: //process managers such as PM2 will catch this and restart the process
});