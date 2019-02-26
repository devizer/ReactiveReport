// Separate file per kind of message
import dispatcher from "./ErrorsOnlyDispatcher";

export const ERRORS_ONLY_ACTION = "ChangeErrorsOnly";

export function changeErrorsOnly(errorsOnly) {
    dispatcher.dispatch({
        type: ERRORS_ONLY_ACTION,
        value: errorsOnly
    })
}
