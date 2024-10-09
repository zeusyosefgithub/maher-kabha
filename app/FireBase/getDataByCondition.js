import { useEffect, useState } from "react";
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestore } from "./firebase";

export const useGetDataByCondition = (myCollection, value1, value2, value3) => {
    const [list, setList] = useState([]);
    const colle = collection(firestore, myCollection);
    const condition = where(value1, value2, value3);

    useEffect(() => {
        const q = query(colle, condition);
        const unsubscribe = onSnapshot(q, (snap) => {
            setList(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return () => unsubscribe();
    }, [myCollection, value1, value2, value3]);

    return list;
};


export const useGetDataByConditionTwo = (myCollection, value1, value2, value3,value4,value5,value6) => {
    const [list, setList] = useState([]);
    const colle = collection(firestore, myCollection);
    const condition1 = where(value1, value2, value3);
    const condition2 = where(value4, value5, value6);

    useEffect(() => {
        const q = query(colle, condition1,condition2);
        const unsubscribe = onSnapshot(q, (snap) => {
            setList(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return () => unsubscribe();
    }, [myCollection, value1, value2, value3]);

    return list;
};


export const useGetDataByConditionWithoutUseEffect = (myCollection, field, operator, value, callback) => {
    const q = query(collection(firestore, myCollection), where(field, operator, value));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
    });
    return unsubscribe;
};

export const useGetDataByConditionWithoutUseEffectTwoQueres = (myCollection,value1, value2, value3, value4, value5, value6, callback) => {
    const q = query(collection(firestore, myCollection), where(value1, value2, value3), where(value4, value5, value6));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
    });
    return unsubscribe;
};


export const useGetDataByConditionWithoutUseEffectWithTwo = async (myCollection, value1, value2, value3, value4, value5, value6) => {
    const q = query(collection(firestore, myCollection), where(value1, value2, value3), where(value4, value5, value6));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id : doc.id,
        ...doc.data()
    }));
};

export const useGetDataByLimit = (myCollection, limt,callback) => {
    //asc
    const q = query(collection(firestore, myCollection), orderBy("msbar",'desc'), limit(limt));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
    });
    return unsubscribe;
};



export const fetchDocumentByCondition = async (collectionName, conditionField, conditionValue) => {
    try {
        const q = query(
            collection(firestore, collectionName),
            where(conditionField, '==', conditionValue),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // No matching document found
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        data.id = doc.id;

        return data;
    } catch (error) {
        console.error("Error fetching document:", error);
        throw new Error("Error fetching document");
    }
};


