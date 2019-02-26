import dispatcher from "./ErrorsOnlyDispatcher";
import {EventEmitter} from "events";
import * as ErrorsOnlyActions from "./ErrorsOnlyActions";

class AppStore extends EventEmitter {

    constructor() {
        super();
        // local copy per message
        this.activeErrorsOnly = false;
        
    }

    // single handler for the app for each kind of message
    handleActions(action) {
        switch (action.type) {
            // a casr per message
            case ErrorsOnlyActions.ERRORS_ONLY_ACTION: {
                this.activeErrorsOnly = action.value;
                this.emit("storeUpdated");
                break;
            }
            default: {
            }
        }
    }

    // a method per message
    getErrorsOnly() {
        return this.activeErrorsOnly;
    }
}

const appStore = new AppStore();
dispatcher.register(appStore.handleActions.bind(appStore));
export default appStore;
