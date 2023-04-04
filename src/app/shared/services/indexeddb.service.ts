import { Injectable } from '@angular/core';
import Dexie from 'dexie';


@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
    db: any;

    constructor() {
        this.createDatabase();
    }

    private createDatabase() {
        this.db = new Dexie('DexieDB');
        this.db.version(1).stores({
            posiciones: `&created_at, latitude, longitude, accuracy`
        });
    }

    addPosicionToIndexedDb(posicion: any) {
        console.log('addPosicionToIndexedDb', posicion);
        this.db.posiciones
        .add(posicion)
        .then(async () => {
            const allItems: any[] = await this.db.posiciones.toArray();
            console.log('posicion saved in DB, DB is now', allItems);
        })
        .catch(e => {
                console.log('Error posicion: ' + (e.stack || e));
        });
    }

    async removeItemsFromIndexedDb(response: any): Promise<any> {
    
        return new Promise(async (resolve, reject) => {

            if (response.success) {
                const Result = response.result;
                
                // BORRAR INDEXDB
                Result.posicionesCreadas.map(async posicion => {
                    await this.db.posiciones.delete(posicion.created_at).then(() => {
                        console.log(`position deleted locally`, posicion);
                    })
                });

            } else {
                resolve({
                    success: false,
                    message: "No encontró respuesta a evaluar"
                });
            }

        });

    }

}
