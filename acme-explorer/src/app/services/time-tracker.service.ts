import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, limit, Timestamp } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {

  constructor(private firestore: Firestore) { }

  async getTimeUrlByActor(userId: string): Promise<any[]> {
    console.log("explorerTime", userId);
    const timeRef = collection(this.firestore, 'urlTracker'); 

    const q = query(timeRef, where("actorId", "==", userId));
    const querySnapshot = await getDocs(q);
    const times: any[] | PromiseLike<any[]> = [];

    querySnapshot.forEach((doc) => {
      times.push({ id: doc.id, ...doc.data() });
    });

    console.log(times);
    return times;
  }


  async createorUpdateUrlTime(url: String, idUser: string, time: number): Promise<void> {

    const urlRef = collection(this.firestore, 'urlTracker');

    const q = query(
      urlRef,
      where("url", "==", url),
      where("actorId", "==", idUser),
      limit(1)
    );

    try {
        // Ejecuta la consulta
        const querySnapshot = await getDocs(q);
        
        // Comprueba si se encontró algún documento
        if (!querySnapshot.empty) {
          // Obtén la referencia del primer documento encontrado
          console.log(querySnapshot.docs[0])
          const firstDocument = querySnapshot.docs[0];

          // Accede al campo "time" del primer documento
          const timeBefore = firstDocument.get("timeTracker");
          const newTime = timeBefore + time;
          console.log(time);
          const docRef = querySnapshot.docs[0].ref;
            
          // Actualiza el documento
          await updateDoc(docRef, {
              url: url,
              actorId: idUser,
              timeTracker: newTime
          });
          
          console.log('Time updated successfully');
        } else {
          const urlRef = await addDoc(collection(this.firestore, 'urlTracker'), {
            url: url,
            actorId: idUser,
            timeTracker: time
          });
          console.log('Time created successfully');
        }
    } catch (error) {
        console.error('Error updating the document: ', error);
    }
  }
}
