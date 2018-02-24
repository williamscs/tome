export class Metadata {
    id: string;
    mimeType: string;
    name: string;
    parents: Array<string>;
    editable: boolean;

    constructor() {
        this.id = null;
        this.name = 'tome-save.json';
        this.mimeType = 'text/plain';
        this.parents = ['appDataFolder'];
        this.editable = true;
    }
}
