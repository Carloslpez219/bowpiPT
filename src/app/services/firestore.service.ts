import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, query, where, getDocs, updateDoc, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  item$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  datosUsuario: any;
  data = null;
  
  constructor(private storage: Storage) { 
    this.storage.create();
  }

  //recetas

  getItems(): Observable<any[]> {
    const itemCollection = collection(this.firestore, 'recipes');
    return collectionData(itemCollection, { idField: 'id' });
  }

  updateItemDone(itemId: string, done: boolean): Promise<void> {
    const itemDoc = doc(this.firestore, `recipes/${itemId}`);
    return updateDoc(itemDoc, { done: done });
  }

  updateItemCalificacion(itemId: string, calificacion: string): Promise<void> {
    const itemDoc = doc(this.firestore, `recipes/${itemId}`);
    return updateDoc(itemDoc, { calificacion: calificacion });
  }

  async addRecipe(title: string, description: string): Promise<void> {
    const itemCollection = collection(this.firestore, 'recipes');
    
    const today = new Date();
    const formattedDate = `${('0' + today.getDate()).slice(-2)}/${('0' + (today.getMonth() + 1)).slice(-2)}/${today.getFullYear()}`;

    const recipe = {
      title: title,
      description: description,
      date: formattedDate
    };

    await addDoc(itemCollection, recipe);
  }

  //users

  async login(username: string, password: string): Promise<{ success: boolean, type?: string }> {
    const userCollection = collection(this.firestore, 'users');
    const q = query(userCollection, where('user', '==', username), where('password', '==', password));
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      await this.datosLocalStorage( userData );
      return { success: true, type: userData['type'] };
    } else {
      this.data = null;
      this.storage.clear();
      return { success: false };
    }
  }

  async datosLocalStorage( data: any){
    this.storage.create();
    this.data = data;
    await this.storage.set('datos', data);
  }
  
}
