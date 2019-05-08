import { useEffect, useState } from 'react';
import { db } from './firebase';

export default function useCollection(path, orderBy, where = []) {
  const [docs, setDocs] = useState([]);
  const [queryField, queryOperator, queryValue] = where;
  useEffect(() => {
    let collections = db.collection(path);
    if (orderBy) {
      collections = collections.orderBy(orderBy);
    }
    if (queryField) {
      collections = collections.where(queryField, queryOperator, queryValue);
    }
    return collections.onSnapshot(snapshot => {
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setDocs(docs);
    });
  }, [orderBy, path, queryField, queryOperator, queryValue]);
  return docs;
}
