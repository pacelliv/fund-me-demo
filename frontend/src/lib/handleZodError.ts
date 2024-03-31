import { ZodError } from "zod";

export const handleZodError = ({ issues }: ZodError<unknown>) => {
    const errorMessages: Record<string, string> = {};

    if (issues.length === 1 && issues[0].path.length < 1) {
        return issues[0].message;
    }

    issues.forEach(({ path, message }) => {
        errorMessages[path.join("-")] = message;
    });

    return errorMessages;
};
